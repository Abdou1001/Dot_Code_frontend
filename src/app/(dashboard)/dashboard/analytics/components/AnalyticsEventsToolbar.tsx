"use client";

import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AnalyticsEventsToolbarProps {
    deviceFilter: string;
    onSearch: (value: string) => void;
    onDeviceFilterChange: (value: string) => void;
}

export function AnalyticsEventsToolbar({
    deviceFilter,
    onSearch,
    onDeviceFilterChange,
}: AnalyticsEventsToolbarProps) {
    return (
        <DataTableToolbar
            searchPlaceholder="بحث في المسارات المزارة (Path)..."
            onSearch={onSearch}>
            <div className="w-36">
                <Select
                    value={deviceFilter}
                    onValueChange={onDeviceFilterChange}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                        <SelectValue placeholder="نوع الجهاز" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                        <SelectItem value="all">كل الأجهزة</SelectItem>
                        <SelectItem value="desktop">حاسوب (Desktop)</SelectItem>
                        <SelectItem value="mobile">هاتف (Mobile)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </DataTableToolbar>
    );
}
