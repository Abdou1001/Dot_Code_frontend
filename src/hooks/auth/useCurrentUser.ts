import {useQuery} from "@tanstack/react-query";
import {getMe} from "@/services/auth.api";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: async ({signal}) => {
            const data = await getMe(signal);
            return data?.results?.user || null;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes cache for session user info
    });
};
