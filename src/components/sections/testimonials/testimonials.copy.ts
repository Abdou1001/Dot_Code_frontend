import type { Locale } from "@/types/enums";

export const testimonialsCopy = {
    ar: {
        eyebrow: "آراء العملاء",
        heading: "شراكات تُقاس بما تقوله التجربة.",
        description: "كل رأي هنا يوثّق تجربة منشورة لعميل عملنا معه، من الفكرة الأولى حتى النتيجة النهائية.",
        publishedLabel: "رأي منشور",
        empty: "لا توجد آراء منشورة حالياً.",
        avatarAlt: "صورة العميل",
    },
    en: {
        eyebrow: "Client testimonials",
        heading: "Partnerships measured by experience.",
        description: "Every review here documents a published client experience, from the first idea to the finished result.",
        publishedLabel: "published reviews",
        empty: "No testimonials have been published yet.",
        avatarAlt: "Client portrait",
    },
} as const satisfies Record<Locale, {
    eyebrow: string;
    heading: string;
    description: string;
    publishedLabel: string;
    empty: string;
    avatarAlt: string;
}>;
