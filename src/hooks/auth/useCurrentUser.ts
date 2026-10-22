import {useQuery} from "@tanstack/react-query";
import {getMe} from "@/api/auth.api";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const data = await getMe();
            return data?.results?.user || null;
        },
    });
};
