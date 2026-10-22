"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Loader2} from "lucide-react";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    title = "تأكيد الحذف",
    description = "هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
    onConfirm,
    isLoading = false,
}: DeleteConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="vision-card border-white/10 text-slate-100 max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-red-400">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-300 text-sm">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row-reverse gap-2 sm:justify-start">
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium">
                        {isLoading && <Loader2 className="size-4 animate-spin ml-2" />}
                        حذف
                    </AlertDialogAction>
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200">
                        إلغاء
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
