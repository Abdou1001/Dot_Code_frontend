import {Category} from "@/types/data";
import {ActiveListParams, NamedEntityPayload} from "@/types/api";
import {
    getDashboardResource,
    getActiveResource,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
} from "./base.api";

export type CategoryListParams = ActiveListParams;
export type CreateCategoryPayload = NamedEntityPayload;

const RESOURCE = "categories";

// 5.1 Admin Dashboard: List Categories
export const getDashboardCategories = (params?: CategoryListParams) =>
    getDashboardResource<Category>(RESOURCE, params);

// 5.2 Public: List Active Categories
export const getActiveCategories = () =>
    getActiveResource<Category>(RESOURCE);

// 5.3 Get Category by ID or Slug
export const getCategoryById = (id: string) =>
    getResourceById<Category>(RESOURCE, id);

// 5.4 Create Category
export const createCategory = (payload: CreateCategoryPayload) =>
    createResource<Category, CreateCategoryPayload>(RESOURCE, payload);

// 5.5 Update Category
export const updateCategory = (id: string, payload: Partial<CreateCategoryPayload>) =>
    updateResource<Category, CreateCategoryPayload>(RESOURCE, id, payload);

// 5.6 Delete Category
export const deleteCategory = (id: string) =>
    deleteResource(RESOURCE, id);
