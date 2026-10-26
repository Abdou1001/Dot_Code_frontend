"use client";

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {Code2, FolderTree, Plus, X} from "lucide-react";
import {Project, Technology, Category} from "@/types/data";
import {
    getProjectTechnologies,
    assignProjectTechnology,
    removeProjectTechnology,
    getProjectCategories,
    assignProjectCategory,
    removeProjectCategory,
} from "@/services/projects.api";
import {getDashboardTechnologies} from "@/services/technologies.api";
import {getDashboardCategories} from "@/services/categories.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

interface ProjectRelationsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
}

export function ProjectRelationsDialog({open, onOpenChange, project}: ProjectRelationsDialogProps) {
    const queryClient = useQueryClient();

    // 1. Fetch currently assigned project technologies & categories
    const {data: assignedTechData, isLoading: isAssignedTechLoading} = useQuery({
        queryKey: ["project-technologies", project?.id],
        queryFn: () => (project ? getProjectTechnologies(project.id) : null),
        enabled: Boolean(project && open),
    });

    const {data: assignedCatData, isLoading: isAssignedCatLoading} = useQuery({
        queryKey: ["project-categories", project?.id],
        queryFn: () => (project ? getProjectCategories(project.id) : null),
        enabled: Boolean(project && open),
    });

    // 2. Fetch all system technologies & categories
    const {data: allTechData} = useQuery({
        queryKey: ["all-system-technologies"],
        queryFn: () => getDashboardTechnologies({limit: 100}),
        enabled: Boolean(open),
    });

    const {data: allCatData} = useQuery({
        queryKey: ["all-system-categories"],
        queryFn: () => getDashboardCategories({limit: 100}),
        enabled: Boolean(open),
    });

    const assignedTechnologies: Technology[] = assignedTechData?.results || [];
    const assignedCategories: Category[] = assignedCatData?.results || [];

    const allTechnologies: Technology[] = allTechData?.results || [];
    const allCategories: Category[] = allCatData?.results || [];

    const assignedTechIds = new Set(assignedTechnologies.map((t) => t.id));
    const assignedCatIds = new Set(assignedCategories.map((c) => c.id));

    const unassignedTechnologies = allTechnologies.filter((t) => !assignedTechIds.has(t.id));
    const unassignedCategories = allCategories.filter((c) => !assignedCatIds.has(c.id));

    // Mutations for Technologies
    const assignTechMutation = useMutation({
        mutationFn: (techId: string) => {
            if (!project) throw new Error("No project selected");
            return assignProjectTechnology(project.id, techId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-technologies", project?.id]});
            toast.success("تم ربط التقنية بالمشروع");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل ربط التقنية"));
        },
    });

    const removeTechMutation = useMutation({
        mutationFn: (techId: string) => {
            if (!project) throw new Error("No project selected");
            return removeProjectTechnology(project.id, techId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-technologies", project?.id]});
            toast.success("تم إزالة التقنية من المشروع");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل إزالة التقنية"));
        },
    });

    // Mutations for Categories
    const assignCatMutation = useMutation({
        mutationFn: (catId: string) => {
            if (!project) throw new Error("No project selected");
            return assignProjectCategory(project.id, catId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-categories", project?.id]});
            toast.success("تم ربط التصنيف بالمشروع");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل ربط التصنيف"));
        },
    });

    const removeCatMutation = useMutation({
        mutationFn: (catId: string) => {
            if (!project) throw new Error("No project selected");
            return removeProjectCategory(project.id, catId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["project-categories", project?.id]});
            toast.success("تم إزالة التصنيف من المشروع");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل إزالة التصنيف"));
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="vision-card border-white/10 text-slate-100 max-w-xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                        <span>الروابط والتصنيفات:</span>
                        <span className="text-blue-400 font-mono text-base">{project?.slug}</span>
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                        ربط المشروع بالتقنيات والتصنيفات المناسبة لفلترة المعرض
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    {/* Technologies Section */}
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <Code2 className="size-4 text-blue-400" />
                            <span>التقنيات المستخدمة ({assignedTechnologies.length})</span>
                        </div>

                        {/* Currently Linked Technologies */}
                        <div className="flex flex-wrap gap-2 min-h-[36px] items-center">
                            {isAssignedTechLoading ? (
                                <Skeleton className="h-6 w-32 bg-white/10" />
                            ) : assignedTechnologies.length === 0 ? (
                                <span className="text-xs text-slate-500">لا توجد تقنيات مرتبطة</span>
                            ) : (
                                assignedTechnologies.map((t) => (
                                    <Badge
                                        key={t.id}
                                        className="bg-blue-600/20 text-blue-300 border-blue-500/30 pl-1.5 flex items-center gap-1.5 text-xs py-1">
                                        <span>{t.name}</span>
                                        <button
                                            type="button"
                                            disabled={removeTechMutation.isPending}
                                            onClick={() => removeTechMutation.mutate(t.id)}
                                            className="hover:bg-blue-500/30 rounded p-0.5 transition-colors">
                                            <X className="size-3" />
                                        </button>
                                    </Badge>
                                ))
                            )}
                        </div>

                        {/* Add Technology Quick Select */}
                        {unassignedTechnologies.length > 0 && (
                            <div className="pt-2 border-t border-white/5">
                                <span className="text-[11px] text-slate-400 mb-2 block">إضافة تقنية:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {unassignedTechnologies.map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => assignTechMutation.mutate(t.id)}
                                            disabled={assignTechMutation.isPending}
                                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-600/20 text-slate-300 hover:text-blue-300 border border-white/5 hover:border-blue-500/30 text-xs transition-colors flex items-center gap-1">
                                            <Plus className="size-3" />
                                            <span>{t.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Categories Section */}
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <FolderTree className="size-4 text-purple-400" />
                            <span>التصنيفات ({assignedCategories.length})</span>
                        </div>

                        {/* Currently Linked Categories */}
                        <div className="flex flex-wrap gap-2 min-h-[36px] items-center">
                            {isAssignedCatLoading ? (
                                <Skeleton className="h-6 w-32 bg-white/10" />
                            ) : assignedCategories.length === 0 ? (
                                <span className="text-xs text-slate-500">لا توجد تصنيفات مرتبطة</span>
                            ) : (
                                assignedCategories.map((c) => (
                                    <Badge
                                        key={c.id}
                                        className="bg-purple-600/20 text-purple-300 border-purple-500/30 pl-1.5 flex items-center gap-1.5 text-xs py-1">
                                        <span>{c.name_ar || c.name}</span>
                                        <button
                                            type="button"
                                            disabled={removeCatMutation.isPending}
                                            onClick={() => removeCatMutation.mutate(c.id)}
                                            className="hover:bg-purple-500/30 rounded p-0.5 transition-colors">
                                            <X className="size-3" />
                                        </button>
                                    </Badge>
                                ))
                            )}
                        </div>

                        {/* Add Category Quick Select */}
                        {unassignedCategories.length > 0 && (
                            <div className="pt-2 border-t border-white/5">
                                <span className="text-[11px] text-slate-400 mb-2 block">إضافة تصنيف:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {unassignedCategories.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => assignCatMutation.mutate(c.id)}
                                            disabled={assignCatMutation.isPending}
                                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 border border-white/5 hover:border-purple-500/30 text-xs transition-colors flex items-center gap-1">
                                            <Plus className="size-3" />
                                            <span>{c.name_ar || c.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
