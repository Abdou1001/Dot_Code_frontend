"use client";

import {useState, useMemo} from "react";
import Link from "next/link";
import {FolderTree, Plus, X, Search, ExternalLink} from "lucide-react";
import {useActiveCategories} from "@/hooks/categories/useCategories";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";

interface ProjectCategoriesSelectProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    disabled?: boolean;
}

export function ProjectCategoriesSelect({
    selectedIds,
    onChange,
    disabled = false,
}: ProjectCategoriesSelectProps) {
    const {data, isLoading, isError} = useActiveCategories();
    const [searchQuery, setSearchQuery] = useState("");
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const allCategories = useMemo(() => data?.results || [], [data?.results]);

    // Map of selected items for rapid lookup
    const selectedMap = useMemo(() => {
        const map = new Map<string, (typeof allCategories)[0]>();
        allCategories.forEach((cat) => {
            if (selectedIds.includes(cat.id)) {
                map.set(cat.id, cat);
            }
        });
        return map;
    }, [allCategories, selectedIds]);

    // Available (unselected) categories filtered by search query
    const availableCategories = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return allCategories
            .filter((cat) => !selectedIds.includes(cat.id))
            .filter((cat) => {
                if (!query) return true;
                const nameEn = cat.name.toLowerCase();
                const nameAr = (cat.name_ar || "").toLowerCase();
                const slug = cat.slug.toLowerCase();
                return nameEn.includes(query) || nameAr.includes(query) || slug.includes(query);
            });
    }, [allCategories, selectedIds, searchQuery]);

    const handleAdd = (catId: string) => {
        if (!selectedIds.includes(catId)) {
            onChange([...selectedIds, catId]);
        }
    };

    const handleRemove = (catId: string) => {
        onChange(selectedIds.filter((id) => id !== catId));
    };

    return (
        <div className="vision-card rounded-2xl p-5 border border-white/10 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <FolderTree className="size-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>تصنيفات المشروع</span>
                            {selectedIds.length > 0 && (
                                <Badge className="bg-purple-600/30 text-purple-300 border-purple-500/30 px-1.5 py-0 text-[10px]">
                                    {selectedIds.length}
                                </Badge>
                            )}
                        </h3>
                        <p className="text-[11px] text-slate-400">حدد تصنيفاً أو أكثر لتصنيف المشروع</p>
                    </div>
                </div>

                {!disabled && allCategories.length > 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPickerOpen((prev) => !prev)}
                        className={`text-xs h-8 px-2.5 rounded-lg border transition-all gap-1.5 ${
                            isPickerOpen
                                ? "bg-purple-600/20 text-purple-300 border-purple-500/30"
                                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                        }`}>
                        <Plus className={`size-3.5 transition-transform duration-200 ${isPickerOpen ? "rotate-45" : ""}`} />
                        <span>{isPickerOpen ? "إغلاق" : "إضافة تصنيف"}</span>
                    </Button>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-2 py-2">
                    <Skeleton className="h-8 w-full rounded-xl bg-white/5" />
                    <Skeleton className="h-16 w-full rounded-xl bg-white/5" />
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-200 text-xs">
                    تعذر تحميل التصنيفات. يرجى تحديث الصفحة أو المحاولة لاحقاً.
                </div>
            )}

            {/* Empty State: No categories registered in dashboard */}
            {!isLoading && !isError && allCategories.length === 0 && (
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center space-y-2.5">
                    <p className="text-xs text-slate-400">لا توجد أقسام أو تصنيفات مسجلة في لوحة التحكم بعد.</p>
                    <Link
                        href="/dashboard/categories"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors">
                        <span>إدارة التصنيفات وإضافة تصنيف جديد</span>
                        <ExternalLink className="size-3" />
                    </Link>
                </div>
            )}

            {/* Selected Categories List (Chips) */}
            {!isLoading && allCategories.length > 0 && (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl bg-white/5 border border-white/5 items-center">
                        {selectedIds.length === 0 ? (
                            <span className="text-[11px] text-slate-500 px-1">
                                لم يتم اختيار أي تصنيفات بعد. انقر على &quot;إضافة تصنيف&quot; لاختيار التصنيفات.
                            </span>
                        ) : (
                            selectedIds.map((id) => {
                                const cat = selectedMap.get(id);
                                const displayName = cat?.name_ar || cat?.name || id;

                                return (
                                    <Badge
                                        key={id}
                                        className="bg-purple-600/20 text-purple-300 border-purple-500/30 pl-1.5 pr-2 py-1 flex items-center gap-1.5 text-xs rounded-lg transition-colors group">
                                        <FolderTree className="size-3 text-purple-400" />
                                        <span className="font-medium text-slate-200">{displayName}</span>
                                        {!disabled && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(id)}
                                                className="rounded p-0.5 hover:bg-purple-500/30 text-purple-400 hover:text-white transition-colors"
                                                title={`إزالة ${displayName}`}>
                                                <X className="size-3" />
                                            </button>
                                        )}
                                    </Badge>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Searchable Picker Panel (Collapsible) */}
            {isPickerOpen && !disabled && (
                <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-950/20 space-y-3 animate-in fade-in-50 duration-150">
                    <div className="relative">
                        <Search className="size-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث بالاسم العربي أو الإنجليزي..."
                            className="pr-8 pl-3 h-8 text-xs border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-purple-500/50"
                        />
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1 pr-0.5">
                        {availableCategories.length === 0 ? (
                            <p className="text-[11px] text-slate-500 py-2 text-center">
                                {searchQuery.trim()
                                    ? "لا توجد نتائج مطابقة لبحثك"
                                    : "تم اختيار جميع التصنيفات المتاحة"}
                            </p>
                        ) : (
                            availableCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleAdd(cat.id)}
                                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-white border border-transparent hover:border-purple-500/30 text-xs transition-colors text-right">
                                    <div className="flex items-center gap-2">
                                        <FolderTree className="size-3.5 text-purple-400" />
                                        <span className="font-medium">{cat.name_ar || cat.name}</span>
                                        {cat.name_ar && cat.name && (
                                            <span className="text-[10px] text-slate-500">
                                                ({cat.name})
                                            </span>
                                        )}
                                    </div>
                                    <Plus className="size-3.5 text-slate-400" />
                                </button>
                            ))
                        )}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>المتبقي: {availableCategories.length} تصنيف</span>
                        <Link
                            href="/dashboard/categories"
                            target="_blank"
                            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 hover:underline">
                            <span>إدارة التصنيفات</span>
                            <ExternalLink className="size-2.5" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

