"use client";

import {useState} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {ColumnDef} from "@tanstack/react-table";
import {toast} from "sonner";
import {
    ExternalLink,
    GitBranch,
    Image as ImageIcon,
    Layers,
    Star,
} from "lucide-react";
import {Project} from "@/types/data";
import {
    useProjects,
    useDeleteProject,
    useUpdateProjectStatus,
} from "@/hooks/projects/useProjects";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";
import {ProjectDialog} from "./ProjectDialog";
import {ProjectMediaDialog} from "./ProjectMediaDialog";
import {ProjectRelationsDialog} from "./ProjectRelationsDialog";
import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {getApiErrorMessage} from "@/hooks/useApiError";

export default function ProjectsPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Dialog states
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

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

    // Delete Mutation
    const deleteMutation = useDeleteProject();

    // Status change Mutation
    const statusMutation = useUpdateProjectStatus();

    const projects = data?.results || [];
    const pagination = data?.pagination;

    const columns: ColumnDef<Project>[] = [
        {
            accessorKey: "slug",
            header: "المشروع والروابط",
            cell: ({row}) => {
                const project = row.original;
                return (
                    <div className="space-y-1 py-1">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold text-white">
                                {project.slug}
                            </span>
                            {project.featured && (
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px]">
                                    <Star className="size-2.5 fill-amber-400" />
                                    <span>مميز</span>
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                    <ExternalLink className="size-3" />
                                    <span>المعاينة</span>
                                </a>
                            )}
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                                    <GitBranch className="size-3" />
                                    <span>الكود</span>
                                </a>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({row}) => {
                const project = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="cursor-pointer transition-opacity hover:opacity-80">
                                <DataTableStatus status={project.status} type="project" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                            <DropdownMenuItem
                                onClick={() => statusMutation.mutate({id: project.id, status: "published"})}>
                                منشور (Published)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => statusMutation.mutate({id: project.id, status: "draft"})}>
                                مسودة (Draft)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => statusMutation.mutate({id: project.id, status: "hidden"})}>
                                مخفي (Hidden)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            accessorKey: "sort_order",
            header: "الترتيب",
            cell: ({row}) => (
                <span className="text-xs text-slate-300 font-mono">
                    {row.original.sort_order ?? 0}
                </span>
            ),
        },
        {
            id: "sub_resources",
            header: "الوسائط والتصنيف",
            cell: ({row}) => {
                const project = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setMediaProject(project);
                                setIsMediaDialogOpen(true);
                            }}
                            className="h-7 text-xs border-white/10 bg-white/5 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/30 flex items-center gap-1">
                            <ImageIcon className="size-3" />
                            <span>الصور</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setRelationsProject(project);
                                setIsRelationsDialogOpen(true);
                            }}
                            className="h-7 text-xs border-white/10 bg-white/5 hover:bg-purple-600/20 hover:text-purple-300 hover:border-purple-500/30 flex items-center gap-1">
                            <Layers className="size-3" />
                            <span>الروابط</span>
                        </Button>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "الإجراءات",
            cell: ({row}) => {
                const project = row.original;
                return (
                    <DataTableActions
                        onEdit={() => {
                            setEditingProject(project);
                            setIsProjectDialogOpen(true);
                        }}
                        onDelete={() => {
                            setDeletingId(project.id);
                            setIsDeleteDialogOpen(true);
                        }}
                    />
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                        إدارة المشاريع
                    </h2>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">
                        إدارة مشاريع المعرض، الترجمات العربية والإنجليزية، الصور، والتقنيات المرتبطة
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <DataTableToolbar
                searchPlaceholder="بحث في المشاريع بالـ slug..."
                buttonText="إضافة مشروع جديد"
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                onAdd={() => {
                    setEditingProject(null);
                    setIsProjectDialogOpen(true);
                }}>
                <div className="w-40">
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => {
                            setStatusFilter(val);
                            setPage(1);
                        }}>
                        <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                            <SelectValue placeholder="تصفية بالحالة" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                            <SelectItem value="all">كل الحالات</SelectItem>
                            <SelectItem value="published">منشور</SelectItem>
                            <SelectItem value="draft">مسودة</SelectItem>
                            <SelectItem value="hidden">مخفي</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </DataTableToolbar>

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

            {/* Modals */}
            <ProjectDialog
                open={isProjectDialogOpen}
                onOpenChange={setIsProjectDialogOpen}
                projectToEdit={editingProject}
            />

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
                description="هل أنت متأكد من رغبتك في حذف هذا المشروع؟ سيتم حذف جميع الصور والترجمات والروابط المرتبطة به."
                isLoading={deleteMutation.isPending}
                onConfirm={() => {
                    if (deletingId) deleteMutation.mutate(deletingId);
                }}
            />
        </div>
    );
}
