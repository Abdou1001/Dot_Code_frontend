"use client";

import React from "react";
import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";

interface CategoriesDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading: boolean;
    onConfirm: () => void;
}

function CategoriesDeleteDialogComponent({
    open,
    onOpenChange,
    isLoading,
    onConfirm,
}: CategoriesDeleteDialogProps) {
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="حذف التصنيف"
            description="هل أنت متأكد من رغبتك في حذف هذا التصنيف؟ لن يتم حذف المشاريع المرتبطة به ولكن ستفقد ربطها بهذا التصنيف."
            onConfirm={onConfirm}
            isLoading={isLoading}
        />
    );
}

export const CategoriesDeleteDialog = React.memo(CategoriesDeleteDialogComponent);
export default CategoriesDeleteDialog;

