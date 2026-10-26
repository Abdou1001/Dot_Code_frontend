"use client";

import {useMemo} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {ContactMessage} from "@/types/data";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";

interface MessagesTableProps {
    data: ContactMessage[];
    isLoading: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        totalResults: number;
    };
    onPageChange: (page: number) => void;
    onView: (message: ContactMessage) => void;
    onDelete: (id: string) => void;
}

export function MessagesTable({
    data,
    isLoading,
    pagination,
    onPageChange,
    onView,
    onDelete,
}: MessagesTableProps) {
    const columns = useMemo<ColumnDef<ContactMessage>[]>(
        () => [
            {
                accessorKey: "name",
                header: "المرسل",
                cell: ({row}) => {
                    const item = row.original;
                    return (
                        <div className="space-y-0.5 py-1">
                            <span className="font-semibold text-white text-sm block">
                                {item.name}
                            </span>
                            <span className="text-xs text-slate-400 font-mono" dir="ltr">
                                {item.email}
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "subject",
                header: "الموضوع والرسالة",
                cell: ({row}) => {
                    const item = row.original;
                    return (
                        <div className="space-y-0.5 max-w-sm">
                            <span className="text-xs font-semibold text-slate-200 block truncate">
                                {item.subject || "بدون موضوع"}
                            </span>
                            <p className="text-xs text-slate-400 truncate">
                                {item.message}
                            </p>
                        </div>
                    );
                },
            },
            {
                accessorKey: "status",
                header: "الحالة",
                cell: ({row}) => (
                    <DataTableStatus status={row.original.status} type="message" />
                ),
            },
            {
                accessorKey: "created_at",
                header: "تاريخ الاستلام",
                cell: ({row}) => {
                    const d = row.original.created_at;
                    return (
                        <span className="text-xs text-slate-400">
                            {d
                                ? new Date(d).toLocaleDateString("ar-EG", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "—"}
                        </span>
                    );
                },
            },
            {
                id: "actions",
                header: "الإجراءات",
                cell: ({row}) => {
                    const msg = row.original;
                    return (
                        <DataTableActions
                            onView={() => onView(msg)}
                            onDelete={() => onDelete(msg.id)}
                        />
                    );
                },
            },
        ],
        [onView, onDelete]
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
