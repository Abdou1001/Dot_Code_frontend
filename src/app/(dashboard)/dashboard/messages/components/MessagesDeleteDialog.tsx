"use client";

import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";

interface MessagesDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading: boolean;
    onConfirm: () => void;
}

export function MessagesDeleteDialog({
    open,
    onOpenChange,
    isLoading,
    onConfirm,
}: MessagesDeleteDialogProps) {
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="حذف الرسالة"
            description="هل أنت متأكد من رغبتك في حذف هذه الرسالة نهائياً؟"
            isLoading={isLoading}
            onConfirm={onConfirm}
        />
    );
}
