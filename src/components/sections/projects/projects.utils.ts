import type { Project, ProjectImage, ProjectTranslation } from "@/types/data";
import type { Locale } from "@/types/enums";

export interface PortfolioProject extends Project {
    title: string;
    description?: string;
    image?: ProjectImage;
}

function getPrimaryImage(images: ProjectImage[] | undefined) {
    return [...(images ?? [])].sort((first, second) => {
        if (first.is_featured !== second.is_featured) return Number(second.is_featured) - Number(first.is_featured);
        return first.sort_order - second.sort_order;
    })[0];
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

        return {
            ...project,
            title: translation?.title ?? project.slug,
            description: translation?.description,
            image: getPrimaryImage(project.images),
        };
    });

    return localizedProjects;
}
