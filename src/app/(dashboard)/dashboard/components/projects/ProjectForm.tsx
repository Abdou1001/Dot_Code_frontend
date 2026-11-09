"use client";

import {useEffect, useState, useCallback} from "react";
import {useForm, Controller} from "react-hook-form";
import {useQueryClient} from "@tanstack/react-query";
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
    AlertCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
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
import {Project, ProjectTranslation} from "@/types/data";
import {
    createProject,
    updateProject,
    upsertProjectTranslation,
    getProjectTranslations,
    getProjectTechnologies,
    assignProjectTechnology,
    removeProjectTechnology,
    getProjectCategories,
    assignProjectCategory,
    removeProjectCategory,
    getProjectImages,
    uploadProjectImage,
    updateProjectImage,
    deleteProjectImage,
} from "@/services/projects.api";
import {getApiErrorMessage} from "@/hooks/useApiError";
import {
    ProjectTechnologiesSelect,
    ProjectCategoriesSelect,
    ProjectImagesManager,
    StagedProjectImage,
    ExistingProjectImage,
} from "./";

const TiptapEditor = dynamic(
    () => import("@/components/shared/editor/TiptapEditor").then((m) => m.TiptapEditor),
    {
        ssr: false,
        loading: () => (
            <div className="h-44 rounded-xl border border-white/10 bg-white/5 animate-pulse flex items-center justify-center text-xs text-slate-500">
                جاري تحميل محرر النصوص...
            </div>
        ),
    }
);

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

    // Relations & Media State
    const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);
    const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
    const [stagedImages, setStagedImages] = useState<StagedProjectImage[]>([]);
    const [existingImages, setExistingImages] = useState<ExistingProjectImage[]>([]);

    // Sets to prevent duplicate assignments across partial failures
    const [linkedTechIds, setLinkedTechIds] = useState<Set<string>>(new Set());
    const [linkedCatIds, setLinkedCatIds] = useState<Set<string>>(new Set());
    const [savedProjectId, setSavedProjectId] = useState<string | null>(null);

    // Form Submission State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStepNotice, setSubmitStepNotice] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
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

    // Populate data when editing an existing project
    useEffect(() => {
        if (projectToEdit) {
            setValue("slug", projectToEdit.slug || "");
            setValue("status", projectToEdit.status || "draft");
            setValue("featured", Boolean(projectToEdit.featured));
            setValue("sort_order", projectToEdit.sort_order ?? 0);
            setValue("live_url", projectToEdit.live_url || "");
            setValue("github_url", projectToEdit.github_url || "");

            // 1. Translations
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

            // 2. Technologies
            if (projectToEdit.technologies && projectToEdit.technologies.length > 0) {
                const ids = projectToEdit.technologies.map((t) => t.id);
                setSelectedTechIds(ids);
                setLinkedTechIds(new Set(ids));
            } else {
                getProjectTechnologies(projectToEdit.id)
                    .then((res) => {
                        const ids = (res.results || []).map((t) => t.id);
                        setSelectedTechIds(ids);
                        setLinkedTechIds(new Set(ids));
                    })
                    .catch(() => {});
            }

            // 3. Categories
            if (projectToEdit.categories && projectToEdit.categories.length > 0) {
                const ids = projectToEdit.categories.map((c) => c.id);
                setSelectedCatIds(ids);
                setLinkedCatIds(new Set(ids));
            } else {
                getProjectCategories(projectToEdit.id)
                    .then((res) => {
                        const ids = (res.results || []).map((c) => c.id);
                        setSelectedCatIds(ids);
                        setLinkedCatIds(new Set(ids));
                    })
                    .catch(() => {});
            }

            // 4. Images
            if (projectToEdit.images && projectToEdit.images.length > 0) {
                setExistingImages(projectToEdit.images);
            } else {
                getProjectImages(projectToEdit.id)
                    .then((res) => {
                        setExistingImages(res.results || []);
                    })
                    .catch(() => {});
            }
        }
    }, [projectToEdit, initialTranslations, setValue]);

    // Handlers for existing image modifications
    const handleDeleteExistingImage = useCallback(async (imageId: string) => {
        const currentId = projectToEdit?.id || savedProjectId;
        if (!currentId) return;

        try {
            await deleteProjectImage(currentId, imageId);
            setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
            queryClient.invalidateQueries({queryKey: ["project-images", currentId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم حذف الصورة بنجاح");
        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "فشل حذف الصورة"));
        }
    }, [projectToEdit?.id, savedProjectId, queryClient]);

    const handleSetExistingFeatured = useCallback(async (imageId: string) => {
        const currentId = projectToEdit?.id || savedProjectId;
        if (!currentId) return;

        try {
            await updateProjectImage(currentId, imageId, {is_featured: true});
            setExistingImages((prev) =>
                prev.map((img) => ({
                    ...img,
                    is_featured: img.id === imageId,
                }))
            );
            // Un-feature staged images
            setStagedImages((prev) =>
                prev.map((img) => ({
                    ...img,
                    is_featured: false,
                }))
            );
            queryClient.invalidateQueries({queryKey: ["project-images", currentId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            toast.success("تم تعيين الصورة كصورة رئيسية");
        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "فشل تحديث الصورة"));
        }
    }, [projectToEdit?.id, savedProjectId, queryClient]);

    const handleUpdateExistingImage = useCallback(
        async (
            imageId: string,
            payload: {alt?: string; sort_order?: number; is_featured?: boolean}
        ) => {
            const currentId = projectToEdit?.id || savedProjectId;
            if (!currentId) return;

            try {
                await updateProjectImage(currentId, imageId, payload);
                setExistingImages((prev) =>
                    prev.map((img) => {
                        if (img.id === imageId) {
                            return {
                                ...img,
                                alt: payload.alt !== undefined ? payload.alt : img.alt,
                                sort_order:
                                    payload.sort_order !== undefined
                                        ? payload.sort_order
                                        : img.sort_order,
                                is_featured:
                                    payload.is_featured !== undefined
                                        ? payload.is_featured
                                        : img.is_featured,
                            };
                        }
                        if (payload.is_featured) {
                            return {...img, is_featured: false};
                        }
                        return img;
                    })
                );
                if (payload.is_featured) {
                    setStagedImages((prev) =>
                        prev.map((img) => ({...img, is_featured: false}))
                    );
                }
                queryClient.invalidateQueries({queryKey: ["project-images", currentId]});
                queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
                toast.success("تم تحديث بيانات الصورة بنجاح");
            } catch (err: any) {
                toast.error(getApiErrorMessage(err, "فشل تحديث بيانات الصورة"));
            }
        },
        [projectToEdit?.id, savedProjectId, queryClient]
    );

    // Multi-Step Sequential Creation & Partial Failure Recovery Workflow
    const handleSubmitProject = async (values: ProjectFormValues) => {
        const cleanSlug = values.slug.trim();
        if (!cleanSlug) {
            toast.error("يرجى إدخال الرابط المختصر (slug)");
            return;
        }
        if (!values.ar_title.trim() && !values.en_title.trim()) {
            toast.error("يرجى إدخال عنوان المشروع على الأقل بلغة واحدة");
            return;
        }

        setIsSubmitting(true);
        const errors: string[] = [];
        let currentProjectId = projectToEdit?.id || savedProjectId;

        try {
            // STEP 1: Core Project Record
            setSubmitStepNotice(
                currentProjectId
                    ? "جاري تحديث بيانات المشروع الأساسية..."
                    : "جاري إنشاء المشروع الأساسي..."
            );

            if (currentProjectId) {
                await updateProject(currentProjectId, {
                    slug: cleanSlug,
                    status: values.status,
                    featured: values.featured,
                    sort_order: Number(values.sort_order) || 0,
                    live_url: values.live_url.trim() || null,
                    github_url: values.github_url.trim() || null,
                });
            } else {
                const res = await createProject({
                    slug: cleanSlug,
                    status: values.status,
                    featured: values.featured,
                    sort_order: Number(values.sort_order) || 0,
                    live_url: values.live_url.trim() || null,
                    github_url: values.github_url.trim() || null,
                });
                currentProjectId = res.results.id;
                setSavedProjectId(currentProjectId);
            }

            if (!currentProjectId) {
                throw new Error("تعذر استلام معرف المشروع من الخادم");
            }

            // STEP 2: Arabic & English Translations
            setSubmitStepNotice("جاري حفظ ترجمات المشروع...");
            if (values.ar_title.trim()) {
                try {
                    await upsertProjectTranslation(currentProjectId, "ar", {
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
                } catch (err: any) {
                    errors.push(`فشل حفظ الترجمة العربية: ${getApiErrorMessage(err)}`);
                }
            }

            if (values.en_title.trim()) {
                try {
                    await upsertProjectTranslation(currentProjectId, "en", {
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
                } catch (err: any) {
                    errors.push(`فشل حفظ الترجمة الإنجليزية: ${getApiErrorMessage(err)}`);
                }
            }

            // STEP 3: Technologies Association
            setSubmitStepNotice("جاري ربط التقنيات البرمجية...");
            if (isEdit) {
                // Add newly selected
                const toAdd = selectedTechIds.filter((id) => !linkedTechIds.has(id));
                for (const techId of toAdd) {
                    try {
                        await assignProjectTechnology(currentProjectId, techId);
                        setLinkedTechIds((prev) => new Set([...prev, techId]));
                    } catch (err: any) {
                        errors.push(`فشل ربط إحدى التقنيات: ${getApiErrorMessage(err)}`);
                    }
                }
                // Remove deselected
                const toRemove = Array.from(linkedTechIds).filter(
                    (id) => !selectedTechIds.includes(id)
                );
                for (const techId of toRemove) {
                    try {
                        await removeProjectTechnology(currentProjectId, techId);
                        setLinkedTechIds((prev) => {
                            const next = new Set(prev);
                            next.delete(techId);
                            return next;
                        });
                    } catch (err: any) {
                        errors.push(`فشل إزالة إحدى التقنيات: ${getApiErrorMessage(err)}`);
                    }
                }
            } else {
                // For new projects, link all selected not yet linked
                const unlinked = selectedTechIds.filter((id) => !linkedTechIds.has(id));
                for (const techId of unlinked) {
                    try {
                        await assignProjectTechnology(currentProjectId, techId);
                        setLinkedTechIds((prev) => new Set([...prev, techId]));
                    } catch (err: any) {
                        errors.push(`فشل ربط إحدى التقنيات: ${getApiErrorMessage(err)}`);
                    }
                }
            }

            // STEP 4: Categories Association
            setSubmitStepNotice("جاري ربط تصنيفات المشروع...");
            if (isEdit) {
                // Add newly selected
                const toAdd = selectedCatIds.filter((id) => !linkedCatIds.has(id));
                for (const catId of toAdd) {
                    try {
                        await assignProjectCategory(currentProjectId, catId);
                        setLinkedCatIds((prev) => new Set([...prev, catId]));
                    } catch (err: any) {
                        errors.push(`فشل ربط أحد التصنيفات: ${getApiErrorMessage(err)}`);
                    }
                }
                // Remove deselected
                const toRemove = Array.from(linkedCatIds).filter(
                    (id) => !selectedCatIds.includes(id)
                );
                for (const catId of toRemove) {
                    try {
                        await removeProjectCategory(currentProjectId, catId);
                        setLinkedCatIds((prev) => {
                            const next = new Set(prev);
                            next.delete(catId);
                            return next;
                        });
                    } catch (err: any) {
                        errors.push(`فشل إزالة أحد التصنيفات: ${getApiErrorMessage(err)}`);
                    }
                }
            } else {
                // For new projects, link all selected not yet linked
                const unlinked = selectedCatIds.filter((id) => !linkedCatIds.has(id));
                for (const catId of unlinked) {
                    try {
                        await assignProjectCategory(currentProjectId, catId);
                        setLinkedCatIds((prev) => new Set([...prev, catId]));
                    } catch (err: any) {
                        errors.push(`فشل ربط أحد التصنيفات: ${getApiErrorMessage(err)}`);
                    }
                }
            }

            // STEP 5: Upload Queued Images
            if (stagedImages.length > 0) {
                setSubmitStepNotice("جاري رفع صور المشروع...");
                const successfullyUploadedIds: string[] = [];

                for (let i = 0; i < stagedImages.length; i++) {
                    const img = stagedImages[i];
                    if (img.status === "success") continue;

                    // Set status to uploading
                    setStagedImages((prev) =>
                        prev.map((item) =>
                            item.id === img.id ? {...item, status: "uploading"} : item
                        )
                    );

                    try {
                        const formData = new FormData();
                        formData.append("image", img.file);
                        if (img.alt) formData.append("alt", img.alt.trim());
                        formData.append("sort_order", String(Number(img.sort_order) || 0));
                        formData.append("is_featured", img.is_featured ? "true" : "false");

                        await uploadProjectImage(currentProjectId, formData);

                        successfullyUploadedIds.push(img.id);
                        setStagedImages((prev) =>
                            prev.map((item) =>
                                item.id === img.id ? {...item, status: "success"} : item
                            )
                        );
                    } catch (err: any) {
                        const errorMsg = getApiErrorMessage(err, "فشل الرفع");
                        errors.push(`فشل رفع الصورة "${img.file.name}": ${errorMsg}`);
                        setStagedImages((prev) =>
                            prev.map((item) =>
                                item.id === img.id
                                    ? {...item, status: "error", errorMessage: errorMsg}
                                    : item
                            )
                        );
                    }
                }

                // Remove successfully uploaded images from staged list
                if (successfullyUploadedIds.length > 0) {
                    setStagedImages((prev) =>
                        prev.filter((item) => !successfullyUploadedIds.includes(item.id))
                    );
                }
            }

            // STEP 6: Refresh Query Caches
            queryClient.invalidateQueries({queryKey: ["dashboard-projects"]});
            queryClient.invalidateQueries({queryKey: ["dashboard-projects-count"]});
            queryClient.invalidateQueries({queryKey: ["project-technologies", currentProjectId]});
            queryClient.invalidateQueries({queryKey: ["project-categories", currentProjectId]});
            queryClient.invalidateQueries({queryKey: ["project-images", currentProjectId]});
            queryClient.invalidateQueries({queryKey: ["project-edit", currentProjectId]});

            // STEP 7: Outcome Evaluation
            if (errors.length === 0) {
                toast.success(
                    isEdit
                        ? "تم تحديث المشروع بنجاح"
                        : "تم إنشاء المشروع وربط جميع بياناته بنجاح"
                );
                router.push("/dashboard/projects");
            } else {
                toast.error(
                    `تم إنشاء أو تحديث المشروع الأساسي بنجاح، ولكن تعذر استكمال بعض العناصر:\n• ${errors
                        .slice(0, 3)
                        .join("\n• ")}\nيمكنك إعادة المحاولة الآن دون تكرار إنشاء المشروع.`,
                    {duration: 8000}
                );
            }
        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "فشل حفظ المشروع"));
        } finally {
            setIsSubmitting(false);
            setSubmitStepNotice(null);
        }
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
        <form onSubmit={handleSubmit(handleSubmitProject)} className="space-y-6">
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

                {/* Top Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/projects")}
                        disabled={isSubmitting}
                        className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 flex-1 sm:flex-initial">
                        إلغاء
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(0,117,255,0.4)] flex-1 sm:flex-initial gap-2">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>{submitStepNotice || "جاري الحفظ..."}</span>
                            </>
                        ) : (
                            <>
                                <Save className="size-4" />
                                <span>
                                    {savedProjectId
                                        ? "إعادة محاولة الربط"
                                        : isEdit
                                        ? "حفظ التعديلات"
                                        : "حفظ ونشر المشروع"}
                                </span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Layout Grid: 2 Columns for Translations & Editor, 1 Column for Sidebar */}
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
                                            <Label className="text-xs text-slate-400">عنوان الصفحة (Meta Title)</Label>
                                            <Input
                                                {...register("ar_meta_title")}
                                                placeholder="العنوان الظاهر في محركات البحث"
                                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">وصف الصفحة (Meta Description)</Label>
                                            <Input
                                                {...register("ar_meta_description")}
                                                placeholder="مقتطف موجز يظهر في نتائج البحث"
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
                                            placeholder="e.g. Cloud E-Commerce Ecosystem"
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

                {/* Left Sidebar Configuration (1 Col) - Structured in Exact Specified Order */}
                <div className="space-y-6">
                    {/* SECTION 1: Publishing & Display Settings */}
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
                                onValueChange={(val: any) => setValue("status", val)}
                                disabled={isSubmitting}>
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
                                    disabled={isSubmitting}
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
                                disabled={isSubmitting}
                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                            />
                            <p className="text-[10px] text-slate-500">
                                الأرقام الأقل تظهر أولاً في قائمة المعرض
                            </p>
                        </div>
                    </div>

                    {/* SECTION 2: Technologies */}
                    <ProjectTechnologiesSelect
                        selectedIds={selectedTechIds}
                        onChange={setSelectedTechIds}
                        disabled={isSubmitting}
                    />

                    {/* SECTION 3: Categories */}
                    <ProjectCategoriesSelect
                        selectedIds={selectedCatIds}
                        onChange={setSelectedCatIds}
                        disabled={isSubmitting}
                    />

                    {/* SECTION 4: Project Images */}
                    <ProjectImagesManager
                        stagedImages={stagedImages}
                        onStagedImagesChange={setStagedImages}
                        existingImages={existingImages}
                        onDeleteExistingImage={handleDeleteExistingImage}
                        onSetExistingFeatured={handleSetExistingFeatured}
                        onUpdateExistingImage={handleUpdateExistingImage}
                        slug={watch("slug")}
                        disabled={isSubmitting}
                    />

                    {/* SECTION 5: URLs & Identifiers Card */}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                                className="border-white/10 bg-white/5 text-slate-100 text-xs"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    {/* SECTION 6: Bottom Save Action & Status */}
                    <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent space-y-3">
                        {savedProjectId && !isEdit && (
                            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-200 text-xs space-y-1">
                                <p className="font-semibold flex items-center gap-1.5">
                                    <AlertCircle className="size-3.5 text-amber-400" />
                                    <span>تم إنشاء المشروع الأساسي مسبقاً</span>
                                </p>
                                <p className="text-[11px] text-amber-300/80 leading-relaxed">
                                    معرف المشروع: <span className="font-mono text-white">{savedProjectId}</span>.
                                    النقر أدناه سيكمل ربط العناصر والصور المتبقية فقط دون تكرار إنشاء المشروع.
                                </p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(0,117,255,0.4)] h-11 text-sm font-semibold gap-2">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>{submitStepNotice || "جاري الحفظ..."}</span>
                                </>
                            ) : (
                                <>
                                    <Check className="size-4" />
                                    <span>
                                        {savedProjectId
                                            ? "إعادة محاولة الربط والحفظ"
                                            : isEdit
                                            ? "حفظ التعديلات"
                                            : "حفظ ونشر المشروع"}
                                    </span>
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.push("/dashboard/projects")}
                            disabled={isSubmitting}
                            className="w-full text-xs text-slate-400 hover:text-white">
                            الرجوع دون حفظ
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
