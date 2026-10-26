"use client";

import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TestimonialsToolbarProps {
    publishedFilter: string;
    onSearch: (value: string) => void;
    onPublishedFilterChange: (value: string) => void;
    onAdd: () => void;
}

export function TestimonialsToolbar({
    publishedFilter,
    onSearch,
    onPublishedFilterChange,
    onAdd,
}: TestimonialsToolbarProps) {
    return (
        <DataTableToolbar
            searchPlaceholder="بحث في التقييمات باسم العميل أو الشركة..."
            buttonText="إضافة رأي عميل"
            onSearch={onSearch}
            onAdd={onAdd}>
            <div className="w-36">
                <Select
                    value={publishedFilter}
                    onValueChange={onPublishedFilterChange}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                        <SelectValue placeholder="تصفية بالنشر" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="true">منشور</SelectItem>
                        <SelectItem value="false">غير منشور</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </DataTableToolbar>
    );
}
