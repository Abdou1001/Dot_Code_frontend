import type { Locale } from "@/types/enums";

export const heroCopy = {
    ar: {
        welcome: "مرحباً بك في Dot Code",
        greeting: "مرحباً، أنا",
        name: "عبدالرحمن بن سعد",
        description: "أطور تطبيقات ويب حديثة وحلولاً رقمية تحول الأفكار إلى تجارب عملية ومميزة.",
        roles: ["مطور ويب", "مطور Full-Stack", "مطور تطبيقات جوال", "مهندس برمجيات"],
    },
    en: {
        welcome: "WELCOME TO DOT CODE",
        greeting: "Hello, I’m",
        name: "Abdulrahman Bin Saad",
        description: "I build modern web applications and digital solutions that turn ideas into meaningful experiences.",
        roles: ["Web Developer", "Full-Stack Developer", "Mobile Developer", "Software Engineer"],
    },
} as const satisfies Record<Locale, {
    welcome: string;
    greeting: string;
    name: string;
    description: string;
    roles: readonly string[];
}>;
