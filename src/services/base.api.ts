import api from "@/lib/axios";
import {ApiResponse} from "@/types/data";

/**
 * Common generic CRUD helpers to eliminate repetitive HTTP boilerplate
 */
export const getDashboardResource = async <T>(
    resource: string,
    params?: object
): Promise<ApiResponse<T[]>> => {
    const {data} = await api.get<ApiResponse<T[]>>(`/${resource}/dashboard`, {params});
    return data;
};

export const getActiveResource = async <T>(
    resource: string,
    params?: object
): Promise<ApiResponse<T[]>> => {
    const {data} = await api.get<ApiResponse<T[]>>(`/${resource}`, {params});
    return data;
};

export const getResourceById = async <T>(
    resource: string,
    idOrSlug: string,
    params?: object
): Promise<ApiResponse<T>> => {
    const {data} = await api.get<ApiResponse<T>>(`/${resource}/${idOrSlug}`, {params});
    return data;
};

export const createResource = async <T, P = object>(
    resource: string,
    payload: P
): Promise<ApiResponse<T>> => {
    const {data} = await api.post<ApiResponse<T>>(`/${resource}`, payload);
    return data;
};

export const updateResource = async <T, P = object>(
    resource: string,
    id: string,
    payload: Partial<P>
): Promise<ApiResponse<T>> => {
    const {data} = await api.put<ApiResponse<T>>(`/${resource}/${id}`, payload);
    return data;
};

export const patchResource = async <T, P = object>(
    resource: string,
    id: string,
    subpath: string,
    payload: P
): Promise<ApiResponse<T>> => {
    const {data} = await api.patch<ApiResponse<T>>(`/${resource}/${id}/${subpath}`, payload);
    return data;
};

export const deleteResource = async (
    resource: string,
    id: string
): Promise<ApiResponse<null>> => {
    const {data} = await api.delete<ApiResponse<null>>(`/${resource}/${id}`);
    return data;
};
