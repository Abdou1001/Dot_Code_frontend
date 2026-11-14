import type { ApiResponse, Category, Pagination, Project, Service, ServiceTranslation, Technology, Testimonial } from "@/types/data";

type PublicListResponse<T> = ApiResponse<T[]> & { pagination?: Pagination };

interface HeroPortfolioData {
    projectsCount: number | null;
    servicesCount: number | null;
    testimonialsCount: number | null;
}

const API_ORIGIN = process.env.BACKEND_URL;

async function getPublicList<T>(resource: string, limit = 12): Promise<PublicListResponse<T> | null> {
    if (!API_ORIGIN) return null;

    try {
        const response = await fetch(`${API_ORIGIN}/api/${resource}?page=1&limit=${limit}`, {
            next: { revalidate: 600 },
        });

        if (!response.ok) return null;
        return response.json() as Promise<PublicListResponse<T>>;
    } catch {
        return null;
    }
}

async function getPublicResource<T>(resource: string): Promise<ApiResponse<T[]> | null> {
    if (!API_ORIGIN) return null;

    try {
        const response = await fetch(`${API_ORIGIN}/api/${resource}`, {
            next: { revalidate: 600 },
        });

        if (!response.ok) return null;
        return response.json() as Promise<ApiResponse<T[]>>;
    } catch {
        return null;
    }
}

function getCount<T>(response: PublicListResponse<T> | null): number | null {
    return response?.pagination?.totalResults ?? null;
}

/**
 * Reads only public API resources. The API itself applies visibility rules:
 * Public project results are published by the Backend. Services and testimonials
 * likewise apply their public visibility rules at the API boundary.
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

/** Decorative data only: an empty result deliberately renders no background. */
export async function getFloatingTechnologies(): Promise<Technology[]> {
    const technologies = await getPublicList<Technology>("technologies");
    return technologies?.results ?? [];
}

/** The public endpoint returns only active categories, ordered by the Backend. */
export async function getActiveCategories(): Promise<Category[]> {
    const categories = await getPublicList<Category>("categories");
    return categories?.results ?? [];
}

/** Public services are loaded with their public translations for server-rendered sections. */
export async function getActiveServices(limit = 100): Promise<Service[]> {
    const services = await getPublicList<Service>("services", limit);
    const activeServices = services?.results ?? [];

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

/** The public endpoint returns only testimonials approved for public display. */
export async function getPublishedTestimonials(limit = 100): Promise<Testimonial[]> {
    const testimonials = await getPublicList<Testimonial>("testimonials", limit);
    return testimonials?.results ?? [];
}
