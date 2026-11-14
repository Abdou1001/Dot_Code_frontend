import { Locale } from "@/types/enums";

export interface NavItem {
    id: string;
    sectionId: string;
    label: Record<Locale, string>;
}

export const NAV_ITEMS: NavItem[] = [
    {
        id: "about",
        sectionId: "about",
        label: {
            ar: "من نحن",
            en: "About",
        },
    },
    {
        id: "services",
        sectionId: "services",
        label: {
            ar: "الخدمات",
            en: "Services",
        },
    },
    {
        id: "projects",
        sectionId: "projects",
        label: {
            ar: "المشاريع",
            en: "Projects",
        },
    },
    {
        id: "skills",
        sectionId: "skills",
        label: {
            ar: "المهارات",
            en: "Skills",
        },
    },
    {
        id: "testimonials",
        sectionId: "testimonials",
        label: {
            ar: "آراء العملاء",
            en: "Testimonials",
        },
    },
    {
        id: "contact",
        sectionId: "contact",
        label: {
            ar: "تواصل معنا",
            en: "Contact",
        },
    },
];

export const BRAND_CONFIG = {
    name: ".CODE",
    dotColor: "#2563EB",
    owner: {
        ar: "عبدالرحمن بن سعد",
        en: "Abdulrahman Bin Saad",
    },
} as const;

export const CTA_CONFIG = {
    label: {
        ar: "دعنا نتحدث",
        en: "Let's Talk",
    },
    targetSectionId: "contact",
} as const;

