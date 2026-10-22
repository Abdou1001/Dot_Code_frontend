import api from "@/lib/axios";
import {ApiResponse, Testimonial} from "@/types/data";
import {TestimonialListParams as SharedTestimonialListParams} from "@/types/api";
import {
    getDashboardResource,
    getResourceById,
    deleteResource,
} from "./base.api";

export type TestimonialListParams = SharedTestimonialListParams;

const RESOURCE = "testimonials";

// 8.1 Admin Dashboard: List Testimonials
export const getDashboardTestimonials = (params?: TestimonialListParams) =>
    getDashboardResource<Testimonial>(RESOURCE, params);

// 8.3 Get Testimonial by ID
export const getTestimonialById = (id: string) =>
    getResourceById<Testimonial>(RESOURCE, id);

// 8.4 Create Testimonial (supports multipart/form-data for image)
export const createTestimonial = async (payload: FormData | object): Promise<ApiResponse<Testimonial>> => {
    const isFormData = payload instanceof FormData;
    const {data} = await api.post<ApiResponse<Testimonial>>(`/${RESOURCE}`, payload, {
        headers: isFormData ? {"Content-Type": "multipart/form-data"} : undefined,
    });
    return data;
};

// 8.5 Update Testimonial (supports multipart/form-data for image)
export const updateTestimonial = async (id: string, payload: FormData | object): Promise<ApiResponse<Testimonial>> => {
    const isFormData = payload instanceof FormData;
    const {data} = await api.put<ApiResponse<Testimonial>>(`/${RESOURCE}/${id}`, payload, {
        headers: isFormData ? {"Content-Type": "multipart/form-data"} : undefined,
    });
    return data;
};

// 8.6 Delete Testimonial
export const deleteTestimonial = (id: string) =>
    deleteResource(RESOURCE, id);
