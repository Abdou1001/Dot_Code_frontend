"use client";

import {Button} from "@/components/ui/button";
import {DialogFooter} from "@/components/ui/dialog";
import {Loader2} from "lucide-react";

interface CategoryFormActionsProps {
    isEdit: boolean;
    isPending: boolean;
    isSubmitting: boolean;
    onCancel: () => void;
}

export function CategoryFormActions({
    isEdit,
    isPending,
    isSubmitting,
    onCancel,
}: CategoryFormActionsProps) {
    const isLoading = isPending || isSubmitting;

    return (
        <DialogFooter className="gap-2 sm:justify-start pt-3">
            <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-[0_0_15px_rgba(0,117,255,0.4)]">
                {isLoading && <Loader2 className="size-3.5 animate-spin ml-1.5" />}
                {isEdit ? "حفظ التعديلات" : "إنشاء التصنيف"}
            </Button>
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs">
                إلغاء
            </Button>
        </DialogFooter>
    );
}
