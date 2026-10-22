"use client";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "../../ui/sidebar";
import {
    BarChart3,
    Code2,
    FolderGit2,
    FolderTree,
    LayoutDashboard,
    Mail,
    MessageSquareQuote,
    User,
    Wrench,
} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const items = [
    {
        label: "نظرة عامة",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "المشاريع",
        href: "/dashboard/projects",
        icon: FolderGit2,
    },
    {
        label: "التصنيفات",
        href: "/dashboard/categories",
        icon: FolderTree,
    },
    {
        label: "التقنيات",
        href: "/dashboard/technologies",
        icon: Code2,
    },
    {
        label: "الخدمات",
        href: "/dashboard/services",
        icon: Wrench,
    },
    {
        label: "آراء العملاء",
        href: "/dashboard/testimonials",
        icon: MessageSquareQuote,
    },
    {
        label: "رسائل التواصل",
        href: "/dashboard/messages",
        icon: Mail,
    },
    {
        label: "التحليلات",
        href: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        label: "الحساب",
        href: "/dashboard/account",
        icon: User,
    },
];

const NavMain = () => {
    const {setOpenMobile} = useSidebar();
    const pathname = usePathname();

    return (
        <SidebarGroup className="overflow-hidden">
            <SidebarMenu className="space-y-1.5 px-2">
                {items.map((item) => {
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);

                    return (
                        <SidebarMenuItem key={item.href} >
                            <SidebarMenuButton
                                asChild
                                tooltip={item.label}
                                isActive={isActive}
                                className={`px-3 py-3 rounded-xl transition-all duration-200 h-10 overflow-hidden scrollbar-none ${
                                    isActive
                                        ? "bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-white font-medium border border-blue-500/30 shadow-[0_0_15px_rgba(0,117,255,0.2)]"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}>
                                <Link
                                    href={item.href}
                                    onClick={() => setOpenMobile(false)}
                                    className="flex items-center gap-3">
                                    <div
                                        className={`flex items-center justify-center size-8 rounded-lg transition-colors  ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(0,117,255,0.5)]"
                                                : "bg-[#0b1437] text-slate-400 group-hover:text-white"
                                        }`}>
                                        <item.icon className="size-4 shrink-0" />
                                    </div>
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
};

export default NavMain;
