"use client";

import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProjectTableToolbarProps {
    search: string;
    onSearch: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
    onAddNew: () => void;
}

export function ProjectTableToolbar({
    search,
    onSearch,
    statusFilter,
    onStatusFilterChange,
    onAddNew,
}: ProjectTableToolbarProps) {
    return (
        <DataTableToolbar
            searchPlaceholder="بحث في المشاريع بالـ slug..."
            buttonText="إضافة مشروع جديد"
            onSearch={onSearch}
            onAdd={onAddNew}>
            <div className="w-40">
                <Select
                    value={statusFilter}
                    onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                        <SelectValue placeholder="تصفية بالحالة" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                        <SelectItem value="all">كل الحالات</SelectItem>
                        <SelectItem value="published">منشور</SelectItem>
                        <SelectItem value="draft">مسودة</SelectItem>
                        <SelectItem value="hidden">مخفي</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </DataTableToolbar>
    );
}
