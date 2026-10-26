"use client";

import {useState, useMemo} from "react";
import {useRouter} from "next/navigation";
import {Project} from "@/types/data";
import {
    useProjects,
    useDeleteProject,
    useUpdateProjectStatus,
} from "@/hooks/projects/useProjects";
import {ProjectsSkeleton} from "../components/skeletons";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import {
    getProjectTableColumns,
    ProjectTableToolbar,
} from "@/app/(dashboard)/dashboard/components/projects";
import {ProjectMediaDialog} from "./ProjectMediaDialog";
import {ProjectRelationsDialog} from "./ProjectRelationsDialog";
import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";
import {Button} from "@/components/ui/button";

export default function ProjectsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Dialog states for Sub-resources
    const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
    const [mediaProject, setMediaProject] = useState<Project | null>(null);

    const [isRelationsDialogOpen, setIsRelationsDialogOpen] = useState(false);
    const [relationsProject, setRelationsProject] = useState<Project | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Query projects from backend
    const {data, isLoading, isError, refetch} = useProjects({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter === "all" ? undefined : (statusFilter as any),
    });

    // Mutations
    const deleteMutation = useDeleteProject();
    const statusMutation = useUpdateProjectStatus();

    // Table Columns definition
    const columns = useMemo(
        () =>
            getProjectTableColumns({
                onEdit: (project) => router.push(`/dashboard/projects/${project.id}/edit`),
                onDelete: (id) => {
                    setDeletingId(id);
                    setIsDeleteDialogOpen(true);
                },
                onManageMedia: (project) => {
                    setMediaProject(project);
                    setIsMediaDialogOpen(true);
                },
                onManageRelations: (project) => {
                    setRelationsProject(project);
                    setIsRelationsDialogOpen(true);
                },
                onStatusChange: (id, status) => {
                    statusMutation.mutate({id, status});
                },
            }),
        [router, statusMutation]
    );

    if (isLoading && !data) {
        return <ProjectsSkeleton />;
    }

    const projects = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                        إدارة المشاريع
                    </h2>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">
                        إدارة مشاريع المعرض، المحتوى باللغتين، التوصيف المنسق بـ Tiptap، والصور والتقنيات المرتبطة
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <ProjectTableToolbar
                search={search}
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={(val) => {
                    setStatusFilter(val);
                    setPage(1);
                }}
                onAddNew={() => router.push("/dashboard/projects/new")}
            />

            {/* Error Message */}
            {isError && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between text-sm">
                    <span>تعذر جلب المشاريع من الخادم.</span>
                    <Button size="sm" variant="outline" onClick={() => refetch()}>
                        إعادة المحاولة
                    </Button>
                </div>
            )}

            {/* Table */}
            <DataTable
                columns={columns}
                data={projects}
                isLoading={isLoading}
                pagination={
                    pagination
                        ? {
                              page: pagination.page,
                              totalPages: pagination.totalPages,
                              totalResults: pagination.totalResults,
                          }
                        : undefined
                }
                onPageChange={(p) => setPage(p)}
            />

            {/* Modals for media and relations */}
            <ProjectMediaDialog
                open={isMediaDialogOpen}
                onOpenChange={setIsMediaDialogOpen}
                project={mediaProject}
            />

            <ProjectRelationsDialog
                open={isRelationsDialogOpen}
                onOpenChange={setIsRelationsDialogOpen}
                project={relationsProject}
            />

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="حذف المشروع"
                description="هل أنت متأكد من رغبتك في حذف هذا المشروع؟ سيتم حذف جميع الصور والترجمات والروابط المرتبطة به نهائياً."
                isLoading={deleteMutation.isPending}
                onConfirm={() => {
                    if (deletingId) {
                        deleteMutation.mutate(deletingId, {
                            onSuccess: () => {
                                setIsDeleteDialogOpen(false);
                                setDeletingId(null);
                            },
                        });
                    }
                }}
            />
        </div>
    );
}

