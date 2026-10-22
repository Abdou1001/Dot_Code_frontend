"use client";

import {Plus, Search} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

type DataTableToolbarProps = {
    searchPlaceholder?: string;
    buttonText?: string;
    searchValue?: string;
    onSearch: (value: string) => void;
    onAdd?: () => void;
    children?: React.ReactNode;
};

export default function DataTableToolbar({
    searchPlaceholder = "بحث...",
    buttonText = "إضافة جديد",
    searchValue,
    onSearch,
    onAdd,
    children,
}: DataTableToolbarProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={searchValue}
                        placeholder={searchPlaceholder}
                        className="pr-9 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
                {children}
            </div>

            {onAdd && (
                <Button
                    onClick={onAdd}
                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(0,117,255,0.35)] shrink-0 font-medium">
                    <Plus className="ml-2 h-4 w-4" />
                    {buttonText}
                </Button>
            )}
        </div>
    );
}
