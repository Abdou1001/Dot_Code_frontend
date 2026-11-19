"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, FolderCode, Maximize2 } from "lucide-react";
import type { ProjectImage } from "@/types/data";

interface ProjectGalleryProps {
    images: ProjectImage[];
    title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100 dark:bg-neutral-900 grid place-items-center text-muted-foreground">
                <FolderCode className="size-16" strokeWidth={1.2} />
            </div>
        );
    }

    const activeImage = images[activeIndex] || images[0];

    const handlePrev = () => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="space-y-4">
            {/* Main Stage Display */}
            <div className="group relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 bg-neutral-100 dark:bg-[#121316] shadow-xl shadow-black/5 dark:shadow-2xl dark:shadow-black/60">
                <Image
                    key={activeImage.id || activeImage.image_url}
                    src={activeImage.image_url}
                    alt={activeImage.alt || `${title} - Image ${activeIndex + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                />

                {/* Arrows if multiple images */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous image"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center border border-white/15 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next image"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center border border-white/15 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
                        >
                            <ChevronRight className="size-5" />
                        </button>

                        {/* Image Counter Pill */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-black/70 px-3.5 py-1.5 text-xs font-mono text-white/90 backdrop-blur-md border border-white/10 shadow-sm pointer-events-none select-none">
                            <span>{activeIndex + 1}</span>
                            <span className="text-white/40">/</span>
                            <span>{images.length}</span>
                        </div>
                    </>
                )}

                {/* Full-view button */}
                <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    aria-label="View full size image"
                    className="absolute right-4 top-4 z-20 size-9 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center border border-white/15 transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
                >
                    <Maximize2 className="size-4" />
                </button>
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                    {images.map((img, idx) => (
                        <button
                            key={img.id || idx}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            className={`relative aspect-[16/10] h-16 sm:h-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                                idx === activeIndex
                                    ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                                    : "border-transparent opacity-60 hover:opacity-100 hover:border-neutral-400 dark:hover:border-neutral-600"
                            }`}
                        >
                            <Image
                                src={img.image_url}
                                alt={img.alt || `${title} thumbnail ${idx + 1}`}
                                fill
                                sizes="120px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        type="button"
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute right-6 top-6 z-50 text-white/80 hover:text-white text-2xl font-bold bg-white/10 rounded-full size-10 grid place-items-center"
                        aria-label="Close lightbox"
                    >
                        ✕
                    </button>
                    <div className="relative max-h-[90vh] max-w-[90vw] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={activeImage.image_url}
                            alt={activeImage.alt || title}
                            width={1600}
                            height={1000}
                            className="max-h-[85vh] max-w-full object-contain rounded-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
