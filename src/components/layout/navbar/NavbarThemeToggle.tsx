"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface NavbarThemeToggleProps {
    className?: string;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function NavbarThemeToggle({ className = "" }: NavbarThemeToggleProps) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { locale } = useLanguage();
    const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const isDark = (resolvedTheme || theme) === "dark";

    const handleToggle = () => {
        setTheme(isDark ? "light" : "dark");
    };

    const label = locale === "ar"
        ? (isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن")
        : (isDark ? "Switch to Light Mode" : "Switch to Dark Mode");

    return (
        <button
            type="button"
            onClick={handleToggle}
            aria-label={label}
            title={label}
            className={`navbar-action relative flex items-center justify-center size-9 rounded-full border border-neutral-200/80 dark:border-white/10 bg-neutral-100/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${className}`}>
            {isMounted ? (
                isDark ? (
                    <Sun className="size-4 transition-transform duration-300 hover:rotate-45" />
                ) : (
                    <Moon className="size-4 transition-transform duration-300 hover:-rotate-12" />
                )
            ) : (
                <span className="size-4 inline-block" aria-hidden="true" />
            )}
        </button>
    );
}
