"use client";

import React, {ChangeEvent, RefObject} from "react";
import {UploadCloud, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";

interface ProjectImagesUploadCardProps {
    fileInputRef: RefObject<HTMLInputElement | null>;
    pendingFile: File | null;
    pendingPreviewUrl: string | null;
    pendingAlt: string;
    onAltChange: (alt: string) => void;
    pendingIsFeatured: boolean;
    onFeaturedChange: (featured: boolean) => void;
    onFileSelected: (e: ChangeEvent<HTMLInputElement>) => void;
    onAddImage: () => void;
    disabled?: boolean;
}

export function ProjectImagesUploadCard({
    fileInputRef,
    pendingFile,
    pendingPreviewUrl,
    pendingAlt,
    onAltChange,
    pendingIsFeatured,
    onFeaturedChange,
    onFileSelected,
    onAddImage,
    disabled = false,
}: ProjectImagesUploadCardProps) {
    return (
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
            <h4 className="text-xs font-semibold text-white">رفع صورة جديدة</h4>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* File Selection Box */}
                <label className="relative flex flex-col items-center justify-center size-24 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer overflow-hidden shrink-0 transition-all select-none group">
                    {pendingPreviewUrl ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={pendingPreviewUrl}
                                alt="معاينة الملف"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white">
                                <UploadCloud className="size-4 mb-0.5 text-blue-400" />
                                <span>تغيير</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-slate-400 text-[10px]">
                            <UploadCloud className="size-6 text-blue-400 mb-1" />
                            <span>اختر ملف</span>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        disabled={disabled}
                        onChange={onFileSelected}
                    />
                </label>

                {/* Inputs & Action */}
                <div className="flex-1 space-y-2 w-full">
                    <Input
                        value={pendingAlt}
                        onChange={(e) => onAltChange(e.target.value)}
                        placeholder="نص توضيحي للصورة (Alt text)..."
                        disabled={disabled}
                        className="border-white/10 bg-white/5 text-slate-100 text-xs h-9 placeholder:text-slate-500"
                    />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-0.5">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="media-featured-upload"
                                checked={pendingIsFeatured}
                                onCheckedChange={(val) => onFeaturedChange(Boolean(val))}
                                disabled={disabled}
                                className="border-white/20 data-[state=checked]:bg-blue-600"
                            />
                            <Label
                                htmlFor="media-featured-upload"
                                className="text-xs text-slate-300 cursor-pointer select-none">
                                تعيين كصورة رئيسية للمشروع
                            </Label>
                        </div>

                        <Button
                            type="button"
                            size="sm"
                            disabled={!pendingFile || disabled}
                            onClick={onAddImage}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 shrink-0 w-full sm:w-auto h-8 px-3">
                            <Plus className="size-3.5" />
                            <span>رفع الصورة</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProjectImagesUploadCard;

