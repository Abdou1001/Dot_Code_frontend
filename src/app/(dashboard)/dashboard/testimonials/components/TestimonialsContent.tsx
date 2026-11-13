"use client";

import {useState, useCallback} from "react";
import {Testimonial} from "@/types/data";
import {useTestimonials, useDeleteTestimonial} from "@/hooks/testimonials/useTestimonials";
import {TestimonialsSkeleton} from "../../components/skeletons";
import {TestimonialsToolbar} from "./TestimonialsToolbar";
import {TestimonialsErrorBanner} from "./TestimonialsErrorBanner";
import {TestimonialsTable} from "./TestimonialsTable";
import {TestimonialsDialogs} from "./TestimonialsDialogs";

export function TestimonialsContent() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [publishedFilter, setPublishedFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isFetching, isError, refetch} = useTestimonials({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_published:
            publishedFilter === "all"
                ? undefined
                : (publishedFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteTestimonial();

    const handleSearch = useCallback((val: string) => {
        setSearch(val);
        setPage(1);
    }, []);

    const handlePublishedFilterChange = useCallback((val: string) => {
        setPublishedFilter(val);
        setPage(1);
    }, []);

    const handleAdd = useCallback(() => {
        setEditingTestimonial(null);
        setIsDialogOpen(true);
    }, []);

    const handleEdit = useCallback((testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
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
        return <TestimonialsSkeleton />;
    }

    const testimonials = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <TestimonialsToolbar
                publishedFilter={publishedFilter}
                onSearch={handleSearch}
                onPublishedFilterChange={handlePublishedFilterChange}
                onAdd={handleAdd}
            />

            {isError && <TestimonialsErrorBanner onRetry={() => refetch()} />}

            <TestimonialsTable
                data={testimonials}
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

            <TestimonialsDialogs
                isDialogOpen={isDialogOpen}
                onDialogOpenChange={setIsDialogOpen}
                testimonialToEdit={editingTestimonial}
                isDeleteDialogOpen={isDeleteDialogOpen}
                onDeleteOpenChange={setIsDeleteDialogOpen}
                isDeletePending={deleteMutation.isPending}
                onConfirmDelete={handleConfirmDelete}
            />
        </div>
    );
}

export default TestimonialsContent;

