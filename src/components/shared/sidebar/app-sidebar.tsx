import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import NavMain from "./navMain";
import { NavUser } from "./nav-user";
import Image from "next/image";

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            className="border-l border-white/10 bg-[#060b26]/95 backdrop-blur-xl text-slate-200"
            side="right">
            <SidebarHeader className="p-4 border-b border-white/10">
                <div className="flex items-center justify-center">
                    <Image src="/DotCode_Logo_White.png" alt="Dot Code Logo" width={100} height={100} className="" />
                </div>
            </SidebarHeader>

            <SidebarContent className="py-3 px-1">
                <NavMain />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 p-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;