"use client";

import React from "react";
import {Technology} from "@/types/data";
import {TechnologyDialog} from "../TechnologyDialog";
import {TechnologiesDeleteDialog} from "./TechnologiesDeleteDialog";

interface TechnologiesDialogsProps {
    isDialogOpen: boolean;
    onDialogOpenChange: (open: boolean) => void;
    editingTechnology: Technology | null;
    isDeleteDialogOpen: boolean;
    onDeleteOpenChange: (open: boolean) => void;
    isDeletePending: boolean;
    onConfirmDelete: () => void;
}

export function TechnologiesDialogsComponent({
    isDialogOpen,
    onDialogOpenChange,
    editingTechnology,
    isDeleteDialogOpen,
    onDeleteOpenChange,
    isDeletePending,
    onConfirmDelete,
}: TechnologiesDialogsProps) {
    return (
        <>
            <TechnologyDialog
                open={isDialogOpen}
                onOpenChange={onDialogOpenChange}
                technologyToEdit={editingTechnology}
            />

            <TechnologiesDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                isLoading={isDeletePending}
                onConfirm={onConfirmDelete}
            />
        </>
    );
}

export const TechnologiesDialogs = React.memo(TechnologiesDialogsComponent);
export default TechnologiesDialogs;

