"use client";

import {useState, useMemo} from "react";
import Link from "next/link";
import {Code2, Plus, X, Search, ExternalLink} from "lucide-react";
import {TechnologyIcon} from "@/components/shared/TechnologyIcon";
import {useActiveTechnologies} from "@/hooks/technologies/useTechnologies";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";

interface ProjectTechnologiesSelectProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    disabled?: boolean;
}

export function ProjectTechnologiesSelect({
    selectedIds,
    onChange,
    disabled = false,
}: ProjectTechnologiesSelectProps) {
    const {data, isLoading, isError} = useActiveTechnologies();
    const [searchQuery, setSearchQuery] = useState("");
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const allTechnologies = useMemo(() => data?.results || [], [data?.results]);

    // Map of selected items for rapid lookup & chip rendering
    const selectedMap = useMemo(() => {
        const map = new Map<string, (typeof allTechnologies)[0]>();
        allTechnologies.forEach((tech) => {
            if (selectedIds.includes(tech.id)) {
                map.set(tech.id, tech);
            }
        });
        return map;
    }, [allTechnologies, selectedIds]);

    // Available (unselected) technologies filtered by search query
    const availableTechnologies = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return allTechnologies
            .filter((tech) => !selectedIds.includes(tech.id))
            .filter((tech) => {
                if (!query) return true;
                return (
                    tech.name.toLowerCase().includes(query) ||
                    tech.slug.toLowerCase().includes(query)
                );
            });
    }, [allTechnologies, selectedIds, searchQuery]);

    const handleAdd = (techId: string) => {
        if (!selectedIds.includes(techId)) {
            onChange([...selectedIds, techId]);
        }
    };

    const handleRemove = (techId: string) => {
        onChange(selectedIds.filter((id) => id !== techId));
    };

    return (
        <div className="vision-card rounded-2xl p-5 border border-white/10 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <Code2 className="size-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>التقنيات المستخدمة</span>
                            {selectedIds.length > 0 && (
                                <Badge className="bg-blue-600/30 text-blue-300 border-blue-500/30 px-1.5 py-0 text-[10px]">
                                    {selectedIds.length}
                                </Badge>
                            )}
                        </h3>
                        <p className="text-[11px] text-slate-400">حدد تقنيات المشروع البرمجية</p>
                    </div>
                </div>

                {!disabled && allTechnologies.length > 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPickerOpen((prev) => !prev)}
                        className={`text-xs h-8 px-2.5 rounded-lg border transition-all gap-1.5 ${
                            isPickerOpen
                                ? "bg-blue-600/20 text-blue-300 border-blue-500/30"
                                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                        }`}>
                        <Plus className={`size-3.5 transition-transform duration-200 ${isPickerOpen ? "rotate-45" : ""}`} />
                        <span>{isPickerOpen ? "إغلاق" : "إضافة تقنية"}</span>
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
                    تعذر تحميل التقنيات. يرجى تحديث الصفحة أو المحاولة لاحقاً.
                </div>
            )}

            {/* Empty State: No technologies created yet in dashboard */}
            {!isLoading && !isError && allTechnologies.length === 0 && (
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center space-y-2.5">
                    <p className="text-xs text-slate-400">لا توجد تقنيات مسجلة في لوحة التحكم بعد.</p>
                    <Link
                        href="/dashboard/technologies"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">
                        <span>إدارة التقنيات وإضافة تقنية جديدة</span>
                        <ExternalLink className="size-3" />
                    </Link>
                </div>
            )}

            {/* Selected Technologies List (Chips) */}
            {!isLoading && allTechnologies.length > 0 && (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl bg-white/5 border border-white/5 items-center">
                        {selectedIds.length === 0 ? (
                            <span className="text-[11px] text-slate-500 px-1">
                                لم يتم اختيار أي تقنيات بعد. انقر على &quot;إضافة تقنية&quot; لاختيار التقنيات.
                            </span>
                        ) : (
                            selectedIds.map((id) => {
                                const tech = selectedMap.get(id);
                                const name = tech?.name || id;

                                return (
                                    <Badge
                                        key={id}
                                        className="bg-blue-600/20 text-blue-300 border-blue-500/30 pl-1.5 pr-2 py-1 flex items-center gap-1.5 text-xs rounded-lg transition-colors group">
                                        <TechnologyIcon
                                            icon={tech?.icon}
                                            name={name}
                                            size={14}
                                            className="shrink-0"
                                        />
                                        <span className="font-medium text-slate-200">{name}</span>
                                        {!disabled && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(id)}
                                                className="rounded p-0.5 hover:bg-blue-500/30 text-blue-400 hover:text-white transition-colors"
                                                title={`إزالة ${name}`}>
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
                <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-950/20 space-y-3 animate-in fade-in-50 duration-150">
                    <div className="relative">
                        <Search className="size-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث بالاسم أو المعرف..."
                            className="pr-8 pl-3 h-8 text-xs border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50"
                        />
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1 pr-0.5">
                        {availableTechnologies.length === 0 ? (
                            <p className="text-[11px] text-slate-500 py-2 text-center">
                                {searchQuery.trim()
                                    ? "لا توجد نتائج مطابقة لبحثك"
                                    : "تم اختيار جميع التقنيات المتاحة"}
                            </p>
                        ) : (
                            availableTechnologies.map((tech) => (
                                <button
                                    key={tech.id}
                                    type="button"
                                    onClick={() => handleAdd(tech.id)}
                                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-blue-600/20 text-slate-300 hover:text-white border border-transparent hover:border-blue-500/30 text-xs transition-colors text-right">
                                    <div className="flex items-center gap-2">
                                        <TechnologyIcon
                                            icon={tech.icon}
                                            name={tech.name}
                                            size={16}
                                            className="shrink-0"
                                        />
                                        <span className="font-medium">{tech.name}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            ({tech.slug})
                                        </span>
                                    </div>
                                    <Plus className="size-3.5 text-slate-400" />
                                </button>
                            ))
                        )}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>المتبقي: {availableTechnologies.length} تقنية</span>
                        <Link
                            href="/dashboard/technologies"
                            target="_blank"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline">
                            <span>إدارة التقنيات</span>
                            <ExternalLink className="size-2.5" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
