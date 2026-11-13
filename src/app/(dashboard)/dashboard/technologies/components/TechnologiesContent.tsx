"use client";

import {useState, useCallback} from "react";
import {Technology} from "@/types/data";
import {useTechnologies, useDeleteTechnology} from "@/hooks/technologies/useTechnologies";
import {TechnologiesSkeleton} from "../../components/skeletons";
import {TechnologiesToolbar} from "./TechnologiesToolbar";
import {TechnologiesErrorBanner} from "./TechnologiesErrorBanner";
import {TechnologiesTable} from "./TechnologiesTable";
import {TechnologiesDialogs} from "./TechnologiesDialogs";

export function TechnologiesContent() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isFetching, isError, refetch} = useTechnologies({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_active:
            activeFilter === "all"
                ? undefined
                : (activeFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteTechnology();

    const handleSearch = useCallback((val: string) => {
        setSearch(val);
        setPage(1);
    }, []);

    const handleActiveFilterChange = useCallback((val: string) => {
        setActiveFilter(val);
        setPage(1);
    }, []);

    const handleAdd = useCallback(() => {
        setEditingTechnology(null);
        setIsDialogOpen(true);
    }, []);

    const handleEdit = useCallback((tech: Technology) => {
        setEditingTechnology(tech);
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
        return <TechnologiesSkeleton />;
    }

    const technologies = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <TechnologiesToolbar
                activeFilter={activeFilter}
                onSearch={handleSearch}
                onActiveFilterChange={handleActiveFilterChange}
                onAdd={handleAdd}
            />

            {isError && <TechnologiesErrorBanner onRetry={() => refetch()} />}

            <TechnologiesTable
                data={technologies}
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

            <TechnologiesDialogs
                isDialogOpen={isDialogOpen}
                onDialogOpenChange={setIsDialogOpen}
                editingTechnology={editingTechnology}
                isDeleteDialogOpen={isDeleteDialogOpen}
                onDeleteOpenChange={setIsDeleteDialogOpen}
                isDeletePending={deleteMutation.isPending}
                onConfirmDelete={handleConfirmDelete}
            />
        </div>
    );
}

export default TechnologiesContent;

