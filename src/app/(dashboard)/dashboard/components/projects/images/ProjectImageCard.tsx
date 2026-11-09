"use client";

import React from "react";
import {Star, Maximize2, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {UnifiedImageItem} from "./types";

interface ProjectImageCardProps {
    image: UnifiedImageItem;
    disabled?: boolean;
    onSelect: (image: UnifiedImageItem) => void;
    onDelete: (id: string) => void;
}

export function ProjectImageCard({
    image,
    disabled = false,
    onSelect,
    onDelete,
}: ProjectImageCardProps) {
    return (
        <div
            onClick={() => onSelect(image)}
            className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video flex items-center justify-center cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all select-none">
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={image.previewUrl || image.image_url}
                alt={image.alt || "صورة المشروع"}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />

            {/* Featured Badge */}
            {image.is_featured && (
                <div className="absolute top-1.5 right-1.5 bg-blue-600/90 text-white px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 shadow-md z-10">
                    <Star className="size-2.5 fill-white" />
                    <span>رئيسية</span>
                </div>
            )}

            {/* Sort Order Badge */}
            <div className="absolute top-1.5 left-1.5 bg-black/60 text-slate-300 px-1.5 py-0.5 rounded text-[10px] border border-white/10 z-10 font-mono">
                #{image.sort_order ?? 0}
            </div>

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="size-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white p-0"
                    title="تكبير وتعديل الصورة">
                    <Maximize2 className="size-4" />
                </Button>

                <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="size-8 rounded-lg p-0"
                    disabled={disabled}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(image.id);
                    }}
                    title="حذف الصورة">
                    <Trash2 className="size-3.5" />
                </Button>
            </div>
        </div>
    );
}
export default ProjectImageCard;

