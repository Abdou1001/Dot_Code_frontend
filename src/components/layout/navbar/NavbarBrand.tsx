"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { BRAND_CONFIG } from "./navbar.config";
import Image from "next/image";

interface NavbarBrandProps {
    className?: string;
    onClick?: () => void;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function NavbarBrand({ className = "", onClick }: NavbarBrandProps) {
    const { locale } = useLanguage();
    const { resolvedTheme } = useTheme();
    const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
            onClick();
            return;
        }

        if (typeof window !== "undefined") {
            const topEl = document.getElementById("top");
            if (topEl) {
                e.preventDefault();
                topEl.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", "#");
            }
        }
    };

    // Choose correct logo based on active theme — reuse existing public assets
    const logoSrc = isMounted && resolvedTheme === "light"
        ? "/DotCode_Logo.png"
        : "/DotCode_Logo_White.png";

    return (
        <a
            href="#top"
            onClick={handleLogoClick}
            aria-label={`${BRAND_CONFIG.name} - ${BRAND_CONFIG.owner[locale]}`}
            className={`navbar-brand group flex flex-col justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg px-1 transition-opacity hover:opacity-80 opacity-100! ${className}`}
        >
            <div className="flex items-center gap-1.5 leading-none">
                <Image
                    src={logoSrc}
                    alt={BRAND_CONFIG.name}
                    width={80}
                    height={28}
                    priority
                    className="object-contain"
                />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5 tracking-normal">
                {BRAND_CONFIG.owner[locale]}
            </span>
        </a>
    );
    
}

