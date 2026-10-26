"use client";

import {ColumnDef} from "@tanstack/react-table";
import {
    ExternalLink,
    GitBranch,
    Image as ImageIcon,
    Layers,
    Star,
} from "lucide-react";
import {Project} from "@/types/data";
import {ProjectStatus} from "@/types/enums";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectTableColumnsProps {
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
    onManageMedia: (project: Project) => void;
    onManageRelations: (project: Project) => void;
    onStatusChange: (id: string, status: ProjectStatus) => void;
}

export function getProjectTableColumns({
    onEdit,
    onDelete,
    onManageMedia,
    onManageRelations,
    onStatusChange,
}: ProjectTableColumnsProps): ColumnDef<Project>[] {
    return [
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
                                onClick={() => onStatusChange(project.id, "published")}>
                                منشور (Published)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onStatusChange(project.id, "draft")}>
                                مسودة (Draft)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onStatusChange(project.id, "hidden")}>
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
                            onClick={() => onManageMedia(project)}
                            className="h-7 text-xs border-white/10 bg-white/5 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/30 flex items-center gap-1">
                            <ImageIcon className="size-3" />
                            <span>الصور</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onManageRelations(project)}
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
                        onEdit={() => onEdit(project)}
                        onDelete={() => onDelete(project.id)}
                    />
                );
            },
        },
    ];
}
