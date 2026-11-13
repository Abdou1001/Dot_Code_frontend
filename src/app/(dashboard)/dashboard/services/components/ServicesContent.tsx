"use client";

import {useState, useCallback} from "react";
import {Service} from "@/types/data";
import {useServices, useDeleteService} from "@/hooks/services/useServices";
import {ServicesSkeleton} from "../../components/skeletons";
import {ServicesToolbar} from "./ServicesToolbar";
import {ServicesErrorBanner} from "./ServicesErrorBanner";
import {ServicesTable} from "./ServicesTable";
import {ServicesDialogs} from "./ServicesDialogs";

export function ServicesContent() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isFetching, isError, refetch} = useServices({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_active:
            activeFilter === "all"
                ? undefined
                : (activeFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteService();

    const handleSearch = useCallback((val: string) => {
        setSearch(val);
        setPage(1);
    }, []);

    const handleActiveFilterChange = useCallback((val: string) => {
        setActiveFilter(val);
        setPage(1);
    }, []);

    const handleAdd = useCallback(() => {
        setEditingService(null);
        setIsDialogOpen(true);
    }, []);

    const handleEdit = useCallback((service: Service) => {
        setEditingService(service);
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
        return <ServicesSkeleton />;
    }

    const services = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <ServicesToolbar
                activeFilter={activeFilter}
                onSearch={handleSearch}
                onActiveFilterChange={handleActiveFilterChange}
                onAdd={handleAdd}
            />

            {isError && <ServicesErrorBanner onRetry={() => refetch()} />}

            <ServicesTable
                data={services}
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

            <ServicesDialogs
                isDialogOpen={isDialogOpen}
                onDialogOpenChange={setIsDialogOpen}
                serviceToEdit={editingService}
                isDeleteDialogOpen={isDeleteDialogOpen}
                onDeleteOpenChange={setIsDeleteDialogOpen}
                isDeletePending={deleteMutation.isPending}
                onConfirmDelete={handleConfirmDelete}
            />
        </div>
    );
}

export default ServicesContent;
