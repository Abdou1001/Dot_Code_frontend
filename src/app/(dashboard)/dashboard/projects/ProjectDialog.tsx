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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Checkbox} from "@/components/ui/checkbox";
import {Loader2} from "lucide-react";
import {Project} from "@/types/data";
import {
    createProject,
    updateProject,
    upsertProjectTranslation,
    getProjectTranslations,
} from "@/services/projects.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectToEdit?: Project | null;
}

interface ProjectFormValues {
    slug: string;
    status: "draft" | "published" | "hidden";
    featured: boolean;
    sort_order: number;
    live_url: string;
    github_url: string;
    // Arabic translation
    ar_title: string;
    ar_description: string;
    ar_role: string;
    ar_challenge: string;
    ar_solution: string;
    ar_result: string;
    ar_meta_title: string;
    ar_meta_description: string;
    // English translation
    en_title: string;
    en_description: string;
    en_role: string;
    en_challenge: string;
    en_solution: string;
    en_result: string;
    en_meta_title: string;
    en_meta_description: string;
}

export function ProjectDialog({open, onOpenChange, projectToEdit}: ProjectDialogProps) {
    const queryClient = useQueryClient();
    const isEdit = Boolean(projectToEdit);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {isSubmitting},
    } = useForm<ProjectFormValues>({
        defaultValues: {
            slug: "",
            status: "draft",
            featured: false,
            sort_order: 0,
            live_url: "",
            github_url: "",
            ar_title: "",
            ar_description: "",
            ar_role: "",
            ar_challenge: "",
            ar_solution: "",
            ar_result: "",
            ar_meta_title: "",
            ar_meta_description: "",
            en_title: "",
            en_description: "",
            en_role: "",
            en_challenge: "",
            en_solution: "",
            en_result: "",
            en_meta_title: "",
            en_meta_description: "",
        },
    });

    const currentStatus = watch("status");
    const isFeatured = watch("featured");

    // Fetch existing translations when editing
    useEffect(() => {
        if (projectToEdit && open) {
            setValue("slug", projectToEdit.slug || "");
            setValue("status", projectToEdit.status || "draft");
            setValue("featured", Boolean(projectToEdit.featured));
            setValue("sort_order", projectToEdit.sort_order ?? 0);
            setValue("live_url", projectToEdit.live_url || "");
            setValue("github_url", projectToEdit.github_url || "");

            // Fetch translations
            getProjectTranslations(projectToEdit.id)
                .then((res) => {
                    const translations = res.results || [];
                    const ar = translations.find((t) => t.locale === "ar");
                    const en = translations.find((t) => t.locale === "en");

                    if (ar) {
                        setValue("ar_title", ar.title || "");
                        setValue("ar_description", ar.description || "");
                        setValue("ar_role", ar.role || "");
                        setValue("ar_challenge", ar.challenge || "");
                        setValue("ar_solution", ar.solution || "");
                        setValue("ar_result", ar.result || "");
                        setValue("ar_meta_title", ar.meta_title || "");
                        setValue("ar_meta_description", ar.meta_description || "");
                    }
                    if (en) {
                        setValue("en_title", en.title || "");
                        setValue("en_description", en.description || "");
                        setValue("en_role", en.role || "");
                        setValue("en_challenge", en.challenge || "");
                        setValue("en_solution", en.solution || "");
                        setValue("en_result", en.result || "");
                        setValue("en_meta_title", en.meta_title || "");
                        setValue("en_meta_description", en.meta_description || "");
                    }
                })
                .catch(() => {});
        } else if (!projectToEdit && open) {
            reset({
                slug: "",
                status: "draft",
                featured: false,
                sort_order: 0,
                live_url: "",
                github_url: "",
                ar_title: "",
                ar_description: "",
                ar_role: "",
                ar_challenge: "",
                ar_solution: "",
                ar_result: "",
                ar_meta_title: "",
                ar_meta_description: "",
                en_title: "",
                en_description: "",
                en_role: "",
                en_challenge: "",
                en_solution: "",
                en_result: "",
                en_meta_title: "",
                en_meta_description: "",
            });
        }
    }, [projectToEdit, open, setValue, reset]);

    const mutation = useMutation({
        mutationFn: async (values: ProjectFormValues) => {
            let projectId = projectToEdit?.id;

            // 1. Create or update core project
            if (isEdit && projectId) {
                await updateProject(projectId, {
                    slug: values.slug,
                    status: values.status,
                    featured: values.featured,
                    sort_order: Number(values.sort_order),
                    live_url: values.live_url || null,
                    github_url: values.github_url || null,
                });
            } else {
                const res = await createProject({
                    slug: values.slug,
                    status: values.status,
                    featured: values.featured,
                    sort_order: Number(values.sort_order),
                    live_url: values.live_url || null,
                    github_url: values.github_url || null,
                });
                projectId = res.results.id;
            }

            // 2. Save Arabic translation if title exists
            if (projectId && values.ar_title.trim()) {
                await upsertProjectTranslation(projectId, "ar", {
                    locale: "ar",
                    title: values.ar_title.trim(),
                    description: values.ar_description.trim() || undefined,
                    role: values.ar_role.trim() || undefined,
                    challenge: values.ar_challenge.trim() || undefined,
                    solution: values.ar_solution.trim() || undefined,
                    result: values.ar_result.trim() || undefined,
                    meta_title: values.ar_meta_title.trim() || undefined,
                    meta_description: values.ar_meta_description.trim() || undefined,
                });
            }

            // 3. Save English translation if title exists
            if (projectId && values.en_title.trim()) {
                await upsertProjectTranslation(projectId, "en", {
                    locale: "en",
                    title: values.en_title.trim(),
                    description: values.en_description.trim() || undefined,
                    role: values.en_role.trim() || undefined,
                    challenge: values.en_challenge.trim() || undefined,
                    solution: values.en_solution.trim() || undefined,
                    result: values.en_result.trim() || undefined,
                    meta_title: values.en_meta_title.trim() || undefined,
                    meta_description: values.en_meta_description.trim() || undefined,
                });
            }

            return projectId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects-count"]});
            toast.success(isEdit ? "تم تحديث المشروع بنجاح" : "تم إنشاء المشروع بنجاح");
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حفظ المشروع"));
        },
    });

    const onSubmit = (values: ProjectFormValues) => {
        if (!values.slug) {
            toast.error("يرجى إدخال الرابط المختصر (slug)");
            return;
        }
        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="vision-card border-white/10 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {isEdit ? "تعديل المشروع" : "إضافة مشروع جديد"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                        أدخل تفاصيل المشروع التقنية والترجمات العربية والإنجليزية
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">الرابط المختصر (Slug) *</Label>
                                    <Input
                                        {...register("slug", {required: true})}
                                        dir="ltr"
                                        placeholder="e.g. ecommerce-platform"
                                        className="border-white/10 bg-white/5 text-slate-100 font-mono text-xs"
                                    />
                                    <p className="text-[10px] text-slate-500">حروف إنجليزية صغيرة وشرطات (-) فقط</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">حالة النشر</Label>
                                    <Select
                                        value={currentStatus}
                                        onValueChange={(val: any) => setValue("status", val)}>
                                        <SelectTrigger className="border-white/10 bg-white/5 text-slate-100 text-xs">
                                            <SelectValue placeholder="اختر الحالة" />
                                        </SelectTrigger>
                                        <SelectContent className="border-white/10 bg-[#0B1437] text-slate-100">
                                            <SelectItem value="draft">مسودة (Draft)</SelectItem>
                                            <SelectItem value="published">منشور (Published)</SelectItem>
                                            <SelectItem value="hidden">مخفي (Hidden)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">رابط المعاينة المباشرة (Live URL)</Label>
                                    <Input
                                        {...register("live_url")}
                                        dir="ltr"
                                        type="url"
                                        placeholder="https://example.com"
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">رابط مستودع الكود (Github URL)</Label>
                                    <Input
                                        {...register("github_url")}
                                        dir="ltr"
                                        type="url"
                                        placeholder="https://github.com/..."
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-2">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">الترتيب في العرض</Label>
                                    <Input
                                        {...register("sort_order")}
                                        type="number"
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-6">
                                    <Checkbox
                                        id="featured"
                                        checked={isFeatured}
                                        onCheckedChange={(checked) => setValue("featured", Boolean(checked))}
                                        className="border-white/20 data-[state=checked]:bg-blue-600"
                                    />
                                    <Label htmlFor="featured" className="text-xs text-slate-300 cursor-pointer">
                                        مشروع مميز (Featured Project)
                                    </Label>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Arabic Content Tab */}
                        <TabsContent value="arabic" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">عنوان المشروع (بالعربية) *</Label>
                                <Input
                                    {...register("ar_title")}
                                    placeholder="مثال: منصة التجارة الإلكترونية المتكاملة"
                                    className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">الوصف العام</Label>
                                <Textarea
                                    {...register("ar_description")}
                                    rows={3}
                                    placeholder="تفاصيل المشروع وأهدافه..."
                                    className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">الدور الهندسي (Role)</Label>
                                    <Input
                                        {...register("ar_role")}
                                        placeholder="مثال: مطور رئيسي (Full Stack)"
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">التحدي البرمجي</Label>
                                    <Input
                                        {...register("ar_challenge")}
                                        placeholder="أبرز التحديات التي واجهت المشروع..."
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">الحل المنفذ</Label>
                                    <Input
                                        {...register("ar_solution")}
                                        placeholder="الحل التقني المتبع..."
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">النتيجة المحققة</Label>
                                    <Input
                                        {...register("ar_result")}
                                        placeholder="النتائج والإنجازات..."
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* English Content Tab */}
                        <TabsContent value="english" className="space-y-4 pt-4" dir="ltr">
                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">Project Title (English)</Label>
                                <Input
                                    {...register("en_title")}
                                    placeholder="e.g. Modern E-Commerce Platform"
                                    className="border-white/10 bg-white/5 text-slate-100 text-xs text-left"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-slate-300">Project Description</Label>
                                <Textarea
                                    {...register("en_description")}
                                    rows={3}
                                    placeholder="Overview and key details of the project..."
                                    className="border-white/10 bg-white/5 text-slate-100 text-xs text-left"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">Engineering Role</Label>
                                    <Input
                                        {...register("en_role")}
                                        placeholder="e.g. Lead Full Stack Developer"
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs text-left"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">Challenge</Label>
                                    <Input
                                        {...register("en_challenge")}
                                        placeholder="Technical challenges tackled..."
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs text-left"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">Solution</Label>
                                    <Input
                                        {...register("en_solution")}
                                        placeholder="Architectural solution delivered..."
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs text-left"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-300">Result</Label>
                                    <Input
                                        {...register("en_result")}
                                        placeholder="Impact, metric gains, performance..."
                                        className="border-white/10 bg-white/5 text-slate-100 text-xs text-left"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="gap-2 sm:justify-start">
                        <Button
                            type="submit"
                            disabled={mutation.isPending || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-[0_0_15px_rgba(0,117,255,0.4)]">
                            {mutation.isPending && <Loader2 className="size-4 animate-spin ml-2" />}
                            {isEdit ? "حفظ التعديلات" : "إنشاء المشروع"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                            إلغاء
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
