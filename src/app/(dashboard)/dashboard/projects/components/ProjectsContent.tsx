"use client";

import {useState, useCallback} from "react";
import {useRouter} from "next/navigation";
import {Project} from "@/types/data";
import {ProjectStatus} from "@/types/enums";
import {
    useProjects,
    useDeleteProject,
    useUpdateProjectStatus,
} from "@/hooks/projects/useProjects";
import {ProjectsSkeleton} from "../../components/skeletons";
import {Button} from "@/components/ui/button";
import {ProjectsToolbar} from "./ProjectsToolbar";
import {ProjectsTable} from "./ProjectsTable";
import {ProjectsDialogs} from "./ProjectsDialogs";

export function ProjectsContent() {
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

    // Query projects with automatic debounce, cancellation, and previous-data preservation
    const {data, isLoading, isFetching, isError, refetch} = useProjects({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter === "all" ? undefined : (statusFilter as ProjectStatus),
    });

    const deleteMutation = useDeleteProject();
    const statusMutation = useUpdateProjectStatus();

    // Event callbacks
    const handleSearch = useCallback((val: string) => {
        setSearch(val);
        setPage(1);
    }, []);

    const handleStatusFilterChange = useCallback((val: string) => {
        setStatusFilter(val);
        setPage(1);
    }, []);

    const handleAddNew = useCallback(() => {
        router.push("/dashboard/projects/new");
    }, [router]);

    const handleEdit = useCallback(
        (project: Project) => {
            router.push(`/dashboard/projects/${project.id}/edit`);
        },
        [router]
    );

    const handleDelete = useCallback((id: string) => {
        setDeletingId(id);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleManageMedia = useCallback((project: Project) => {
        setMediaProject(project);
        setIsMediaDialogOpen(true);
    }, []);

    const handleManageRelations = useCallback((project: Project) => {
        setRelationsProject(project);
        setIsRelationsDialogOpen(true);
    }, []);

    const handleStatusChange = useCallback(
        (id: string, status: ProjectStatus) => {
            statusMutation.mutate({id, status});
        },
        [statusMutation]
    );

    const handlePageChange = useCallback((p: number) => {
        setPage(p);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (deletingId) {
            deleteMutation.mutate(deletingId, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setDeletingId(null);
                },
            });
        }
    }, [deletingId, deleteMutation]);

    if (isLoading && !data) {
        return <ProjectsSkeleton />;
    }

    const projects = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <ProjectsToolbar
                statusFilter={statusFilter}
                onSearch={handleSearch}
                onStatusFilterChange={handleStatusFilterChange}
                onAddNew={handleAddNew}
            />

            {isError && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between text-sm">
                    <span>تعذر جلب المشاريع من الخادم.</span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refetch()}
                        className="border-red-500/30 hover:bg-red-500/20 text-red-300">
                        إعادة المحاولة
                    </Button>
                </div>
            )}

            <ProjectsTable
                data={projects}
                isLoading={isLoading}
                isFetching={isFetching}
                pagination={
                    pagination
                        ? {
                              page: pagination.page,
                              totalPages: pagination.totalPages,
                              totalResults: pagination.totalResults,
                          }
                        : undefined
                }
                onPageChange={handlePageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onManageMedia={handleManageMedia}
                onManageRelations={handleManageRelations}
                onStatusChange={handleStatusChange}
            />

            <ProjectsDialogs
                isMediaDialogOpen={isMediaDialogOpen}
                onMediaOpenChange={setIsMediaDialogOpen}
                mediaProject={mediaProject}
                isRelationsDialogOpen={isRelationsDialogOpen}
                onRelationsOpenChange={setIsRelationsDialogOpen}
                relationsProject={relationsProject}
                isDeleteDialogOpen={isDeleteDialogOpen}
                onDeleteOpenChange={setIsDeleteDialogOpen}
                isDeletePending={deleteMutation.isPending}
                onConfirmDelete={handleConfirmDelete}
            />
        </div>
    );
}

export default ProjectsContent;

