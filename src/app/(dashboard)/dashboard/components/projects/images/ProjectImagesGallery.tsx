"use client";

import React from "react";
import {UnifiedImageItem} from "./types";
import {ProjectImageCard} from "./ProjectImageCard";

interface ProjectImagesGalleryProps {
    images: UnifiedImageItem[];
    disabled?: boolean;
    onSelectImage: (image: UnifiedImageItem) => void;
    onDeleteImage: (id: string) => void;
}

export function ProjectImagesGallery({
    images,
    disabled = false,
    onSelectImage,
    onDeleteImage,
}: ProjectImagesGalleryProps) {
    return (
        <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300">
                    الصور الحالية ({images.length})
                </h4>
                <span className="text-[11px] text-slate-400">
                    انقر على أي صورة لتكبيرها وتعديلها
                </span>
            </div>

            {images.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                    لا توجد صور مرفوعة لهذا المشروع بعد.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img) => (
                        <ProjectImageCard
                            key={img.id}
                            image={img}
                            disabled={disabled}
                            onSelect={onSelectImage}
                            onDelete={onDeleteImage}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
export default ProjectImagesGallery;

