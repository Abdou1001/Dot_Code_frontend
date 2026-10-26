"use client";

import {useMemo} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Star, User} from "lucide-react";
import Image from "next/image";
import {Testimonial} from "@/types/data";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";

interface TestimonialsTableProps {
    data: Testimonial[];
    isLoading: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        totalResults: number;
    };
    onPageChange: (page: number) => void;
    onEdit: (testimonial: Testimonial) => void;
    onDelete: (id: string) => void;
}

export function TestimonialsTable({
    data,
    isLoading,
    pagination,
    onPageChange,
    onEdit,
    onDelete,
}: TestimonialsTableProps) {
    const columns = useMemo<ColumnDef<Testimonial>[]>(
        () => [
            {
                accessorKey: "client_name",
                header: "العميل",
                cell: ({row}) => {
                    const item = row.original;
                    return (
                        <div className="flex items-center gap-3 py-1">
                            <div className="relative size-10 rounded-full overflow-hidden bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                                {item.client_image_url ? (
                                    <Image
                                        src={item.client_image_url}
                                        alt={item.client_name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="size-5 text-blue-400" />
                                )}
                            </div>
                            <div>
                                <span className="font-semibold text-white text-sm block">
                                    {item.client_name}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {item.client_role || ""}{item.client_role && item.company ? " - " : ""}{item.company || ""}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "rating",
                header: "التقييم",
                cell: ({row}) => {
                    const rating = row.original.rating ?? 5;
                    return (
                        <div className="flex items-center gap-1">
                            {Array.from({length: 5}).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`size-3.5 ${
                                        i < rating
                                            ? "text-amber-400 fill-amber-400"
                                            : "text-slate-600"
                                    }`}
                                />
                            ))}
                        </div>
                    );
                },
            },
            {
                accessorKey: "testimonial",
                header: "نص التقييم",
                cell: ({row}) => (
                    <p className="text-xs text-slate-300 max-w-xs truncate" title={row.original.testimonial}>
                        {row.original.testimonial}
                    </p>
                ),
            },
            {
                accessorKey: "is_published",
                header: "الحالة",
                cell: ({row}) => (
                    <DataTableStatus status={row.original.is_published} type="boolean" />
                ),
            },
            {
                id: "actions",
                header: "الإجراءات",
                cell: ({row}) => {
                    const item = row.original;
                    return (
                        <DataTableActions
                            onEdit={() => onEdit(item)}
                            onDelete={() => onDelete(item.id)}
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
