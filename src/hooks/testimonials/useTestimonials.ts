import {useQuery, useMutation, useQueryClient, keepPreviousData} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    getDashboardTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    TestimonialListParams,
} from "@/services/testimonials.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

export const useTestimonials = (params?: TestimonialListParams) => {
    return useQuery({
        queryKey: [
            "dashboard-testimonials",
            params?.page,
            params?.limit,
            params?.search,
            params?.is_published,
            params?.is_featured,
        ],
        queryFn: ({signal}) => getDashboardTestimonials(params, signal),
        placeholderData: keepPreviousData,
    });
};

export const useTestimonialsCount = () => {
    return useQuery({
        queryKey: ["dashboard-testimonials-count"],
        queryFn: ({signal}) => getDashboardTestimonials({limit: 1}, signal),
        staleTime: 2 * 60 * 1000,
    });
};

export const useTestimonial = (id?: string) => {
    return useQuery({
        queryKey: ["dashboard-testimonial", id],
        queryFn: ({signal}) => getTestimonialById(id!, signal),
        enabled: Boolean(id),
    });
};

export const useCreateTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: FormData | object) => createTestimonial(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-testimonials"]});
            queryClient.invalidateQueries({queryKey: ["dashboard-testimonials-count"]});
            toast.success("تم إنشاء رأي العميل بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل إنشاء التوصية"));
        },
    });
};

export const useUpdateTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, payload}: {id: string; payload: FormData | object}) =>
            updateTestimonial(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-testimonials"]});
            toast.success("تم تحديث رأي العميل بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل تحديث التوصية"));
        },
    });
};

export const useDeleteTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTestimonial(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-testimonials"]});
            queryClient.invalidateQueries({queryKey: ["dashboard-testimonials-count"]});
            toast.success("تم حذف رأي العميل بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حذف التوصية"));
        },
    });
};
