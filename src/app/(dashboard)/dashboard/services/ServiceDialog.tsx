"use client";

import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Loader2} from "lucide-react";
import {Service} from "@/types/data";
import {
    createService,
    updateService,
    getServiceTranslations,
    upsertServiceTranslation,
} from "@/services/services.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

interface ServiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    serviceToEdit?: Service | null;
}

interface ServiceFormValues {
    slug: string;
    icon: string;
    sort_order: number;
    is_active: boolean;
    // Arabic translation
    ar_title: string;
    ar_description: string;
    // English translation
    en_title: string;
    en_description: string;
}

export function ServiceDialog({open, onOpenChange, serviceToEdit}: ServiceDialogProps) {
    const queryClient = useQueryClient();
    const isEdit = Boolean(serviceToEdit);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {isSubmitting},
    } = useForm<ServiceFormValues>({
        defaultValues: {
            slug: "",
            icon: "",
            sort_order: 0,
            is_active: true,
            ar_title: "",
            ar_description: "",
            en_title: "",
            en_description: "",
        },
    });

    const isActive = watch("is_active");

    useEffect(() => {
        if (serviceToEdit && open) {
            setValue("slug", serviceToEdit.slug || "");
            setValue("icon", serviceToEdit.icon || "");
            setValue("sort_order", serviceToEdit.sort_order ?? 0);
            setValue("is_active", serviceToEdit.is_active ?? true);

            getServiceTranslations(serviceToEdit.id)
                .then((res) => {
                    const translations = res.results || [];
                    const ar = translations.find((t) => t.locale === "ar");
                    const en = translations.find((t) => t.locale === "en");

                    if (ar) {
                        setValue("ar_title", ar.title || "");
                        setValue("ar_description", ar.description || "");
                    }
                    if (en) {
                        setValue("en_title", en.title || "");
                        setValue("en_description", en.description || "");
                    }
                })
                .catch(() => {});
        } else if (!serviceToEdit && open) {
            reset({
                slug: "",
                icon: "",
                sort_order: 0,
                is_active: true,
                ar_title: "",
                ar_description: "",
                en_title: "",
                en_description: "",
            });
        }
    }, [serviceToEdit, open, setValue, reset]);

    const mutation = useMutation({
        mutationFn: async (values: ServiceFormValues) => {
            let serviceId = serviceToEdit?.id;

            const basePayload = {
                slug: values.slug.trim(),
                icon: values.icon.trim() || undefined,
                sort_order: Number(values.sort_order),
                is_active: values.is_active,
            };

            if (isEdit && serviceId) {
                await updateService(serviceId, basePayload);
            } else {
                const res = await createService(basePayload);
                serviceId = res.results.id;
            }

            // Save Arabic translation
            if (serviceId && values.ar_title.trim()) {
                await upsertServiceTranslation(serviceId, "ar", {
                    locale: "ar",
                    title: values.ar_title.trim(),
                    description: values.ar_description.trim() || undefined,
                });
            }

            // Save English translation
            if (serviceId && values.en_title.trim()) {
                await upsertServiceTranslation(serviceId, "en", {
                    locale: "en",
                    title: values.en_title.trim(),
                    description: values.en_description.trim() || undefined,
                });
            }

            return serviceId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-services"]});
            toast.success(isEdit ? "تم تحديث الخدمة بنجاح" : "تم إنشاء الخدمة بنجاح");
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حفظ الخدمة"));
        },
    });

    const onSubmit = (values: ServiceFormValues) => {
        if (!values.slug) {
            toast.error("يرجى إدخال الرابط المختصر (slug)");
            return;
        }
        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="vision-card border-white/10 text-slate-100 max-w-xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {isEdit ? "تعديل الخدمة" : "إضافة خدمة برمجية جديدة"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                        إعداد تفاصيل الخدمة والترجمات العربية والإنجليزية
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-xl p-1">
                            <TabsTrigger
                                value="general"
                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-xs font-medium">
                                البيانات الأساسية
                            </TabsTrigger>
                            <TabsTrigger
                                value="arabic"
                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-xs font-medium">
                                المحتوى العربي
                            </TabsTrigger>
                            <TabsTrigger
                                value="english"
                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-xs font-medium">
                                English Content
                            </TabsTrigger>
                        </TabsList>

                        {/* General Tab */}
                        <TabsContent value="general" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">الرابط المختصر (Slug) *</Label>
                                <Input
                                    {...register("slug", {required: true})}
                                    dir="ltr"
                                    placeholder="e.g. web-development"
                                    className="border-white/10 bg-white/5 text-slate-100 font-mono text-xs"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">الأيقونة (Icon identifier or URL)</Label>
                                <Input
                                    {...register("icon")}
                                    dir="ltr"
                                    placeholder="code-bracket or svg link"
                                    className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-center pt-2">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">الترتيب</Label>
                                    <Input
                                        {...register("sort_order")}
                                        type="number"
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-6">
                                    <Checkbox
                                        id="service-active"
                                        checked={isActive}
                                        onCheckedChange={(val) => setValue("is_active", Boolean(val))}
                                        className="border-white/20 data-[state=checked]:bg-blue-600"
                                    />
                                    <Label htmlFor="service-active" className="text-xs text-slate-300 cursor-pointer">
                                        خدمة نشطة
                                    </Label>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Arabic Tab */}
                        <TabsContent value="arabic" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">عنوان الخدمة (بالعربية)</Label>
                                <Input
                                    {...register("ar_title")}
                                    placeholder="مثال: تطوير تطبيقات الويب السحابية"
                                    className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">وصف الخدمة</Label>
                                <Textarea
                                    {...register("ar_description")}
                                    rows={4}
                                    placeholder="شرح وتفاصيل الخدمة وما تقدمه للعملاء..."
                                    className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                />
                            </div>
                        </TabsContent>

                        {/* English Tab */}
                        <TabsContent value="english" className="space-y-4 pt-4" dir="ltr">
                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">Service Title (English)</Label>
                                <Input
                                    {...register("en_title")}
                                    placeholder="e.g. Cloud Web Application Development"
                                    className="border-white/10 bg-white/5 text-slate-100 text-xs text-left"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">Service Description</Label>
                                <Textarea
                                    {...register("en_description")}
                                    rows={4}
                                    placeholder="Detailed description of the service and deliverables..."
                                    className="border-white/10 bg-white/5 text-slate-100 text-xs text-left"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="gap-2 sm:justify-start pt-3">
                        <Button
                            type="submit"
                            disabled={mutation.isPending || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-[0_0_15px_rgba(0,117,255,0.4)]">
                            {mutation.isPending && <Loader2 className="size-3.5 animate-spin ml-1.5" />}
                            {isEdit ? "حفظ التعديلات" : "إنشاء الخدمة"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs">
                            إلغاء
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
