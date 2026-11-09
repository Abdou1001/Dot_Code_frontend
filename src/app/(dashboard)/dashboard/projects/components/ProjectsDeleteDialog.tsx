"use client";

import React from "react";
import {DeleteConfirmDialog} from "@/components/shared/DeleteConfirmDialog";

interface ProjectsDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading: boolean;
    onConfirm: () => void;
}

function ProjectsDeleteDialogComponent({
    open,
    onOpenChange,
    isLoading,
    onConfirm,
}: ProjectsDeleteDialogProps) {
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="حذف المشروع نهائياً"
            description="هل أنت متأكد من رغبتك في حذف هذا المشروع؟ سيتم حذف جميع الصور والروابط والترجمات التابعة له ولا يمكن التراجع عن هذا الإجراء."
            onConfirm={onConfirm}
            isLoading={isLoading}
        />
    );
}

export const ProjectsDeleteDialog = React.memo(ProjectsDeleteDialogComponent);
export default ProjectsDeleteDialog;

