import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {login} from "@/api/auth.api";
import {useAuth} from "@/hooks/auth/useAuth";
import {useRouter} from "next/navigation";
import {getApiErrorMessage} from "@/hooks/useApiError";

export const useLogin = () => {
    const router = useRouter();
    const {setUser} = useAuth();

    return useMutation({
        mutationFn: login,

        onSuccess(data) {
            const user = data?.results?.user;
            if (user) {
                setUser(user);
            }
            toast.success(data?.message || "تم تسجيل الدخول بنجاح");
            router.replace("/dashboard");
        },

        onError(error: any) {
            toast.error(
                getApiErrorMessage(error, "حدث خطأ أثناء تسجيل الدخول"),
            );
        },
    });
};
