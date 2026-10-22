import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    getDashboardCategories,
    getActiveCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    CategoryListParams,
    CreateCategoryPayload,
} from "@/services/categories.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

export const useCategories = (params?: CategoryListParams) => {
    return useQuery({
        queryKey: ["dashboard-categories", params?.page, params?.search, params?.is_active],
        queryFn: () => getDashboardCategories(params),
    });
};

export const useActiveCategories = () => {
    return useQuery({
        queryKey: ["active-categories"],
        queryFn: () => getActiveCategories(),
    });
};

export const useCategory = (id?: string) => {
    return useQuery({
        queryKey: ["category", id],
        queryFn: () => getCategoryById(id!),
        enabled: Boolean(id),
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-categories"]});
            queryClient.invalidateQueries({queryKey: ["active-categories"]});
            queryClient.invalidateQueries({queryKey: ["all-system-categories"]});
            toast.success("تم إنشاء التصنيف بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل إنشاء التصنيف"));
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, payload}: {id: string; payload: Partial<CreateCategoryPayload>}) =>
            updateCategory(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-categories"]});
            queryClient.invalidateQueries({queryKey: ["active-categories"]});
            queryClient.invalidateQueries({queryKey: ["all-system-categories"]});
            toast.success("تم تحديث التصنيف بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل تحديث التصنيف"));
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-categories"]});
            queryClient.invalidateQueries({queryKey: ["active-categories"]});
            queryClient.invalidateQueries({queryKey: ["all-system-categories"]});
            toast.success("تم حذف التصنيف بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حذف التصنيف"));
        },
    });
};
