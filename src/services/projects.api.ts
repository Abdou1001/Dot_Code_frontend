import api from "@/lib/axios";
import {ApiResponse, Project, ProjectImage, ProjectTranslation, Technology, Category} from "@/types/data";
import {
    ProjectListParams as SharedProjectListParams,
    CreateProjectPayload as SharedCreateProjectPayload,
    ProjectTranslationPayload,
} from "@/types/api";
import {
    getDashboardResource,
    getResourceById,
    createResource,
    updateResource,
    patchResource,
    deleteResource,
} from "./base.api";

export type ProjectListParams = SharedProjectListParams;
export type CreateProjectPayload = SharedCreateProjectPayload;
export type TranslationPayload = ProjectTranslationPayload;

const RESOURCE = "projects";

// 3.1 Admin Dashboard: List All Projects
export const getDashboardProjects = (params?: ProjectListParams) =>
    getDashboardResource<Project>(RESOURCE, params);

// 3.3 Get Single Project by Slug
export const getProjectBySlug = (slug: string, locale?: "ar" | "en") =>
    getResourceById<Project>(RESOURCE, slug, locale ? {locale} : undefined);

// 3.4 Create Project
export const createProject = (payload: CreateProjectPayload) =>
    createResource<Project, CreateProjectPayload>(RESOURCE, payload);

// 3.5 Update Project
export const updateProject = (id: string, payload: Partial<CreateProjectPayload>) =>
    updateResource<Project, CreateProjectPayload>(RESOURCE, id, payload);

// 3.6 Update Project Status
export const updateProjectStatus = (id: string, status: "draft" | "published" | "hidden") =>
    patchResource<Project>(RESOURCE, id, "status", {status});

// 3.7 Delete Project
export const deleteProject = (id: string) =>
    deleteResource(RESOURCE, id);

// 4.1 Project Translations
export const getProjectTranslations = async (projectId: string): Promise<ApiResponse<ProjectTranslation[]>> => {
    const {data} = await api.get<ApiResponse<ProjectTranslation[]>>(`/${RESOURCE}/${projectId}/translations`);
    return data;
};

export const upsertProjectTranslation = async (
    projectId: string,
    locale: "ar" | "en",
    payload: TranslationPayload
): Promise<ApiResponse<ProjectTranslation>> => {
    const {data} = await api.put<ApiResponse<ProjectTranslation>>(`/${RESOURCE}/${projectId}/translations/${locale}`, payload);
    return data;
};

export const deleteProjectTranslation = async (projectId: string, locale: "ar" | "en"): Promise<ApiResponse<null>> => {
    const {data} = await api.delete<ApiResponse<null>>(`/${RESOURCE}/${projectId}/translations/${locale}`);
    return data;
};

// 4.2 Project Images
export const getProjectImages = async (projectId: string): Promise<ApiResponse<ProjectImage[]>> => {
    const {data} = await api.get<ApiResponse<ProjectImage[]>>(`/${RESOURCE}/${projectId}/images`);
    return data;
};

export const uploadProjectImage = async (projectId: string, formData: FormData): Promise<ApiResponse<ProjectImage>> => {
    const {data} = await api.post<ApiResponse<ProjectImage>>(`/${RESOURCE}/${projectId}/images`, formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });
    return data;
};

export const updateProjectImage = async (
    projectId: string,
    imageId: string,
    payload: {alt?: string; sort_order?: number; is_featured?: boolean}
): Promise<ApiResponse<ProjectImage>> => {
    const {data} = await api.put<ApiResponse<ProjectImage>>(`/${RESOURCE}/${projectId}/images/${imageId}`, payload);
    return data;
};

export const deleteProjectImage = async (projectId: string, imageId: string): Promise<ApiResponse<null>> => {
    const {data} = await api.delete<ApiResponse<null>>(`/${RESOURCE}/${projectId}/images/${imageId}`);
    return data;
};

// 4.3 Project Technologies
export const getProjectTechnologies = async (projectId: string): Promise<ApiResponse<Technology[]>> => {
    const {data} = await api.get<ApiResponse<Technology[]>>(`/${RESOURCE}/${projectId}/technologies`);
    return data;
};

export const assignProjectTechnology = async (projectId: string, technology_id: string): Promise<ApiResponse<any>> => {
    const {data} = await api.post<ApiResponse<any>>(`/${RESOURCE}/${projectId}/technologies`, {technology_id});
    return data;
};

export const removeProjectTechnology = async (projectId: string, technologyId: string): Promise<ApiResponse<null>> => {
    const {data} = await api.delete<ApiResponse<null>>(`/${RESOURCE}/${projectId}/technologies/${technologyId}`);
    return data;
};

// 4.4 Project Categories
export const getProjectCategories = async (projectId: string): Promise<ApiResponse<Category[]>> => {
    const {data} = await api.get<ApiResponse<Category[]>>(`/${RESOURCE}/${projectId}/categories`);
    return data;
};

export const assignProjectCategory = async (projectId: string, category_id: string): Promise<ApiResponse<any>> => {
    const {data} = await api.post<ApiResponse<any>>(`/${RESOURCE}/${projectId}/categories`, {category_id});
    return data;
};

export const removeProjectCategory = async (projectId: string, categoryId: string): Promise<ApiResponse<null>> => {
    const {data} = await api.delete<ApiResponse<null>>(`/${RESOURCE}/${projectId}/categories/${categoryId}`);
    return data;
};
