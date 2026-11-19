import type { Project, ProjectImage, ProjectTranslation } from "@/types/data";
import type { Locale } from "@/types/enums";

export interface PortfolioProject extends Project {
    title: string;
    description?: string;
    cleanDescription?: string;
    image?: ProjectImage;
    images: ProjectImage[];
}

export function sortProjectImages(images: ProjectImage[] | undefined): ProjectImage[] {
    return [...(images ?? [])].sort((first, second) => {
        if (first.is_featured !== second.is_featured) return Number(second.is_featured) - Number(first.is_featured);
        return first.sort_order - second.sort_order;
    });
}

export function stripHtmlTags(text?: string): string {
    if (!text) return "";
    return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getTranslation(project: Project, locale: Locale): ProjectTranslation | undefined {
    return project.translation
        ?? project.translations?.find((translation) => translation.locale === locale)
        ?? project.translations?.find((translation) => translation.locale === "en")
        ?? project.translations?.find((translation) => translation.locale === "ar")
        ?? project.translations?.[0];
}

export function createPortfolioProjects(projects: Project[], locale: Locale): PortfolioProject[] {
    const localizedProjects = projects.map((project) => {
        const translation = getTranslation(project, locale);
        const sortedImages = sortProjectImages(project.images);

        return {
            ...project,
            title: translation?.title ?? project.slug,
            description: translation?.description,
            cleanDescription: stripHtmlTags(translation?.description),
            image: sortedImages[0],
            images: sortedImages,
        };
    });

    return localizedProjects;
}
