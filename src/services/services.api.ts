import api from "@/lib/axios";
import {ApiResponse, Service, ServiceTranslation} from "@/types/data";
import {ActiveListParams, IconEntityPayload, BaseTranslationPayload} from "@/types/api";
import {
    getDashboardResource,
    getActiveResource,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
} from "./base.api";

export type ServiceListParams = ActiveListParams;
export type CreateServicePayload = IconEntityPayload;
export type ServiceTranslationPayload = BaseTranslationPayload;

const RESOURCE = "services";

// 7.1 Admin Dashboard: List Services
export const getDashboardServices = (params?: ServiceListParams, signal?: AbortSignal) =>
    getDashboardResource<Service>(RESOURCE, params, signal);

// 7.2 Public: List Active Services
export const getActiveServices = (signal?: AbortSignal) =>
    getActiveResource<Service>(RESOURCE, undefined, signal);

// 7.3 Get Service by ID or Slug
export const getServiceById = (id: string, signal?: AbortSignal) =>
    getResourceById<Service>(RESOURCE, id, undefined, signal);

// 7.4 Create Service
export const createService = (payload: CreateServicePayload) =>
    createResource<Service, CreateServicePayload>(RESOURCE, payload);

// 7.5 Update Service
export const updateService = (id: string, payload: Partial<CreateServicePayload>) =>
    updateResource<Service, CreateServicePayload>(RESOURCE, id, payload);

// 7.6 Delete Service
export const deleteService = (id: string) =>
    deleteResource(RESOURCE, id);

// 7.7 Service Translations Sub-Resource
export const getServiceTranslations = async (
    serviceId: string,
    signal?: AbortSignal
): Promise<ApiResponse<ServiceTranslation[]>> => {
    const {data} = await api.get<ApiResponse<ServiceTranslation[]>>(`/${RESOURCE}/${serviceId}/translations`, {
        signal,
    });
    return data;
};

export const upsertServiceTranslation = async (
    serviceId: string,
    locale: "ar" | "en",
    payload: ServiceTranslationPayload
): Promise<ApiResponse<ServiceTranslation>> => {
    const {data} = await api.put<ApiResponse<ServiceTranslation>>(`/${RESOURCE}/${serviceId}/translations/${locale}`, payload);
    return data;
};

export const deleteServiceTranslation = async (serviceId: string, locale: "ar" | "en"): Promise<ApiResponse<null>> => {
    const {data} = await api.delete<ApiResponse<null>>(`/${RESOURCE}/${serviceId}/translations/${locale}`);
    return data;
};
