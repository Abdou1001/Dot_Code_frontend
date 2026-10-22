"use client";

import {ChevronsUpDown, LogOut, User} from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {useAuth} from "@/hooks/auth/useAuth";
import {useLogout} from "@/hooks/auth/useLogout";
import Link from "next/link";

export function NavUser() {
    const {isMobile} = useSidebar();
    const {user} = useAuth();
    const logout = useLogout();

    const initials = user?.full_name
        ? user.full_name.substring(0, 2).toUpperCase()
        : "DC";

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Avatar className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-500 font-semibold flex items-center justify-center">
                                <AvatarFallback className="rounded-lg">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-right text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user?.full_name || "المدير"}
                                </span>
                                <span className="truncate text-xs text-muted-foreground" dir="ltr">
                                    {user?.email || "admin@example.com"}
                                </span>
                            </div>
                            <ChevronsUpDown className="mr-auto size-4 text-muted-foreground" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border border-white/10 bg-[#0b1437]/95 p-2 backdrop-blur-2xl text-slate-200 shadow-2xl"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}>
                        <DropdownMenuLabel className="p-2 font-normal">
                            <div className="flex items-center gap-2 text-right text-sm">
                                <Avatar className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-500 font-semibold flex items-center justify-center">
                                    <AvatarFallback className="rounded-lg">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-right text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user?.full_name || "المدير"}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground" dir="ltr">
                                        {user?.email || "admin@example.com"}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild className="justify-start gap-2 cursor-pointer">
                                <Link href="/dashboard/account">
                                    <User className="size-4" />
                                    <span>الحساب</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-500 focus:text-red-500 justify-start gap-2 cursor-pointer"
                            onClick={() => {
                                logout.mutate();
                            }}>
                            <LogOut className="size-4 text-red-500" />
                            <span>تسجيل الخروج</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
