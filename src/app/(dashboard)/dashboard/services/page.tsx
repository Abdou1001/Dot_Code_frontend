"use client";

import {useState} from "react";
import {Service} from "@/types/data";
import {useServices, useDeleteService} from "@/hooks/services/useServices";
import {ServicesSkeleton} from "../components/skeletons";
import {ServiceDialog} from "./ServiceDialog";
import {ServicesHeader} from "./components/ServicesHeader";
import {ServicesToolbar} from "./components/ServicesToolbar";
import {ServicesErrorBanner} from "./components/ServicesErrorBanner";
import {ServicesTable} from "./components/ServicesTable";
import {ServicesDeleteDialog} from "./components/ServicesDeleteDialog";

export default function ServicesPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isError, refetch} = useServices({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_active:
            activeFilter === "all"
                ? undefined
                : (activeFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteService();

    if (isLoading && !data) {
        return <ServicesSkeleton />;
    }

    const services = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <ServicesHeader />

            <ServicesToolbar
                activeFilter={activeFilter}
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                onActiveFilterChange={(val) => {
                    setActiveFilter(val);
                    setPage(1);
                }}
                onAdd={() => {
                    setEditingService(null);
                    setIsDialogOpen(true);
                }}
            />

            {isError && <ServicesErrorBanner onRetry={() => refetch()} />}

            <ServicesTable
                data={services}
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
                onEdit={(service) => {
                    setEditingService(service);
                    setIsDialogOpen(true);
                }}
                onDelete={(id) => {
                    setDeletingId(id);
                    setIsDeleteDialogOpen(true);
                }}
            />

            <ServiceDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                serviceToEdit={editingService}
            />

            <ServicesDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                isLoading={deleteMutation.isPending}
                onConfirm={() => {
                    if (deletingId) {
                        deleteMutation.mutate(deletingId, {
                            onSuccess: () => {
                                setIsDeleteDialogOpen(false);
                                setDeletingId(null);
                            },
                        });
                    }
                }}
            />
        </div>
    );
}
