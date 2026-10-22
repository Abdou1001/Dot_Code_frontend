"use client";

import {Button} from "@/components/ui/button";
import {Edit, Eye, Trash2} from "lucide-react";

interface DataTableActionsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
    children?: React.ReactNode;
}

export function DataTableActions({onEdit, onDelete, onView, children}: DataTableActionsProps) {
    return (
        <div className="flex items-center gap-1.5 justify-end">
            {children}
            {onView && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={onView}
                    title="عرض التفاصيل">
                    <Eye className="size-4" />
                </Button>
            )}
            {onEdit && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                    onClick={onEdit}
                    title="تعديل">
                    <Edit className="size-4" />
                </Button>
            )}
            {onDelete && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={onDelete}
                    title="حذف">
                    <Trash2 className="size-4" />
                </Button>
            )}
        </div>
    );
}

export default DataTableActions;
