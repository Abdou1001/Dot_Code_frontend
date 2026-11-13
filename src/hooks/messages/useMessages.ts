import {useQuery, useMutation, useQueryClient, keepPreviousData} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    getDashboardMessages,
    getMessageById,
    updateMessageStatus,
    deleteMessage,
    MessageListParams,
} from "@/services/messages.api";
import {getApiErrorMessage} from "@/hooks/useApiError";

export const useMessages = (params?: MessageListParams) => {
    return useQuery({
        queryKey: [
            "dashboard-messages",
            params?.page,
            params?.limit,
            params?.search,
            params?.status,
        ],
        queryFn: ({signal}) => getDashboardMessages(params, signal),
        placeholderData: keepPreviousData,
    });
};

export const useMessagesCount = () => {
    return useQuery({
        queryKey: ["dashboard-messages-count"],
        queryFn: ({signal}) => getDashboardMessages({limit: 1}, signal),
        staleTime: 2 * 60 * 1000,
    });
};

export const useMessage = (id?: string) => {
    return useQuery({
        queryKey: ["dashboard-message", id],
        queryFn: ({signal}) => getMessageById(id!, signal),
        enabled: Boolean(id),
    });
};

export const useUpdateMessageStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, status}: {id: string; status: "new" | "read" | "replied" | "archived"}) =>
            updateMessageStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-messages"]});
            queryClient.invalidateQueries({queryKey: ["dashboard-messages-count"]});
            toast.success("تم تحديث حالة الرسالة بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل تحديث حالة الرسالة"));
        },
    });
};

export const useDeleteMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteMessage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard-messages"]});
            queryClient.invalidateQueries({queryKey: ["dashboard-messages-count"]});
            toast.success("تم حذف الرسالة بنجاح");
        },
        onError: (err: any) => {
            toast.error(getApiErrorMessage(err, "فشل حذف الرسالة"));
        },
    });
};
