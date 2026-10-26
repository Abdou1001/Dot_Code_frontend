"use client";

import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";

interface ServicesDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading: boolean;
    onConfirm: () => void;
}

export function ServicesDeleteDialog({
    open,
    onOpenChange,
    isLoading,
    onConfirm,
}: ServicesDeleteDialogProps) {
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="حذف الخدمة"
            description="هل أنت متأكد من رغبتك في حذف هذه الخدمة وجميع ترجماتها؟"
            isLoading={isLoading}
            onConfirm={onConfirm}
        />
    );
}
