import React from "react";
import {Inbox} from "lucide-react";
import {Button} from "@/components/ui/button";

interface DataTableEmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ElementType;
}

export function DataTableEmptyState({
    title = "لا توجد نتائج",
    description = "لم يتم العثور على أي عناصر تطابق معايير البحث أو التصفية الحالية.",
    actionLabel,
    onAction,
    icon: Icon = Inbox,
}: DataTableEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[220px]">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 mb-3 shadow-[0_0_15px_rgba(0,117,255,0.1)]">
                <Icon className="size-7" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onAction}
                    className="border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

export default React.memo(DataTableEmptyState);

