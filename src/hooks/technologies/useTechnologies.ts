import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    getDashboardTechnologies,
    getActiveTechnologies,
    getTechnologyById,
    createTechnology,
    updateTechnology,
    deleteTechnology,
    TechnologyListParams,
    CreateTechnologyPayload,
} from "@/services/technologies.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

export const useTechnologies = (params?: TechnologyListParams) => {
    return useQuery({
        queryKey: ["dashboard-technologies", params?.page, params?.search, params?.is_active],
        queryFn: () => getDashboardTechnologies(params),
    });
};

export const useActiveTechnologies = () => {
    return useQuery({
        queryKey: ["active-technologies"],
        queryFn: () => getActiveTechnologies(),
    });
};

export const useTechnology = (id?: string) => {
    return useQuery({
        queryKey: ["technology", id],
        queryFn: () => getTechnologyById(id!),
        enabled: Boolean(id),
    });
};

export const useCreateTechnology = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateTechnologyPayload) => createTechnology(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-technologies"]});
            queryClient.invalidateQueries({queryKey: ["active-technologies"]});
            queryClient.invalidateQueries({queryKey: ["all-system-technologies"]});
            toast.success("تم إضافة التقنية بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل إضافة التقنية"));
        },
    });
};

export const useUpdateTechnology = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, payload}: {id: string; payload: Partial<CreateTechnologyPayload>}) =>
            updateTechnology(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-technologies"]});
            queryClient.invalidateQueries({queryKey: ["active-technologies"]});
            queryClient.invalidateQueries({queryKey: ["all-system-technologies"]});
            toast.success("تم تحديث التقنية بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل تحديث التقنية"));
        },
    });
};

export const useDeleteTechnology = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTechnology(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-technologies"]});
            queryClient.invalidateQueries({queryKey: ["active-technologies"]});
            queryClient.invalidateQueries({queryKey: ["all-system-technologies"]});
            toast.success("تم حذف التقنية بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حذف التقنية"));
        },
    });
};
