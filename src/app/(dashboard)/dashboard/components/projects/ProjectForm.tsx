"use client";

import {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {toast} from "sonner";
import {
    ArrowRight,
    Check,
    ExternalLink,
    GitBranch,
    Globe,
    Layers,
    Loader2,
    Save,
    Sparkles,
    Star,
} from "lucide-react";
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
import {TiptapEditor} from "@/components/shared/editor/TiptapEditor";
import {Project, ProjectTranslation} from "@/types/data";
import {
    createProject,
    updateProject,
    upsertProjectTranslation,
    getProjectTranslations,
} from "@/services/projects.api";
import {getApiErrorMessage} from "@/hooks/useApiError";
import {cn} from "@/lib/utils";

export interface ProjectFormValues {
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

interface ProjectFormProps {
    projectToEdit?: Project | null;
    initialTranslations?: ProjectTranslation[];
    isLoading?: boolean;
}

export function ProjectForm({
    projectToEdit,
    initialTranslations,
    isLoading = false,
}: ProjectFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const isEdit = Boolean(projectToEdit);
    const [activeTab, setActiveTab] = useState<"ar" | "en">("ar");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        control,
        formState: {isSubmitting, isDirty},
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

    // Populate data when editing
    useEffect(() => {
        if (projectToEdit) {
            setValue("slug", projectToEdit.slug || "");
            setValue("status", projectToEdit.status || "draft");
            setValue("featured", Boolean(projectToEdit.featured));
            setValue("sort_order", projectToEdit.sort_order ?? 0);
            setValue("live_url", projectToEdit.live_url || "");
            setValue("github_url", projectToEdit.github_url || "");

            const applyTranslations = (translations: ProjectTranslation[]) => {
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
            };

            if (initialTranslations && initialTranslations.length > 0) {
                applyTranslations(initialTranslations);
            } else {
                getProjectTranslations(projectToEdit.id)
                    .then((res) => {
                        applyTranslations(res.results || []);
                    })
                    .catch(() => {});
            }
        }
    }, [projectToEdit, initialTranslations, setValue]);

    const mutation = useMutation({
        mutationFn: async (values: ProjectFormValues) => {
            let projectId = projectToEdit?.id;

            // 1. Create or update core project
            if (isEdit && projectId) {
                await updateProject(projectId, {
                    slug: values.slug.trim(),
                    status: values.status,
                    featured: values.featured,
                    sort_order: Number(values.sort_order) || 0,
                    live_url: values.live_url.trim() || null,
                    github_url: values.github_url.trim() || null,
                });
            } else {
                const res = await createProject({
                    slug: values.slug.trim(),
                    status: values.status,
                    featured: values.featured,
                    sort_order: Number(values.sort_order) || 0,
                    live_url: values.live_url.trim() || null,
                    github_url: values.github_url.trim() || null,
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
            router.push("/dashboard/projects");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حفظ المشروع"));
        },
    });

    const onSubmit = (values: ProjectFormValues) => {
        if (!values.slug.trim()) {
            toast.error("يرجى إدخال الرابط المختصر (slug)");
            return;
        }
        if (!values.ar_title.trim() && !values.en_title.trim()) {
            toast.error("يرجى إدخال عنوان المشروع على الأقل بلغة واحدة");
            return;
        }
        mutation.mutate(values);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="size-8 text-blue-500 animate-spin" />
                <p className="text-sm text-slate-400">جاري تحميل بيانات المشروع...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header & Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/projects"
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all">
                        <ArrowRight className="size-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Link href="/dashboard/projects" className="hover:text-blue-400 transition-colors">
                                إدارة المشاريع
                            </Link>
                            <span>/</span>
                            <span>{isEdit ? "تعديل منشور" : "إنشاء منشور جديد"}</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide mt-1">
                            {isEdit ? `تعديل المشروع: ${projectToEdit?.slug || ""}` : "إنشاء مشروع جديد"}
                        </h2>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/projects")}
                        className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 flex-1 sm:flex-initial">
                        إلغاء
                    </Button>
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(0,117,255,0.4)] flex-1 sm:flex-initial gap-2">
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>جاري الحفظ...</span>
                            </>
                        ) : (
                            <>
                                <Save className="size-4" />
                                <span>{isEdit ? "حفظ التعديلات" : "حفظ ونشر المشروع"}</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area (2 Cols): Translations & Tiptap Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="vision-card rounded-2xl p-5 md:p-6 border border-white/10 space-y-6">
                        <Tabs
                            value={activeTab}
                            onValueChange={(val) => setActiveTab(val as "ar" | "en")}
                            className="w-full">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div>
                                    <h3 className="text-base font-bold text-white">
                                        محتوى المشروع وترجماته
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        قم بكتابة عنوان ووصف وتفاصيل المشروع باللغتين العربية والإنجليزية
                                    </p>
                                </div>
                                <TabsList className="bg-[#060b26]/80 border border-white/10 p-1 rounded-xl">
                                    <TabsTrigger
                                        value="ar"
                                        className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-white text-xs px-3 rounded-lg gap-1.5">
                                        <span>🇸🇦</span>
                                        <span>العربية</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="en"
                                        className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-white text-xs px-3 rounded-lg gap-1.5">
                                        <span>🇬🇧</span>
                                        <span>English</span>
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Arabic Content Tab */}
                            <TabsContent value="ar" className="space-y-5 pt-4" dir="rtl">
                                {/* Title & Role */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-300">
                                            عنوان المشروع (بالعربية) <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            {...register("ar_title")}
                                            placeholder="مثال: منصة التجارة الإلكترونية السحابية"
                                            className="border-white/10 bg-white/5 text-slate-100 text-sm focus:border-blue-500/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-300">
                                            دور العمل / التخصص
                                        </Label>
                                        <Input
                                            {...register("ar_role")}
                                            placeholder="مثال: Full-Stack Developer & UI Designer"
                                            className="border-white/10 bg-white/5 text-slate-100 text-sm focus:border-blue-500/50"
                                        />
                                    </div>
                                </div>

                                {/* Full Rich Text Description with Tiptap */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                            <Sparkles className="size-3.5 text-blue-400" />
                                            <span>الوصف العام والتفصيلي (محرر Tiptap)</span>
                                        </Label>
                                        <span className="text-[11px] text-slate-500">
                                            يدعم العناوين، القوائم، الأكواد، والاقتباسات
                                        </span>
                                    </div>

                                    <Controller
                                        name="ar_description"
                                        control={control}
                                        render={({field}) => (
                                            <TiptapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="اكتب شرحاً شاملاً وتفصيلياً عن المشروع، أهدافه، والتقنيات المستخدمة..."
                                                dir="rtl"
                                                minHeight="260px"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Case Study Breakdown (Challenge, Solution, Result) */}
                                <div className="pt-3 border-t border-white/5 space-y-4">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        تفاصيل ودراسة الحالة (Case Study)
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">التحدي (Challenge)</Label>
                                            <Textarea
                                                {...register("ar_challenge")}
                                                rows={3}
                                                placeholder="المشاكل والتحديات التقنية..."
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">الحل (Solution)</Label>
                                            <Textarea
                                                {...register("ar_solution")}
                                                rows={3}
                                                placeholder="الحلول الهندسية المبتكرة..."
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">النتيجة (Result)</Label>
                                            <Textarea
                                                {...register("ar_result")}
                                                rows={3}
                                                placeholder="النتائج والأثر المحقق..."
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SEO Metadata */}
                                <div className="pt-3 border-t border-white/5 space-y-4">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        بيانات محركات البحث (SEO)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">Meta Title</Label>
                                            <Input
                                                {...register("ar_meta_title")}
                                                placeholder="عنوان الصفحة لمحركات البحث"
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">Meta Description</Label>
                                            <Input
                                                {...register("ar_meta_description")}
                                                placeholder="الوصف الموجز في نتائج البحث"
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* English Content Tab */}
                            <TabsContent value="en" className="space-y-5 pt-4" dir="ltr">
                                {/* Title & Role */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-300">
                                            Project Title (English) <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            {...register("en_title")}
                                            placeholder="e.g. Cloud E-Commerce Platform"
                                            className="border-white/10 bg-white/5 text-slate-100 text-sm focus:border-blue-500/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-300">
                                            Role / Specialization
                                        </Label>
                                        <Input
                                            {...register("en_role")}
                                            placeholder="e.g. Full-Stack Developer & UI Designer"
                                            className="border-white/10 bg-white/5 text-slate-100 text-sm focus:border-blue-500/50"
                                        />
                                    </div>
                                </div>

                                {/* Full Rich Text Description with Tiptap */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                            <Sparkles className="size-3.5 text-blue-400" />
                                            <span>Full Project Description (Tiptap Editor)</span>
                                        </Label>
                                        <span className="text-[11px] text-slate-500">
                                            Supports headings, lists, code, and quotes
                                        </span>
                                    </div>

                                    <Controller
                                        name="en_description"
                                        control={control}
                                        render={({field}) => (
                                            <TiptapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Write a comprehensive description of the project, architecture, and achievements..."
                                                dir="ltr"
                                                minHeight="260px"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Case Study Breakdown */}
                                <div className="pt-3 border-t border-white/5 space-y-4">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        Case Study Breakdown
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">Challenge</Label>
                                            <Textarea
                                                {...register("en_challenge")}
                                                rows={3}
                                                placeholder="Technical challenges faced..."
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">Solution</Label>
                                            <Textarea
                                                {...register("en_solution")}
                                                rows={3}
                                                placeholder="Engineering solutions crafted..."
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">Result</Label>
                                            <Textarea
                                                {...register("en_result")}
                                                rows={3}
                                                placeholder="Measurable business impact..."
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SEO Metadata */}
                                <div className="pt-3 border-t border-white/5 space-y-4">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        Search Engine Optimization (SEO)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">Meta Title</Label>
                                            <Input
                                                {...register("en_meta_title")}
                                                placeholder="Search engine page title"
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">Meta Description</Label>
                                            <Input
                                                {...register("en_meta_description")}
                                                placeholder="Snippet displayed in search results"
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Sidebar Configuration (1 Col) */}
                <div className="space-y-6">
                    {/* Publishing Status Card */}
                    <div className="vision-card rounded-2xl p-5 border border-white/10 space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Layers className="size-4 text-blue-400" />
                            <span>حالة النشر والترتيب</span>
                        </h3>

                        {/* Status Select */}
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-300">حالة ظهور المشروع</Label>
                            <Select
                                value={currentStatus}
                                onValueChange={(val: any) => setValue("status", val)}>
                                <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                                    <SelectItem value="draft">
                                        <span className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-amber-400" />
                                            <span>مسودة (Draft) - غير معروض</span>
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="published">
                                        <span className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-emerald-400" />
                                            <span>منشور (Published) - متاح للجميع</span>
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="hidden">
                                        <span className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-slate-500" />
                                            <span>مخفي (Hidden) - أرشيف</span>
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Featured Checkbox */}
                        <div className="pt-2">
                            <label className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 cursor-pointer transition-colors">
                                <Checkbox
                                    checked={isFeatured}
                                    onCheckedChange={(checked) => setValue("featured", Boolean(checked))}
                                    className="mt-0.5 border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                />
                                <div className="space-y-0.5 text-xs">
                                    <span className="font-semibold text-white flex items-center gap-1.5">
                                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                        <span>مشروع مميز (Featured)</span>
                                    </span>
                                    <p className="text-slate-400 text-[11px] leading-relaxed">
                                        يظهر في صدارة المعرض وفي قسم الأعمال المميزة في الصفحة الرئيسية
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Sort Order */}
                        <div className="space-y-2 pt-2">
                            <Label className="text-xs text-slate-300">أولوية الترتيب (Sort Order)</Label>
                            <Input
                                type="number"
                                {...register("sort_order")}
                                placeholder="0"
                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                            />
                            <p className="text-[10px] text-slate-500">
                                الأرقام الأقل تظهر أولاً في قائمة المعرض
                            </p>
                        </div>
                    </div>

                    {/* URLs & Identifiers Card */}
                    <div className="vision-card rounded-2xl p-5 border border-white/10 space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Globe className="size-4 text-purple-400" />
                            <span>المعرف والروابط</span>
                        </h3>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-300">
                                الرابط الفريد (Slug) <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                {...register("slug")}
                                placeholder="ecommerce-platform"
                                className="border-white/10 bg-white/5 text-slate-100 text-xs font-mono"
                            />
                            <p className="text-[10px] text-slate-500">
                                يستخدم في مسار الصفحة (مثال: /projects/ecommerce-platform)
                            </p>
                        </div>

                        {/* Live URL */}
                        <div className="space-y-2 pt-2">
                            <Label className="text-xs text-slate-300 flex items-center gap-1.5">
                                <ExternalLink className="size-3 text-blue-400" />
                                <span>رابط المعاينة المباشرة (Live Demo)</span>
                            </Label>
                            <Input
                                {...register("live_url")}
                                placeholder="https://example.com"
                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                dir="ltr"
                            />
                        </div>

                        {/* GitHub URL */}
                        <div className="space-y-2 pt-2">
                            <Label className="text-xs text-slate-300 flex items-center gap-1.5">
                                <GitBranch className="size-3 text-purple-400" />
                                <span>رابط الكود المصدري (GitHub)</span>
                            </Label>
                            <Input
                                {...register("github_url")}
                                placeholder="https://github.com/..."
                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    {/* Bottom Save Action */}
                    <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent space-y-3">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(0,117,255,0.4)] h-11 text-sm font-semibold gap-2">
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>جاري الحفظ...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="size-4" />
                                    <span>{isEdit ? "حفظ التعديلات" : "نشر المشروع"}</span>
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.push("/dashboard/projects")}
                            className="w-full text-xs text-slate-400 hover:text-white">
                            الرجوع دون حفظ
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
