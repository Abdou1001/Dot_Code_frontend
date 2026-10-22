import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {logout} from "@/api/auth.api";
import {useAuth} from "@/hooks/auth/useAuth";
import {useRouter} from "next/navigation";
import {getApiErrorMessage} from "@/hooks/useApiError";

export const useLogout = () => {
    const router = useRouter();

    const {clearUser} = useAuth();

    return useMutation({
        mutationFn: logout,

        onSuccess(data) {
            clearUser();
            toast.success(data?.message || "تم تسجيل الخروج بنجاح");
            router.replace("/login");
        },

        onError(error: any) {
            toast.error(
                getApiErrorMessage(error, "حدث خطأ أثناء تسجيل الخروج"),
            );
        },
    });
};
