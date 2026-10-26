"use client";

import {useState} from "react";
import {ContactMessage} from "@/types/data";
import {useMessages, useDeleteMessage} from "@/hooks/messages/useMessages";
import {MessagesSkeleton} from "../components/skeletons";
import {MessageDetailDialog} from "../components/messages";
import {MessagesHeader} from "./components/MessagesHeader";
import {MessagesToolbar} from "./components/MessagesToolbar";
import {MessagesErrorBanner} from "./components/MessagesErrorBanner";
import {MessagesTable} from "./components/MessagesTable";
import {MessagesDeleteDialog} from "./components/MessagesDeleteDialog";

export default function MessagesPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {data, isLoading, isError, refetch} = useMessages({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter === "all" ? undefined : (statusFilter as any),
    });

    const deleteMutation = useDeleteMessage();

    if (isLoading && !data) {
        return <MessagesSkeleton />;
    }

    const messages = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <MessagesHeader />

            <MessagesToolbar
                statusFilter={statusFilter}
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                onStatusFilterChange={(val) => {
                    setStatusFilter(val);
                    setPage(1);
                }}
            />

            {isError && <MessagesErrorBanner onRetry={() => refetch()} />}

            <MessagesTable
                data={messages}
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
                onView={(msg) => {
                    setSelectedMessage(msg);
                    setIsDetailOpen(true);
                }}
                onDelete={(id) => {
                    setDeletingId(id);
                    setIsDeleteDialogOpen(true);
                }}
            />

            <MessageDetailDialog
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                message={selectedMessage}
            />

            <MessagesDeleteDialog
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
