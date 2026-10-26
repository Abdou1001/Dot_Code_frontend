"use client";

import {use} from "react";
import {useQuery} from "@tanstack/react-query";
import {ProjectForm} from "@/app/(dashboard)/dashboard/components/projects";
import {
    getDashboardProjects,
    getProjectTranslations,
    getProjectBySlug,
} from "@/services/projects.api";
import {Loader2} from "lucide-react";

export default function EditProjectPage({
    params,
}: {
    params: Promise<{id: string}>;
}) {
    const resolvedParams = use(params);
    const projectId = resolvedParams.id;

    // Fetch project details
    const {
        data: project,
        isLoading: isProjectLoading,
        isError,
    } = useQuery({
        queryKey: ["project-edit", projectId],
        queryFn: async () => {
            // First search in dashboard projects list
            try {
                const list = await getDashboardProjects({limit: 100});
                const found = list.results.find(
                    (p) => p.id === projectId || p.slug === projectId
                );
                if (found) return found;
            } catch {}

            // Fallback to getProjectBySlug
            const res = await getProjectBySlug(projectId);
            return res.results;
        },
    });

    // Fetch translations
    const {data: translations, isLoading: isTransLoading} = useQuery({
        queryKey: ["project-translations-edit", projectId],
        queryFn: async () => {
            const res = await getProjectTranslations(projectId);
            return res.results || [];
        },
        enabled: Boolean(projectId),
    });

    if (isProjectLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="size-8 text-blue-500 animate-spin" />
                <p className="text-sm text-slate-400">جاري تحميل بيانات المشروع...</p>
            </div>
        );
    }

    if (isError || !project) {
        return (
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-200 text-center space-y-3">
                <p className="font-semibold">تعذر العثور على بيانات هذا المشروع</p>
                <p className="text-xs text-slate-400">
                    قد يكون المشروع قد تم حذفه أو أن المعرف غير صالح.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ProjectForm
                projectToEdit={project}
                initialTranslations={translations}
                isLoading={isTransLoading}
            />
        </div>
    );
}
