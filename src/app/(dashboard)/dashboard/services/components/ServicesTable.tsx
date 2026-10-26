"use client";

import {useMemo} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Wrench} from "lucide-react";
import {Service} from "@/types/data";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";

interface ServicesTableProps {
    data: Service[];
    isLoading: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        totalResults: number;
    };
    onPageChange: (page: number) => void;
    onEdit: (service: Service) => void;
    onDelete: (id: string) => void;
}

export function ServicesTable({
    data,
    isLoading,
    pagination,
    onPageChange,
    onEdit,
    onDelete,
}: ServicesTableProps) {
    const columns = useMemo<ColumnDef<Service>[]>(
        () => [
            {
                accessorKey: "slug",
                header: "الخدمة (Slug)",
                cell: ({row}) => {
                    const service = row.original;
                    return (
                        <div className="flex items-center gap-3 py-1">
                            <div className="size-8 rounded-lg bg-cyan-600/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400 font-bold text-xs">
                                <Wrench className="size-4" />
                            </div>
                            <span className="font-mono text-xs font-semibold text-white" dir="ltr">
                                {service.slug}
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "icon",
                header: "معرّف الأيقونة",
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
                    const service = row.original;
                    return (
                        <DataTableActions
                            onEdit={() => onEdit(service)}
                            onDelete={() => onDelete(service.id)}
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
