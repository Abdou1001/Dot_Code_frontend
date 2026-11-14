import type { Locale } from "@/types/enums";

export function getLocale(value?: string): Locale {
    return value === "en" ? "en" : "ar";
}
