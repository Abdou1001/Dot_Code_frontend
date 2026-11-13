"use client";

import React from "react";
import {Service} from "@/types/data";
import {ServiceDialog} from "../ServiceDialog";
import {ServicesDeleteDialog} from "./ServicesDeleteDialog";

interface ServicesDialogsProps {
    isDialogOpen: boolean;
    onDialogOpenChange: (open: boolean) => void;
    serviceToEdit: Service | null;
    isDeleteDialogOpen: boolean;
    onDeleteOpenChange: (open: boolean) => void;
    isDeletePending: boolean;
    onConfirmDelete: () => void;
}

export function ServicesDialogsComponent({
    isDialogOpen,
    onDialogOpenChange,
    serviceToEdit,
    isDeleteDialogOpen,
    onDeleteOpenChange,
    isDeletePending,
    onConfirmDelete,
}: ServicesDialogsProps) {
    return (
        <>
            <ServiceDialog
                open={isDialogOpen}
                onOpenChange={onDialogOpenChange}
                serviceToEdit={serviceToEdit}
            />

            <ServicesDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                isLoading={isDeletePending}
                onConfirm={onConfirmDelete}
            />
        </>
    );
}

export const ServicesDialogs = React.memo(ServicesDialogsComponent);
export default ServicesDialogs;

