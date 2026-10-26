"use client";

import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";

interface TechnologiesDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading: boolean;
    onConfirm: () => void;
}

export function TechnologiesDeleteDialog({
    open,
    onOpenChange,
    isLoading,
    onConfirm,
}: TechnologiesDeleteDialogProps) {
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="حذف التقنية"
            description="هل أنت متأكد من رغبتك في حذف هذه التقنية؟"
            isLoading={isLoading}
            onConfirm={onConfirm}
        />
    );
}
