"use client";

import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MessagesToolbarProps {
    statusFilter: string;
    onSearch: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
}

export function MessagesToolbar({
    statusFilter,
    onSearch,
    onStatusFilterChange,
}: MessagesToolbarProps) {
    return (
        <DataTableToolbar
            searchPlaceholder="بحث بالاسم أو البريد أو الموضوع..."
            onSearch={onSearch}>
            <div className="w-36">
                <Select
                    value={statusFilter}
                    onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                        <SelectValue placeholder="تصفية بالحالة" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                        <SelectItem value="all">كل الحالات</SelectItem>
                        <SelectItem value="new">جديدة</SelectItem>
                        <SelectItem value="read">مقروءة</SelectItem>
                        <SelectItem value="replied">تم الرد</SelectItem>
                        <SelectItem value="archived">مؤرشفة</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </DataTableToolbar>
    );
}
