"use client";

import React from "react";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Star,
    ExternalLink,
    Save,
    Trash2,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {UnifiedImageItem} from "./types";

interface ProjectImageEditViewProps {
    image: UnifiedImageItem;
    currentIndex: number;
    totalCount: number;
    editAlt: string;
    onEditAltChange: (alt: string) => void;
    editSortOrder: number;
    onEditSortOrderChange: (order: number) => void;
    editIsFeatured: boolean;
    onEditFeaturedChange: (featured: boolean) => void;
    onPrevImage: () => void;
    onNextImage: () => void;
    onSave: () => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

export function ProjectImageEditView({
    image,
    currentIndex,
    totalCount,
    editAlt,
    onEditAltChange,
    editSortOrder,
    onEditSortOrderChange,
    editIsFeatured,
    onEditFeaturedChange,
    onPrevImage,
    onNextImage,
    onSave,
    onDelete,
    onClose,
}: ProjectImageEditViewProps) {
    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header & Navigation */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-slate-300 hover:text-white hover:bg-white/10 text-xs gap-1">
                        <ArrowRight className="size-4" />
                        <span>الرجوع للمعرض</span>
                    </Button>
                    <span className="text-slate-500">|</span>
                    <span className="text-xs text-slate-400 font-medium">
                        معاينة وتعديل الصورة ({currentIndex + 1} من {totalCount})
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={currentIndex <= 0}
                        onClick={onPrevImage}
                        title="الصورة السابقة"
                        className="size-7 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                        <ChevronRight className="size-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={currentIndex < 0 || currentIndex >= totalCount - 1}
                        onClick={onNextImage}
                        title="الصورة التالية"
                        className="size-7 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                        <ChevronLeft className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Large Preview */}
            <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image.previewUrl || image.image_url}
                    alt={image.alt || "صورة المشروع"}
                    className="w-full h-full object-contain"
                />

                {/* Top Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    {editIsFeatured && (
                        <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs flex items-center gap-1 shadow-lg">
                            <Star className="size-3 fill-white" />
                            <span>صورة رئيسية</span>
                        </span>
                    )}
                    <span className="bg-black/60 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded-md text-xs border border-white/10 font-mono">
                        الترتيب: {editSortOrder}
                    </span>
                </div>

                {image.image_url && (
                    <a
                        href={image.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 left-3 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-slate-200 hover:text-white px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 border border-white/15 transition-all opacity-80 hover:opacity-100">
                        <ExternalLink className="size-3.5" />
                        <span>عرض بالحجم الكامل</span>
                    </a>
                )}
            </div>

            {/* Edit Form */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Save className="size-4 text-blue-400" />
                    <span>تعديل بيانات الصورة</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1.5">
                        <Label className="text-xs text-slate-300">النص التوضيحي (Alt text)</Label>
                        <Input
                            value={editAlt}
                            onChange={(e) => onEditAltChange(e.target.value)}
                            placeholder="مثال: لوحة التحكم للمشروع"
                            className="border-white/10 bg-white/5 text-slate-100 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">الترتيب (Sort Order)</Label>
                        <Input
                            type="number"
                            value={editSortOrder}
                            onChange={(e) => onEditSortOrderChange(parseInt(e.target.value) || 0)}
                            className="border-white/10 bg-white/5 text-slate-100 text-xs"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <Checkbox
                        id="edit-featured-img"
                        checked={editIsFeatured}
                        onCheckedChange={(val) => onEditFeaturedChange(Boolean(val))}
                        className="border-white/20 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="edit-featured-img" className="text-xs text-slate-300 cursor-pointer">
                        تعيين كصورة رئيسية للمشروع (Featured)
                    </Label>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(image.id)}
                        className="text-xs gap-1.5">
                        <Trash2 className="size-3.5" />
                        <span>حذف الصورة</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-xs text-slate-400 hover:text-white">
                            إلغاء
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={onSave}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5">
                            <Save className="size-3.5" />
                            <span>حفظ التعديلات</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProjectImageEditView;

