"use client";

import React, { createContext, useContext, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/types/enums";

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
    isRtl: boolean;
}

const STORAGE_KEY = "dot_code_locale";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
    listeners.add(callback);
    return () => {
        listeners.delete(callback);
    };
}

function getSnapshot(): Locale {
    if (typeof document === "undefined") return "ar";
    const saved = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(`${STORAGE_KEY}=`))
        ?.split("=")[1];
    if (saved === "ar" || saved === "en") return saved;
    return "ar";
}

export function LanguageProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
    const router = useRouter();
    const locale = useSyncExternalStore(subscribe, getSnapshot, () => initialLocale);

    const setLocale = useCallback((newLocale: Locale) => {
        document.cookie = `${STORAGE_KEY}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

        document.documentElement.lang = newLocale;
        document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";

        listeners.forEach((listener) => listener());
        router.refresh();
    }, [router]);

    const toggleLocale = useCallback(() => {
        setLocale(locale === "ar" ? "en" : "ar");
    }, [locale, setLocale]);

    const isRtl = locale === "ar";

    return (
        <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, isRtl }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
