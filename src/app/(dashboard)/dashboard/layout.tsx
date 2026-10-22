import AppSidebar from "@/components/shared/sidebar/app-sidebar";
import Topbar from "@/components/shared/topbar";
import {SidebarProvider} from "@/components/ui/sidebar";
import {Metadata} from "next";
import AuthProvider from "@/components/providers/AuthProvider";
import AuthGuard from "./AuthGuard";

export const metadata: Metadata = {
    title: "لوحة التحكم | Dot Code Portfolio",
    description: "لوحة التحكم وإدارة المحتوى لمشروع Dot Code Portfolio",
};

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return (
        <AuthProvider>
            <AuthGuard allowedRoles={["admin"]}>
                <SidebarProvider>
                    <div dir="rtl" className="relative flex min-h-screen w-full bg-[#060b26] text-slate-100 overflow-x-hidden">
                        {/* Ambient Vision UI glow accents */}
                        <div className="fixed top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none -z-10" />
                        <div className="fixed bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[160px] pointer-events-none -z-10" />

                        <AppSidebar />

                        <div className="flex flex-1 flex-col min-w-0">
                            <Topbar />
                            <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
                                {children}
                            </main>
                        </div>
                    </div>
                </SidebarProvider>
            </AuthGuard>
        </AuthProvider>
    );
}
