"use client";

import {useState} from "react";
import {Technology} from "@/types/data";
import {useTechnologies, useDeleteTechnology} from "@/hooks/technologies/useTechnologies";
import {TechnologiesSkeleton} from "../components/skeletons";
import {TechnologyDialog} from "./TechnologyDialog";
import {TechnologiesHeader} from "./components/TechnologiesHeader";
import {TechnologiesToolbar} from "./components/TechnologiesToolbar";
import {TechnologiesErrorBanner} from "./components/TechnologiesErrorBanner";
import {TechnologiesTable} from "./components/TechnologiesTable";
import {TechnologiesDeleteDialog} from "./components/TechnologiesDeleteDialog";

export default function TechnologiesPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isError, refetch} = useTechnologies({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_active:
            activeFilter === "all"
                ? undefined
                : (activeFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteTechnology();

    if (isLoading && !data) {
        return <TechnologiesSkeleton />;
    }

    const technologies = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <TechnologiesHeader />

            <TechnologiesToolbar
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
                    setEditingTechnology(null);
                    setIsDialogOpen(true);
                }}
            />

            {isError && <TechnologiesErrorBanner onRetry={() => refetch()} />}

            <TechnologiesTable
                data={technologies}
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
                onEdit={(tech) => {
                    setEditingTechnology(tech);
                    setIsDialogOpen(true);
                }}
                onDelete={(id) => {
                    setDeletingId(id);
                    setIsDeleteDialogOpen(true);
                }}
            />

            <TechnologyDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                technologyToEdit={editingTechnology}
            />

            <TechnologiesDeleteDialog
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
