"use client";

import React from "react";
import {Testimonial} from "@/types/data";
import {TestimonialDialog} from "../TestimonialDialog";
import {TestimonialsDeleteDialog} from "./TestimonialsDeleteDialog";

interface TestimonialsDialogsProps {
    isDialogOpen: boolean;
    onDialogOpenChange: (open: boolean) => void;
    testimonialToEdit: Testimonial | null;
    isDeleteDialogOpen: boolean;
    onDeleteOpenChange: (open: boolean) => void;
    isDeletePending: boolean;
    onConfirmDelete: () => void;
}

export function TestimonialsDialogsComponent({
    isDialogOpen,
    onDialogOpenChange,
    testimonialToEdit,
    isDeleteDialogOpen,
    onDeleteOpenChange,
    isDeletePending,
    onConfirmDelete,
}: TestimonialsDialogsProps) {
    return (
        <>
            <TestimonialDialog
                open={isDialogOpen}
                onOpenChange={onDialogOpenChange}
                testimonialToEdit={testimonialToEdit}
            />

            <TestimonialsDeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                isLoading={isDeletePending}
                onConfirm={onConfirmDelete}
            />
        </>
    );
}

export const TestimonialsDialogs = React.memo(TestimonialsDialogsComponent);
export default TestimonialsDialogs;

