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
import {Checkbox} from "@/components/ui/checkbox";
import {Loader2} from "lucide-react";
import {Technology} from "@/types/data";
import {createTechnology, updateTechnology} from "@/services/technologies.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

interface TechnologyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    technologyToEdit?: Technology | null;
}

interface TechnologyFormValues {
    name: string;
    slug: string;
    icon: string;
    sort_order: number;
    is_active: boolean;
}

export function TechnologyDialog({open, onOpenChange, technologyToEdit}: TechnologyDialogProps) {
    const queryClient = useQueryClient();
    const isEdit = Boolean(technologyToEdit);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {isSubmitting},
    } = useForm<TechnologyFormValues>({
        defaultValues: {
            name: "",
            slug: "",
            icon: "",
            sort_order: 0,
            is_active: true,
        },
    });

    const isActive = watch("is_active");

    useEffect(() => {
        if (technologyToEdit && open) {
            setValue("name", technologyToEdit.name || "");
            setValue("slug", technologyToEdit.slug || "");
            setValue("icon", technologyToEdit.icon || "");
            setValue("sort_order", technologyToEdit.sort_order ?? 0);
            setValue("is_active", technologyToEdit.is_active ?? true);
        } else if (!technologyToEdit && open) {
            reset({
                name: "",
                slug: "",
                icon: "",
                sort_order: 0,
                is_active: true,
            });
        }
    }, [technologyToEdit, open, setValue, reset]);

    const mutation = useMutation({
        mutationFn: async (values: TechnologyFormValues) => {
            const payload = {
                name: values.name.trim(),
                slug: values.slug.trim(),
                icon: values.icon.trim() || undefined,
                sort_order: Number(values.sort_order),
                is_active: values.is_active,
            };

            if (isEdit && technologyToEdit) {
                return await updateTechnology(technologyToEdit.id, payload);
            } else {
                return await createTechnology(payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-technologies"]});
            queryClient.invalidateQueries({queryKey: ["all-system-technologies"]});
            toast.success(isEdit ? "تم تحديث التقنية بنجاح" : "تم إنشاء التقنية بنجاح");
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حفظ التقنية"));
        },
    });

    const onSubmit = (values: TechnologyFormValues) => {
        if (!values.name || !values.slug) {
            toast.error("يرجى إدخال اسم التقنية والرابط المختصر (slug)");
            return;
        }
        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="vision-card border-white/10 text-slate-100 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {isEdit ? "تعديل التقنية" : "إضافة تقنية جديدة"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                        تحديد اسم التقنية وأيقونتها والمسار البرمجي
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-300">اسم التقنية *</Label>
                        <Input
                            {...register("name", {required: true})}
                            placeholder="مثال: Next.js"
                            className="border-white/10 bg-white/5 text-slate-100 text-xs"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-slate-300">الرابط المختصر (Slug) *</Label>
                        <Input
                            {...register("slug", {required: true})}
                            dir="ltr"
                            placeholder="nextjs"
                            className="border-white/10 bg-white/5 text-slate-100 font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-slate-300">معرّف الأيقونة أو الرابط (Icon)</Label>
                        <Input
                            {...register("icon")}
                            dir="ltr"
                            placeholder="e.g. nextjs.svg or devicon-nextjs"
                            className="border-white/10 bg-white/5 text-slate-100 text-xs"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center pt-1">
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
                                id="tech-active"
                                checked={isActive}
                                onCheckedChange={(val) => setValue("is_active", Boolean(val))}
                                className="border-white/20 data-[state=checked]:bg-blue-600"
                            />
                            <Label htmlFor="tech-active" className="text-xs text-slate-300 cursor-pointer">
                                تقنية نشطة
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:justify-start pt-3">
                        <Button
                            type="submit"
                            disabled={mutation.isPending || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-[0_0_15px_rgba(0,117,255,0.4)]">
                            {mutation.isPending && <Loader2 className="size-3.5 animate-spin ml-1.5" />}
                            {isEdit ? "حفظ التعديلات" : "إنشاء التقنية"}
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
