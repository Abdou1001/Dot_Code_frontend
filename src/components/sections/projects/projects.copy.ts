import type { Locale } from "@/types/enums";

export const projectsCopy = {
    ar: {
        eyebrow: "الأعمال",
        heading: "مشاريع تحوّل الفكرة إلى تجربة عملية.",
        description: "مجموعة مختارة من المنتجات والتجارب الرقمية التي تم تنفيذها بعناية.",
        github: "GitHub",
        live: "الموقع",
        progressLabel: "المشروع",
        scrollHint: "مرر لاستكشاف الأعمال",
        empty: "لا توجد أعمال منشورة حالياً.",
        view: "عرض",
        imageFallback: "لا تتوفر صورة للمشروع",
    },
    en: {
        eyebrow: "Selected work",
        heading: "Projects that turn ideas into useful experiences.",
        description: "A selected collection of digital products and experiences built with care.",
        github: "GitHub",
        live: "Live site",
        progressLabel: "Project",
        scrollHint: "Scroll to explore projects",
        empty: "No published projects are available at the moment.",
        view: "View",
        imageFallback: "No project image available",
    },
} as const satisfies Record<Locale, {
    eyebrow: string;
    heading: string;
    description: string;
    github: string;
    live: string;
    progressLabel: string;
    scrollHint: string;
    empty: string;
    view: string;
    imageFallback: string;
}>;
