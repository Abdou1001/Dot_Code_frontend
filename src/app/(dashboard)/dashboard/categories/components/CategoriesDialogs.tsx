"use client";

import React from "react";
import {Category} from "@/types/data";
import {CategoryDialog} from "../CategoryDialog";
import {CategoriesDeleteDialog} from "./CategoriesDeleteDialog";

interface CategoriesDialogsProps {
    isDialogOpen: boolean;
    onDialogOpenChange: (open: boolean) => void;
    editingCategory: Category | null;
    isDeleteDialogOpen: boolean;
    onDeleteOpenChange: (open: boolean) => void;
    isDeletePending: boolean;
    onConfirmDelete: () => void;
}

export function CategoriesDialogsComponent({
    isDialogOpen,
    onDialogOpenChange,
    editingCategory,
    isDeleteDialogOpen,
    onDeleteOpenChange,
    isDeletePending,
    onConfirmDelete,
}: CategoriesDialogsProps) {
    return (
        <>
            <CategoryDialog
                open={isDialogOpen}
                onOpenChange={onDialogOpenChange}
                categoryToEdit={editingCategory}
            />

            <CategoriesDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                isLoading={isDeletePending}
                onConfirm={onConfirmDelete}
            />
        </>
    );
}

export const CategoriesDialogs = React.memo(CategoriesDialogsComponent);
export default CategoriesDialogs;

