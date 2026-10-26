"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar";
import NavMain from "./navMain";
import { NavUser } from "./nav-user";
import Image from "next/image";
import Link from "next/link";

export function AppSidebar() {
    const { state } = useSidebar();

    return (
        <Sidebar
            collapsible="icon"
            className="border-l border-white/10 bg-[#060b26]/95 backdrop-blur-xl text-slate-200"
            side="right">
            <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2 border-b border-white/10 flex items-center justify-center min-h-[64px] transition-all duration-200">
                <Link
                    href="/dashboard"
                    className="flex items-center justify-center transition-all duration-200 group/brand"
                    title="Dot Code Portfolio">
                    {/* Full logo when sidebar is expanded */}
                    <div className="group-data-[collapsible=icon]:hidden flex items-center justify-center px-2 py-1">
                        <Image
                            src="/DotCode_Logo_White.png"
                            alt="Dot Code Logo"
                            width={130}
                            height={40}
                            className="h-8 w-auto object-contain transition-transform duration-200 group-hover/brand:scale-105"
                            priority
                        />
                    </div>

                    {/* Prominent, enlarged brand logo mark when sidebar is collapsed */}
                    <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
                        <div className="relative size-10 rounded-xl bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-blue-500/10 border border-blue-500/40 flex items-center justify-center shadow-[0_0_18px_rgba(0,117,255,0.45)] group-hover/brand:border-blue-400 group-hover/brand:scale-110 transition-all duration-200">
                            {/* Ambient glow */}
                            <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-sm pointer-events-none" />
                            {/* Dot Code Identity: Official Blue Dot + CODE */}
                            <div className="relative flex items-center justify-center gap-1">
                                <Image
                                    src="/DotCode_Icon.png"
                                    alt="Dot Code"
                                    width={16}
                                    height={16}
                                    className="size-3.5 rounded-full shadow-[0_0_8px_rgba(0,117,255,0.9)] object-contain"
                                />
                                <span className="text-[11px] font-black tracking-tight text-white select-none">
                                    CODE
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="py-3">
                <NavMain />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 p-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;