"use client";

import React, {useMemo} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Category} from "@/types/data";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";

interface CategoriesTableProps {
    data: Category[];
    isLoading: boolean;
    isFetching?: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        totalResults: number;
    };
    onPageChange: (page: number) => void;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

function CategoriesTableComponent({
    data,
    isLoading,
    isFetching,
    pagination,
    onPageChange,
    onEdit,
    onDelete,
}: CategoriesTableProps) {
    const columns = useMemo<ColumnDef<Category>[]>(
        () => [
            {
                accessorKey: "name",
                header: "اسم التصنيف (EN)",
                cell: ({row}) => (
                    <div className="py-1">
                        <span className="font-semibold text-white text-sm" dir="ltr">
                            {row.original.name}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: "name_ar",
                header: "الاسم بالعربية",
                cell: ({row}) => (
                    <div className="py-1">
                        {row.original.name_ar ? (
                            <span className="font-medium text-slate-200 text-sm">
                                {row.original.name_ar}
                            </span>
                        ) : (
                            <span className="text-xs text-slate-500 italic">—</span>
                        )}
                    </div>
                ),
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
                    const category = row.original;
                    return (
                        <DataTableActions
                            onEdit={() => onEdit(category)}
                            onDelete={() => onDelete(category.id)}
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
            isFetching={isFetching}
            pagination={pagination}
            onPageChange={onPageChange}
            emptyTitle="لا توجد تصنيفات"
            emptyDescription="لم يتم العثور على أي تصنيفات تطابق معايير البحث الحالية."
        />
    );
}

export const CategoriesTable = React.memo(CategoriesTableComponent);
export default CategoriesTable;

