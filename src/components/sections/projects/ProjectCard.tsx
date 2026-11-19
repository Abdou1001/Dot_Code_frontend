"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Code2, ExternalLink, FolderCode, ChevronLeft, ChevronRight } from "lucide-react";
import { TechnologyIcon } from "@/components/shared/TechnologyIcon";
import type { PortfolioProject } from "./projects.utils";

interface ProjectCardProps {
    project: PortfolioProject;
    githubLabel: string;
    liveLabel: string;
    imageFallbackLabel: string;
}

export function ProjectCard({ project, githubLabel, liveLabel, imageFallbackLabel }: ProjectCardProps) {
    const images = project.images && project.images.length > 0
        ? project.images
        : (project.image ? [project.image] : []);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const activeImage = images[currentImageIndex];

    const handlePrevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    const description = project.cleanDescription || project.description;

    return (
        <article className="project-card group relative snap-center" data-project-card>
            {/* 1. Media Area with Multi-Image Carousel */}
            <div className="project-card-media relative">
                {activeImage ? (
                    <Image
                        key={activeImage.id || activeImage.image_url}
                        src={activeImage.image_url}
                        alt={activeImage.alt || project.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 767px) 84vw, (max-width: 1279px) 58vw, 34rem"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div aria-label={imageFallbackLabel} className="grid h-full place-items-center bg-accent text-muted-foreground">
                        <FolderCode aria-hidden="true" className="size-12" strokeWidth={1.4} />
                    </div>
                )}

                {/* External Action Links (GitHub / Live Demo) */}
                {(project.github_url || project.live_url) ? (
                    <div className="project-card-links relative z-20">
                        {project.github_url ? (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="project-link"
                                data-cursor-link
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Code2 aria-hidden="true" className="size-4" />
                                <span>{githubLabel}</span>
                            </a>
                        ) : null}
                        {project.live_url ? (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noreferrer"
                                className="project-link project-link--primary"
                                data-cursor-link
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span>{liveLabel}</span>
                                <ExternalLink aria-hidden="true" className="size-4" />
                            </a>
                        ) : null}
                    </div>
                ) : null}

                {/* Multi-Image Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrevImage}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-9 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center border border-white/15 transition-all opacity-85 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-md"
                        >
                            <ChevronLeft className="size-4 sm:size-5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNextImage}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-9 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center border border-white/15 transition-all opacity-85 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-md"
                        >
                            <ChevronRight className="size-4 sm:size-5" />
                        </button>

                        {/* Image Counter Badge */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11px] font-mono text-white/90 backdrop-blur-md border border-white/10 shadow-sm pointer-events-none select-none">
                            <span>{currentImageIndex + 1}</span>
                            <span className="text-white/40">/</span>
                            <span>{images.length}</span>
                        </div>
                    </>
                )}
            </div>

            {/* 2. Content Body linked to /project/:slug */}
            <div className="flex flex-col p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    <Link
                        href={`/project/${project.slug}`}
                        className="before:absolute before:inset-0 before:z-10 focus:outline-none"
                    >
                        {project.title}
                    </Link>
                </h3>

                {description ? (
                    <p className="project-card-description mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {description}
                    </p>
                ) : null}

                {project.technologies?.length ? (
                    <ul
                        className="relative z-20 mt-3 flex flex-wrap items-center gap-2 border-t border-border/70 pt-2.5 text-white"
                        aria-label={`${project.title} technologies`}
                    >
                        {project.technologies.map((technology) => (
                            <li
                                key={technology.id}
                                title={technology.name}
                                className="flex items-center justify-center text-white transition-opacity hover:opacity-80"
                            >
                                <TechnologyIcon
                                    icon={technology.icon ?? technology.slug}
                                    name={technology.name}
                                    size={18}
                                    useBrandColor={false}
                                    color="#FFFFFF"
                                    className="text-white fill-white"
                                />
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </article>
    );
}
