import type {
    ApiResponse,
    Category,
    Pagination,
    Project,
    ProjectImage,
    ProjectTranslation,
    Service,
    ServiceTranslation,
    Technology,
    Testimonial,
} from "@/types/data";

/* -------------------------------------------------------------------------- */
/*                                Types & Config                              */
/* -------------------------------------------------------------------------- */

type PublicListResponse<T> = ApiResponse<T[]> & { pagination?: Pagination };

interface HeroPortfolioData {
    projectsCount: number | null;
    servicesCount: number | null;
    testimonialsCount: number | null;
}

const API_ORIGIN = process.env.BACKEND_URL;

/* -------------------------------------------------------------------------- */
/*                            Generic Fetch Helpers                           */
/* -------------------------------------------------------------------------- */

/**
 * Low-level fetch wrapper for public API endpoints with error boundaries and caching.
 */
async function fetchPublicApi<T>(
    endpoint: string,
    options?: {
        params?: Record<string, string>;
        fresh?: boolean;
        revalidate?: number;
    }
): Promise<T | null> {
    if (!API_ORIGIN) return null;

    try {
        const url = new URL(`${API_ORIGIN}/api/${endpoint}`);
        if (options?.params) {
            Object.entries(options.params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.set(key, value);
                }
            });
        }

        const fetchInit: RequestInit = options?.fresh
            ? { cache: "no-store" }
            : { next: { revalidate: options?.revalidate ?? 600 } };

        const response = await fetch(url.toString(), fetchInit);
        if (!response.ok) return null;

        return (await response.json()) as T;
    } catch {
        return null;
    }
}

/**
 * Fetch a paginated public collection.
 */
async function getPublicList<T>(
    resource: string,
    limit = 12,
    query?: Record<string, string>,
    fresh = false
): Promise<PublicListResponse<T> | null> {
    return fetchPublicApi<PublicListResponse<T>>(resource, {
        params: { page: "1", limit: String(limit), ...query },
        fresh,
    });
}

/**
 * Fetch a flat array resource (e.g. nested sub-resources).
 */
async function getPublicResource<T>(resource: string, fresh = false): Promise<ApiResponse<T[]> | null> {
    return fetchPublicApi<ApiResponse<T[]>>(resource, { fresh });
}

/**
 * Helper to safely extract total count from pagination metadata.
 */
function getCount<T>(response: PublicListResponse<T> | null): number | null {
    return response?.pagination?.totalResults ?? null;
}

/**
 * Concurrently populates a project with its public nested sub-resources
 * (translations, images, technologies, and categories).
 */
async function enrichProjectRelations(project: Project, fresh = true): Promise<Project> {
    const [translations, images, technologies, categories] = await Promise.all([
        getPublicResource<ProjectTranslation>(`projects/${project.id}/translations`, fresh),
        getPublicResource<ProjectImage>(`projects/${project.id}/images`, fresh),
        getPublicResource<Technology>(`projects/${project.id}/technologies`, fresh),
        getPublicResource<Category>(`projects/${project.id}/categories`, fresh),
    ]);

    return {
        ...project,
        translations: translations?.results ?? [],
        images: images?.results ?? [],
        technologies: technologies?.results ?? [],
        categories: categories?.results ?? [],
    };
}

/* -------------------------------------------------------------------------- */
/*                         1. Hero & Metrics Services                         */
/* -------------------------------------------------------------------------- */

/**
 * Reads public summary counts for the Hero section statistics counters.
 */
export async function getHeroPortfolioData(): Promise<HeroPortfolioData> {
    const [projects, services, testimonials] = await Promise.all([
        getPublicList<Project>("projects", 1),
        getPublicList<Service>("services", 1),
        getPublicList<Testimonial>("testimonials", 1),
    ]);

    return {
        projectsCount: getCount(projects),
        servicesCount: getCount(services),
        testimonialsCount: getCount(testimonials),
    };
}

/**
 * Decorative floating technologies for ambient particle backgrounds.
 */
export async function getFloatingTechnologies(): Promise<Technology[]> {
    const response = await getPublicList<Technology>("technologies");
    return response?.results ?? [];
}

/* -------------------------------------------------------------------------- */
/*                            2. Categories Services                          */
/* -------------------------------------------------------------------------- */

/**
 * Reads active categories for filter badges and section navigation.
 */
export async function getActiveCategories(): Promise<Category[]> {
    const response = await getPublicList<Category>("categories");
    return response?.results ?? [];
}

/* -------------------------------------------------------------------------- */
/*                             3. Services Domain                             */
/* -------------------------------------------------------------------------- */

/**
 * Reads public services enriched with localized translations.
 */
export async function getActiveServices(limit = 100): Promise<Service[]> {
    const response = await getPublicList<Service>("services", limit);
    const activeServices = response?.results ?? [];

    return Promise.all(
        activeServices.map(async (service) => {
            const translations = await getPublicResource<ServiceTranslation>(`services/${service.id}/translations`);
            return {
                ...service,
                translations: translations?.results ?? [],
            };
        })
    );
}

/* -------------------------------------------------------------------------- */
/*                             4. Projects Domain                             */
/* -------------------------------------------------------------------------- */

/**
 * Reads published projects with their complete relations for the portfolio scroller.
 */
export async function getPublishedProjects(limit = 20): Promise<Project[]> {
    const response = await getPublicList<Project>("projects", limit, undefined, true);
    const publishedProjects = response?.results ?? [];

    return Promise.all(publishedProjects.map((project) => enrichProjectRelations(project, true)));
}

/**
 * Reads a single published project by slug with full relation population for the detail page.
 */
export async function getPublicProjectBySlug(slug: string, locale?: string): Promise<Project | null> {
    const response = await fetchPublicApi<ApiResponse<Project>>(`projects/${slug}`, {
        params: locale ? { locale } : undefined,
        fresh: true,
    });

    const project = response?.results;
    if (!project?.id) return null;

    return enrichProjectRelations(project, true);
}

/* -------------------------------------------------------------------------- */
/*                           5. Testimonials Domain                           */
/* -------------------------------------------------------------------------- */

/**
 * Reads published testimonials approved for public client display.
 */
export async function getPublishedTestimonials(limit = 100): Promise<Testimonial[]> {
    const response = await getPublicList<Testimonial>("testimonials", limit);
    return response?.results ?? [];
}
