import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    getDashboardServices,
    getActiveServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getServiceTranslations,
    upsertServiceTranslation,
    deleteServiceTranslation,
    ServiceListParams,
    CreateServicePayload,
    ServiceTranslationPayload,
} from "@/services/services.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

export const useServices = (params?: ServiceListParams) => {
    return useQuery({
        queryKey: ["dashboard-services", params?.page, params?.search, params?.is_active],
        queryFn: () => getDashboardServices(params),
    });
};

export const useActiveServices = () => {
    return useQuery({
        queryKey: ["active-services"],
        queryFn: () => getActiveServices(),
    });
};

export const useService = (id?: string) => {
    return useQuery({
        queryKey: ["service", id],
        queryFn: () => getServiceById(id!),
        enabled: Boolean(id),
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateServicePayload) => createService(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-services"]});
            queryClient.invalidateQueries({queryKey: ["active-services"]});
            toast.success("تم إنشاء الخدمة بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل إنشاء الخدمة"));
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, payload}: {id: string; payload: Partial<CreateServicePayload>}) =>
            updateService(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-services"]});
            queryClient.invalidateQueries({queryKey: ["active-services"]});
            toast.success("تم تحديث الخدمة بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل تحديث الخدمة"));
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-services"]});
            queryClient.invalidateQueries({queryKey: ["active-services"]});
            toast.success("تم حذف الخدمة بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حذف الخدمة"));
        },
    });
};

export const useServiceTranslations = (serviceId?: string) => {
    return useQuery({
        queryKey: ["service-translations", serviceId],
        queryFn: () => getServiceTranslations(serviceId!),
        enabled: Boolean(serviceId),
    });
};

export const useUpsertServiceTranslation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            serviceId,
            locale,
            payload,
        }: {
            serviceId: string;
            locale: "ar" | "en";
            payload: ServiceTranslationPayload;
        }) => upsertServiceTranslation(serviceId, locale, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: ["service-translations", variables.serviceId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-services"]});
            toast.success("تم حفظ ترجمة الخدمة");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حفظ ترجمة الخدمة"));
        },
    });
};

export const useDeleteServiceTranslation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({serviceId, locale}: {serviceId: string; locale: "ar" | "en"}) =>
            deleteServiceTranslation(serviceId, locale),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: ["service-translations", variables.serviceId]});
            queryClient.invalidateQueries({queryKey: ["dashboard-services"]});
            toast.success("تم حذف ترجمة الخدمة");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حذف ترجمة الخدمة"));
        },
    });
};
