"use client";

import React from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface NavbarLanguageSwitcherProps {
    className?: string;
}

export function NavbarLanguageSwitcher({ className = "" }: NavbarLanguageSwitcherProps) {
    const { locale, toggleLocale } = useLanguage();

    const buttonText = locale === "ar" ? "EN" : "ع";
    const ariaLabel = locale === "ar" ? "التغيير إلى اللغة الإنجليزية" : "Switch to Arabic language";

    return (
        <button
            type="button"
            onClick={toggleLocale}
            aria-label={ariaLabel}
            title={ariaLabel}
            className={`navbar-action relative flex items-center justify-center h-9 px-3 rounded-full border border-neutral-200/80 dark:border-white/10 bg-neutral-100/80 dark:bg-neutral-900/80 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-[#2563EB] dark:hover:text-[#2563EB] hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${className}`}>
            <span>{buttonText}</span>
        </button>
    );
}
