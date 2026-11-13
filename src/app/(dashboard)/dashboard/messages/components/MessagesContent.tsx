"use client";

import {useState, useCallback} from "react";
import {ContactMessage} from "@/types/data";
import {useMessages, useDeleteMessage} from "@/hooks/messages/useMessages";
import {MessagesSkeleton} from "../../components/skeletons";
import {MessagesToolbar} from "./MessagesToolbar";
import {MessagesErrorBanner} from "./MessagesErrorBanner";
import {MessagesTable} from "./MessagesTable";
import {MessagesDialogs} from "./MessagesDialogs";

export function MessagesContent() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Dialog state
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Data fetching
    const {data, isLoading, isFetching, isError, refetch} = useMessages({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter === "all" ? undefined : (statusFilter as any),
    });

    const deleteMutation = useDeleteMessage();

    // Callbacks
    const handleSearch = useCallback((val: string) => {
        setSearch(val);
        setPage(1);
    }, []);

    const handleStatusFilterChange = useCallback((val: string) => {
        setStatusFilter(val);
        setPage(1);
    }, []);

    const handleView = useCallback((msg: ContactMessage) => {
        setSelectedMessage(msg);
        setIsDetailOpen(true);
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
        return <MessagesSkeleton />;
    }

    const messages = data?.results || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <MessagesToolbar
                statusFilter={statusFilter}
                onSearch={handleSearch}
                onStatusFilterChange={handleStatusFilterChange}
            />

            {isError && <MessagesErrorBanner onRetry={() => refetch()} />}

            <MessagesTable
                data={messages}
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
                onView={handleView}
                onDelete={handleDelete}
            />

            <MessagesDialogs
                selectedMessage={selectedMessage}
                isDetailOpen={isDetailOpen}
                onDetailOpenChange={setIsDetailOpen}
                isDeleteDialogOpen={isDeleteDialogOpen}
                onDeleteOpenChange={setIsDeleteDialogOpen}
                isDeletePending={deleteMutation.isPending}
                onConfirmDelete={handleConfirmDelete}
            />
        </div>
    );
}

export default MessagesContent;

