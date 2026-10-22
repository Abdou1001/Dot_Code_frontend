export interface BaseFilters {
    page: number;
    limit: number;
    search?: string;
}

export interface ProjectFilters extends BaseFilters {
    status?: string;
}

export const PROJECT_FILTERS: ProjectFilters = {
    page: 1,
    limit: 20,
    search: "",
    status: "",
};

export interface CategoryFilters extends BaseFilters {
    is_active?: string;
}

export const CATEGORY_FILTERS: CategoryFilters = {
    page: 1,
    limit: 20,
    search: "",
    is_active: "",
};

export interface TechnologyFilters extends BaseFilters {
    is_active?: string;
}

export const TECHNOLOGY_FILTERS: TechnologyFilters = {
    page: 1,
    limit: 20,
    search: "",
    is_active: "",
};

export interface ServiceFilters extends BaseFilters {
    is_active?: string;
}

export const SERVICE_FILTERS: ServiceFilters = {
    page: 1,
    limit: 20,
    search: "",
    is_active: "",
};

export interface TestimonialFilters extends BaseFilters {
    is_published?: string;
    is_featured?: string;
}

export const TESTIMONIAL_FILTERS: TestimonialFilters = {
    page: 1,
    limit: 20,
    search: "",
    is_published: "",
    is_featured: "",
};

export interface MessageFilters extends BaseFilters {
    status?: string;
}

export const MESSAGE_FILTERS: MessageFilters = {
    page: 1,
    limit: 20,
    search: "",
    status: "",
};

export interface VisitorAnalyticsFilters {
    days?: number;
}

export const VISITOR_ANALYTICS_FILTERS: VisitorAnalyticsFilters = {
    days: 30,
};

export interface VisitorEventFilters extends BaseFilters {
    session_id?: string;
    page_path?: string;
    device_type?: string;
    country?: string;
    from_date?: string;
    to_date?: string;
}

export const VISITOR_EVENT_FILTERS: VisitorEventFilters = {
    page: 1,
    limit: 20,
    session_id: "",
    page_path: "",
    device_type: "",
    country: "",
    from_date: "",
    to_date: "",
};
