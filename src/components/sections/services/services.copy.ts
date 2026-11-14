import type { Locale } from "@/types/enums";

export const servicesCopy = {
    ar: {
        eyebrow: "الخدمات",
        heading: "كيف أقدر أساعدك؟",
        description: "حلول تقنية مصممة لتقديم تجربة واضحة، سريعة، وقابلة للتوسع.",
        empty: "لا توجد خدمات متاحة حالياً.",
    },
    en: {
        eyebrow: "Services",
        heading: "How can I help?",
        description: "Technology solutions built for clear, fast, and scalable experiences.",
        empty: "No services are available at the moment.",
    },
} as const satisfies Record<Locale, {
    eyebrow: string;
    heading: string;
    description: string;
    empty: string;
}>;
