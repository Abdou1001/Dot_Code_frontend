"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Category} from "@/types/data";
import {CategoryForm} from "./components/CategoryForm";

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryToEdit?: Category | null;
}

export function CategoryDialog({open, onOpenChange, categoryToEdit}: CategoryDialogProps) {
    const isEdit = Boolean(categoryToEdit);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="vision-card border-white/10 text-slate-100 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {isEdit ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs">
                        تحديد اسم التصنيف المعروض ومساره البرمجي وحالته
                    </DialogDescription>
                </DialogHeader>

                {open && (
                    <CategoryForm
                        categoryToEdit={categoryToEdit}
                        onSuccess={() => onOpenChange(false)}
                        onCancel={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
