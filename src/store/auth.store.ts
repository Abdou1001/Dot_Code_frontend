import {create} from "zustand";
import {User} from "@/types/data";

export type {User};

interface AuthState {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,

    isLoading: true,

    setUser: (user) =>
        set({
            user,
            isLoading: false,
        }),

    setLoading: (loading) =>
        set({
            isLoading: loading,
        }),

    clearUser: () =>
        set({
            user: null,
            isLoading: false,
        }),
}));
