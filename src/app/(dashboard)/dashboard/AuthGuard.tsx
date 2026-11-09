"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/auth/useAuth";

type AuthGuardProps = {
    children: React.ReactNode;
    allowedRoles?: string[];
};

export default function AuthGuard({children, allowedRoles}: AuthGuardProps) {
    const router = useRouter();
    const {user, isLoading} = useAuth();
    const allowedRolesKey = allowedRoles ? allowedRoles.join(",") : "";

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.replace("/login");
            return;
        }
        if (allowedRolesKey && !allowedRolesKey.split(",").includes(user.role)) {
            router.replace("/login");
        }
    }, [user, isLoading, allowedRolesKey, router]);

    return <>{children}</>;
}
