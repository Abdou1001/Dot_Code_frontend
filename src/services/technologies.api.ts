import {Technology} from "@/types/data";
import {ActiveListParams, NamedIconEntityPayload} from "@/types/api";
import {
    getDashboardResource,
    getActiveResource,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
} from "./base.api";

export type TechnologyListParams = ActiveListParams;
export type CreateTechnologyPayload = NamedIconEntityPayload;

const RESOURCE = "technologies";

// 6.1 Admin Dashboard: List Technologies
export const getDashboardTechnologies = (params?: TechnologyListParams) =>
    getDashboardResource<Technology>(RESOURCE, params);

// 6.2 Public: List Active Technologies
export const getActiveTechnologies = () =>
    getActiveResource<Technology>(RESOURCE);

// 6.3 Get Technology by ID or Slug
export const getTechnologyById = (id: string) =>
    getResourceById<Technology>(RESOURCE, id);

// 6.4 Create Technology
export const createTechnology = (payload: CreateTechnologyPayload) =>
    createResource<Technology, CreateTechnologyPayload>(RESOURCE, payload);

// 6.5 Update Technology
export const updateTechnology = (id: string, payload: Partial<CreateTechnologyPayload>) =>
    updateResource<Technology, CreateTechnologyPayload>(RESOURCE, id, payload);

// 6.6 Delete Technology
export const deleteTechnology = (id: string) =>
    deleteResource(RESOURCE, id);
