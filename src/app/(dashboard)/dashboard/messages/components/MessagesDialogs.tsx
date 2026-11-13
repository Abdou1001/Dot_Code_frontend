"use client";

import React from "react";
import {ContactMessage} from "@/types/data";
import {MessageDetailDialog} from "@/app/(dashboard)/dashboard/components/messages";
import {MessagesDeleteDialog} from "./MessagesDeleteDialog";

interface MessagesDialogsProps {
    selectedMessage: ContactMessage | null;
    isDetailOpen: boolean;
    onDetailOpenChange: (open: boolean) => void;
    isDeleteDialogOpen: boolean;
    onDeleteOpenChange: (open: boolean) => void;
    isDeletePending: boolean;
    onConfirmDelete: () => void;
}

export function MessagesDialogsComponent({
    selectedMessage,
    isDetailOpen,
    onDetailOpenChange,
    isDeleteDialogOpen,
    onDeleteOpenChange,
    isDeletePending,
    onConfirmDelete,
}: MessagesDialogsProps) {
    return (
        <>
            <MessageDetailDialog
                open={isDetailOpen}
                onOpenChange={onDetailOpenChange}
                message={selectedMessage}
            />

            <MessagesDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                isLoading={isDeletePending}
                onConfirm={onConfirmDelete}
            />
        </>
    );
}

export const MessagesDialogs = React.memo(MessagesDialogsComponent);
export default MessagesDialogs;
