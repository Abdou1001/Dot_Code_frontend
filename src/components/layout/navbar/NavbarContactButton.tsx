"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { CTA_CONFIG } from "./navbar.config";

interface NavbarContactButtonProps {
    className?: string;
    onClick?: () => void;
}

export function NavbarContactButton({ className = "", onClick }: NavbarContactButtonProps) {
    const { locale, isRtl } = useLanguage();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
            onClick();
        }

        if (typeof window !== "undefined") {
            const targetEl = document.getElementById(CTA_CONFIG.targetSectionId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", `#${CTA_CONFIG.targetSectionId}`);
            }
        }
    };

    return (
        <a
            href={`#${CTA_CONFIG.targetSectionId}`}
            onClick={handleClick}
            className={`navbar-action group inline-flex items-center gap-2 h-9 px-4 rounded-full border border-neutral-200/80 dark:border-white/15 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-sm hover:border-neutral-300 dark:hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black ${className}`}>
            {/* Live green dot — matches Sazzad Ali signature */}
            <span
                aria-hidden="true"
                className="size-2 rounded-full bg-emerald-500 shadow-[0_0_6px_1px_rgba(16,185,129,0.6)] shrink-0"
            />
            <span>{CTA_CONFIG.label[locale]}</span>
            {/* Arrow icon inside a small circle */}
            <span
                aria-hidden="true"
                className="flex items-center justify-center size-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shrink-0 transition-transform duration-200 group-hover:scale-110"
            >
                <ArrowUpRight
                    className={`size-3 ${isRtl ? "rotate-180" : ""}`}
                />
            </span>
        </a>
    );
}

