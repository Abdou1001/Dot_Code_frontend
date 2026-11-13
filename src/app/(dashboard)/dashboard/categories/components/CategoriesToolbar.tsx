"use client";

import React from "react";
import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CategoriesToolbarProps {
    activeFilter: string;
    onSearch: (value: string) => void;
    onActiveFilterChange: (value: string) => void;
    onAdd: () => void;
}

function CategoriesToolbarComponent({
    activeFilter,
    onSearch,
    onActiveFilterChange,
    onAdd,
}: CategoriesToolbarProps) {
    return (
        <DataTableToolbar
            searchPlaceholder="بحث في التصنيفات بالاسم أو الـ slug..."
            buttonText="إضافة تصنيف جديد"
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
                        <SelectItem value="all">كل الحالات</SelectItem>
                        <SelectItem value="true">نشط فقط</SelectItem>
                        <SelectItem value="false">معطل فقط</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </DataTableToolbar>
    );
}

export const CategoriesToolbar = React.memo(CategoriesToolbarComponent);
export default CategoriesToolbar;

