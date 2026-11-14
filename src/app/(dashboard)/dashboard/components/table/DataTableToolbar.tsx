"use client";

import React, {useState, useEffect, useRef} from "react";
import {Plus, Search, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useDebouncedValue} from "@/hooks/shared/useDebouncedValue";

type DataTableToolbarProps = {
    searchPlaceholder?: string;
    buttonText?: string;
    searchValue?: string;
    onSearch: (value: string) => void;
    onAdd?: () => void;
    children?: React.ReactNode;
};

function DataTableToolbarComponent({
    searchPlaceholder = "بحث...",
    buttonText = "إضافة جديد",
    searchValue,
    onSearch,
    onAdd,
    children,
}: DataTableToolbarProps) {
    const [localValue, setLocalValue] = useState(searchValue || "");
    const debouncedValue = useDebouncedValue(localValue, 400);

    // Sync external searchValue changes (e.g., when parent resets filters)
    const prevExternalSearch = useRef(searchValue);
    useEffect(() => {
        if (searchValue !== undefined && searchValue !== prevExternalSearch.current) {
            prevExternalSearch.current = searchValue;
            setLocalValue(searchValue);
        }
    }, [searchValue]);

    // Emit onSearch only when debouncedValue genuinely changes
    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    const handleClear = () => {
        setLocalValue("");
        onSearch("");
    };

    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                        value={localValue}
                        placeholder={searchPlaceholder}
                        className="pr-9 pl-8 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        onChange={(e) => setLocalValue(e.target.value)}
                    />
                    {localValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="مسح البحث"
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
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

export const DataTableToolbar = React.memo(DataTableToolbarComponent);
export default DataTableToolbar;
