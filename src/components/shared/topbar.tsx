"use client";

import {usePathname} from "next/navigation";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {useAuth} from "@/hooks/auth/useAuth";
import {useLogout} from "@/hooks/auth/useLogout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
    ChevronDown,
    LogOut,
    User as UserIcon,
    Shield,
} from "lucide-react";
import Link from "next/link";

const PAGE_TITLES: Record<string, {title: string; category: string}> = {
    "/dashboard": {title: "نظرة عامة", category: "الرئيسية"},
    "/dashboard/projects": {title: "إدارة المشاريع", category: "المحتوى"},
    "/dashboard/categories": {title: "إدارة التصنيفات", category: "المحتوى"},
    "/dashboard/technologies": {title: "إدارة التقنيات", category: "المحتوى"},
    "/dashboard/services": {title: "إدارة الخدمات", category: "المحتوى"},
    "/dashboard/testimonials": {title: "آراء العملاء", category: "المحتوى"},
    "/dashboard/messages": {title: "رسائل التواصل", category: "التواصل"},
    "/dashboard/analytics": {title: "إحصائيات الزوار", category: "التحليلات"},
    "/dashboard/account": {title: "بيانات الحساب", category: "الإدارة"},
};

export default function Topbar() {
    const pathname = usePathname();
    const {user} = useAuth();
    const logout = useLogout();

    const currentRoute = Object.entries(PAGE_TITLES).find(([route]) =>
        route === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(route)
    );

    const {title, category} = currentRoute ? currentRoute[1] : {title: "لوحة التحكم", category: "Dot Code"};

    const initials = user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : "DC";

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#060b26]/75 px-4 md:px-6 backdrop-blur-xl">
            {/* Right Side (in RTL): Breadcrumbs & Title */}
            <div className="flex items-center gap-3">
                <SidebarTrigger className="text-slate-300 hover:text-white hover:bg-white/5 p-2 rounded-lg" />
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>لوحة التحكم</span>
                        <span>/</span>
                        <span>{category}</span>
                    </div>
                    <h1 className="text-base md:text-lg font-bold text-white tracking-wide">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Left Side (in RTL): User Profile Menu & Admin Badge */}
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                    <Shield className="size-3.5" />
                    <span className="font-medium">مدير النظام</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 px-2 py-1.5 text-slate-200 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10 rounded-xl transition">
                            <Avatar className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center shadow-[0_0_12px_rgba(0,117,255,0.4)]">
                                <AvatarFallback className="rounded-lg bg-transparent text-xs text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col text-right">
                                <span className="text-xs font-semibold leading-tight text-white">
                                    {user?.full_name || "المدير"}
                                </span>
                                <span className="text-[10px] text-slate-400 leading-tight" dir="ltr">
                                    {user?.email || "admin@example.com"}
                                </span>
                            </div>
                            <ChevronDown className="size-3.5 text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-xl border border-white/10 bg-[#0b1437]/95 p-2 backdrop-blur-2xl text-slate-200 shadow-2xl">
                        <DropdownMenuLabel className="p-2 font-normal">
                            <div className="flex items-center gap-2.5 text-right">
                                <Avatar className="h-9 w-9 rounded-lg bg-blue-600/20 text-blue-400 font-semibold flex items-center justify-center">
                                    <AvatarFallback className="rounded-lg text-xs">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-right text-xs leading-tight">
                                    <span className="font-semibold text-white">
                                        {user?.full_name || "المدير"}
                                    </span>
                                    <span className="text-[11px] text-slate-400" dir="ltr">
                                        {user?.email || "admin@example.com"}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                            <Link href="/dashboard/account" className="flex items-center gap-2 text-xs">
                                <UserIcon className="size-4 text-blue-400" />
                                <span>ملف الحساب</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                            onClick={() => logout.mutate()}
                            className="text-red-400 focus:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 flex items-center gap-2 text-xs cursor-pointer">
                            <LogOut className="size-4" />
                            <span>تسجيل الخروج</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
