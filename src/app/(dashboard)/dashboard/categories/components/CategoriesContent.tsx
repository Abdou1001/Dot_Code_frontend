"use client";

import {useState, useCallback} from "react";
import {Category} from "@/types/data";
import {useCategories, useDeleteCategory} from "@/hooks/categories/useCategories";
import {CategoriesSkeleton} from "../../components/skeletons";
import {CategoriesToolbar} from "./CategoriesToolbar";
import {CategoriesTable} from "./CategoriesTable";
import {CategoriesDialogs} from "./CategoriesDialogs";
import {Button} from "@/components/ui/button";

export function CategoriesContent() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isFetching, isError, refetch} = useCategories({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_active:
            activeFilter === "all"
                ? undefined
                : (activeFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteCategory();

    const handleSearch = useCallback((val: string) => {
        setSearch(val);
        setPage(1);
    }, []);

    const handleActiveFilterChange = useCallback((val: string) => {
        setActiveFilter(val);
        setPage(1);
    }, []);

    const handleAddNew = useCallback(() => {
        setEditingCategory(null);
        setIsDialogOpen(true);
    }, []);

    const handleEdit = useCallback((category: Category) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    }, []);

    const handleDelete = useCallback((id: string) => {
        setDeletingId(id);
        setIsDeleteDialogOpen(true);
    }, []);

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
        return <CategoriesSkeleton />;
    }

    const categories = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <CategoriesToolbar
                activeFilter={activeFilter}
                onSearch={handleSearch}
                onActiveFilterChange={handleActiveFilterChange}
                onAdd={handleAddNew}
            />

            {isError && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between text-sm">
                    <span>تعذر جلب التصنيفات من الخادم.</span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refetch()}
                        className="border-red-500/30 hover:bg-red-500/20 text-red-300">
                        إعادة المحاولة
                    </Button>
                </div>
            )}

            <CategoriesTable
                data={categories}
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
            />

            <CategoriesDialogs
                isDialogOpen={isDialogOpen}
                onDialogOpenChange={setIsDialogOpen}
                editingCategory={editingCategory}
                isDeleteDialogOpen={isDeleteDialogOpen}
                onDeleteOpenChange={setIsDeleteDialogOpen}
                isDeletePending={deleteMutation.isPending}
                onConfirmDelete={handleConfirmDelete}
            />
        </div>
    );
}

export default CategoriesContent;

