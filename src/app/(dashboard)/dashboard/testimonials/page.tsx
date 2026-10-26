"use client";

import {useState} from "react";
import {Testimonial} from "@/types/data";
import {useTestimonials, useDeleteTestimonial} from "@/hooks/testimonials/useTestimonials";
import {TestimonialsSkeleton} from "../components/skeletons";
import {TestimonialDialog} from "./TestimonialDialog";
import {TestimonialsHeader} from "./components/TestimonialsHeader";
import {TestimonialsToolbar} from "./components/TestimonialsToolbar";
import {TestimonialsErrorBanner} from "./components/TestimonialsErrorBanner";
import {TestimonialsTable} from "./components/TestimonialsTable";
import {TestimonialsDeleteDialog} from "./components/TestimonialsDeleteDialog";

export default function TestimonialsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [publishedFilter, setPublishedFilter] = useState<string>("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isError, refetch} = useTestimonials({
        page,
        limit: 10,
        search: search.trim() || undefined,
        is_published:
            publishedFilter === "all"
                ? undefined
                : (publishedFilter as "true" | "false"),
    });

    const deleteMutation = useDeleteTestimonial();

    if (isLoading && !data) {
        return <TestimonialsSkeleton />;
    }

    const testimonials = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <TestimonialsHeader />

            <TestimonialsToolbar
                publishedFilter={publishedFilter}
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                onPublishedFilterChange={(val) => {
                    setPublishedFilter(val);
                    setPage(1);
                }}
                onAdd={() => {
                    setEditingTestimonial(null);
                    setIsDialogOpen(true);
                }}
            />

            {isError && <TestimonialsErrorBanner onRetry={() => refetch()} />}

            <TestimonialsTable
                data={testimonials}
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
                onEdit={(testimonial) => {
                    setEditingTestimonial(testimonial);
                    setIsDialogOpen(true);
                }}
                onDelete={(id) => {
                    setDeletingId(id);
                    setIsDeleteDialogOpen(true);
                }}
            />

            <TestimonialDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                testimonialToEdit={editingTestimonial}
            />

            <TestimonialsDeleteDialog
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
