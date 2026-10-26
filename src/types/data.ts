import {LucideProps} from "lucide-react";
import {ForwardRefExoticComponent} from "react";

export interface Pagination {
    page: number;
    limit: number;
    totalResults: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
}

export interface ApiResponse<T> {
    status: "success" | "fail" | "error";
    message: string;
    results: T;
    pagination?: Pagination;
}

export interface CardData {
    id: string | number;
    name: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
    value: number | string;
    footer?: string;
    growth?: number;
    isCurrency?: boolean;
}

// User Profile
export interface User {
    id: string;
    full_name: string;
    email: string;
    role: "admin";
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

// Project
export interface ProjectTranslation {
    id?: string;
    project_id?: string;
    locale: "ar" | "en";
    title: string;
    description?: string;
    role?: string;
    challenge?: string;
    solution?: string;
    result?: string;
    meta_title?: string;
    meta_description?: string;
}

export interface ProjectImage {
    id: string;
    project_id: string;
    image_url: string;
    alt?: string;
    sort_order: number;
    is_featured: boolean;
    created_at?: string;
}

export interface Project {
    id: string;
    slug: string;
    status: "draft" | "published" | "hidden";
    featured: boolean;
    sort_order: number;
    live_url?: string | null;
    github_url?: string | null;
    created_at?: string;
    updated_at?: string;
    translation?: ProjectTranslation;
    translations?: ProjectTranslation[];
    images?: ProjectImage[];
    technologies?: Technology[];
    categories?: Category[];
}

// Category
export interface Category {
    id: string;
    name: string;
    name_ar?: string | null;
    slug: string;
    sort_order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

// Technology
export interface Technology {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    sort_order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

// Service
export interface ServiceTranslation {
    id?: string;
    service_id?: string;
    locale: "ar" | "en";
    title: string;
    description?: string;
}

export interface Service {
    id: string;
    slug: string;
    icon?: string;
    sort_order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    translations?: ServiceTranslation[];
}

// Testimonial
export interface Testimonial {
    id: string;
    client_name: string;
    client_role?: string;
    company?: string;
    client_image_url?: string;
    rating?: number;
    testimonial: string;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

// Contact Message
export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    status: "new" | "read" | "replied" | "archived";
    created_at?: string;
    updated_at?: string;
}

// Visitor Analytics
export interface VisitorAnalyticsSummary {
    timeframe: {
        days: number;
        since: string;
    };
    overview: {
        total_views: number;
        today_views: number;
        unique_visitors: number;
        avg_pages_per_session: number;
    };
    top_pages: {item: string; count: number}[];
    device_breakdown: {device: string; count: number}[];
    top_referrers: {item: string; count: number}[];
    top_countries: {item: string; count: number}[];
    daily_trends: {date: string; count: number}[];
}

export interface VisitorEvent {
    id: string;
    session_id: string;
    page_path: string;
    referrer?: string;
    device_type?: string;
    country?: string;
    created_at: string;
}
