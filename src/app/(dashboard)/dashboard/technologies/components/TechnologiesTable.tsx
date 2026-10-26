"use client";

import {useMemo} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Code2} from "lucide-react";
import {Technology} from "@/types/data";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";

interface TechnologiesTableProps {
    data: Technology[];
    isLoading: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        totalResults: number;
    };
    onPageChange: (page: number) => void;
    onEdit: (tech: Technology) => void;
    onDelete: (id: string) => void;
}

export function TechnologiesTable({
    data,
    isLoading,
    pagination,
    onPageChange,
    onEdit,
    onDelete,
}: TechnologiesTableProps) {
    const columns = useMemo<ColumnDef<Technology>[]>(
        () => [
            {
                accessorKey: "name",
                header: "التقنية",
                cell: ({row}) => {
                    const tech = row.original;
                    return (
                        <div className="flex items-center gap-3 py-1">
                            <div className="size-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 font-bold text-xs">
                                <Code2 className="size-4" />
                            </div>
                            <span className="font-semibold text-white text-sm">
                                {tech.name}
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "slug",
                header: "الرابط المختصر (Slug)",
                cell: ({row}) => (
                    <span className="font-mono text-xs text-blue-400" dir="ltr">
                        {row.original.slug}
                    </span>
                ),
            },
            {
                accessorKey: "icon",
                header: "الأيقونة",
                cell: ({row}) => (
                    <span className="text-xs text-slate-400 font-mono" dir="ltr">
                        {row.original.icon || "—"}
                    </span>
                ),
            },
            {
                accessorKey: "is_active",
                header: "الحالة",
                cell: ({row}) => (
                    <DataTableStatus status={row.original.is_active} type="boolean" />
                ),
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
                id: "actions",
                header: "الإجراءات",
                cell: ({row}) => {
                    const tech = row.original;
                    return (
                        <DataTableActions
                            onEdit={() => onEdit(tech)}
                            onDelete={() => onDelete(tech.id)}
                        />
                    );
                },
            },
        ],
        [onEdit, onDelete]
    );

    return (
        <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={onPageChange}
        />
    );
}
