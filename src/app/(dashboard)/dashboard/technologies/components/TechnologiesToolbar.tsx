"use client";

import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TechnologiesToolbarProps {
    activeFilter: string;
    onSearch: (value: string) => void;
    onActiveFilterChange: (value: string) => void;
    onAdd: () => void;
}

export function TechnologiesToolbar({
    activeFilter,
    onSearch,
    onActiveFilterChange,
    onAdd,
}: TechnologiesToolbarProps) {
    return (
        <DataTableToolbar
            searchPlaceholder="بحث في التقنيات بالاسم أو الـ slug..."
            buttonText="إضافة تقنية جديدة"
            onSearch={onSearch}
            onAdd={onAdd}>
            <div className="w-36">
                <Select
                    value={activeFilter}
                    onValueChange={onActiveFilterChange}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                        <SelectValue placeholder="تصفية بالحالة" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="true">نشط</SelectItem>
                        <SelectItem value="false">غير نشط</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </DataTableToolbar>
    );
}
