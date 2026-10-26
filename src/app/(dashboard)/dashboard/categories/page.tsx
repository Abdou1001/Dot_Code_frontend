"use client";

import {useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Category} from "@/types/data";
import {useCategories, useDeleteCategory} from "@/hooks/categories/useCategories";
import {CategoriesSkeleton} from "../components/skeletons";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import DataTableStatus from "@/app/(dashboard)/dashboard/components/table/DataTableStatus";
import DataTableActions from "@/app/(dashboard)/dashboard/components/table/DataTableActions";
import {CategoryDialog} from "./CategoryDialog";
import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function CategoriesPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isError, refetch} = useCategories({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_active:
            activeFilter === "all"
                ? undefined
                : (activeFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteCategory();

    if (isLoading && !data) {
        return <CategoriesSkeleton />;
    }

    const categories = data?.results || [];
    const pagination = data?.pagination;

    const columns: ColumnDef<Category>[] = [
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
                        onEdit={() => {
                            setEditingCategory(category);
                            setIsDialogOpen(true);
                        }}
                        onDelete={() => {
                            setDeletingId(category.id);
                            setIsDeleteDialogOpen(true);
                        }}
                    />
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    إدارة التصنيفات
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                    تنظيم وتصنيف مشاريع Dot Code وفق مجالات التخصص البرمجي
                </p>
            </div>

            <DataTableToolbar
                searchPlaceholder="بحث في التصنيفات بالاسم أو الـ slug..."
                buttonText="إضافة تصنيف جديد"
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                onAdd={() => {
                    setEditingCategory(null);
                    setIsDialogOpen(true);
                }}>
                <div className="w-36">
                    <Select
                        value={activeFilter}
                        onValueChange={(val) => {
                            setActiveFilter(val);
                            setPage(1);
                        }}>
                        <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                            <SelectValue placeholder="تصفية بالحالة" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                            <SelectItem value="all">الكل</SelectItem>
                            <SelectItem value="true">نشط</SelectItem>
                            <SelectItem value="false">غير نشط</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </DataTableToolbar>

            {isError && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between text-sm">
                    <span>تعذر جلب التصنيفات من الخادم.</span>
                    <Button size="sm" variant="outline" onClick={() => refetch()}>
                        إعادة المحاولة
                    </Button>
                </div>
            )}

            <DataTable
                columns={columns}
                data={categories}
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

            <CategoryDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                categoryToEdit={editingCategory}
            />

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="حذف التصنيف"
                description="هل أنت متأكد من رغبتك في حذف هذا التصنيف؟"
                isLoading={deleteMutation.isPending}
                onConfirm={() => {
                    if (deletingId) deleteMutation.mutate(deletingId);
                }}
            />
        </div>
    );
}
