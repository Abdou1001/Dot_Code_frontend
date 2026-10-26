"use client";

import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";

interface TestimonialsDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading: boolean;
    onConfirm: () => void;
}

export function TestimonialsDeleteDialog({
    open,
    onOpenChange,
    isLoading,
    onConfirm,
}: TestimonialsDeleteDialogProps) {
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="حذف رأي العميل"
            description="هل أنت متأكد من رغبتك في حذف هذا التقييم نهائياً؟"
            isLoading={isLoading}
            onConfirm={onConfirm}
        />
    );
}
