import type { Locale } from "@/types/enums";

export interface AboutCopy {
    readonly eyebrow: string;
    readonly heading: string;
    readonly lead: string;
    readonly paragraphs: readonly string[];
    readonly specialtiesLabel: string;
}

export const ABOUT_HIGHLIGHT_TERMS = [
    "ASP.NET Core",
    "Next.js",
    "Express.js",
    "TypeScript",
    "PostgreSQL",
    "Full-Stack",
    "Supabase",
    "Node.js",
    "React",
    "API",
] as const;

export const aboutCopy = {
    ar: {
        eyebrow: "من أنا",
        heading: "مرحباً، أنا عبدالرحمن بن سعد.",
        lead: "مطور برمجيات ومطور Full-Stack من المكلا، حضرموت، اليمن.",
        paragraphs: [
            "أعمل على تصميم وتطوير تطبيقات الويب الحديثة والحلول البرمجية المتكاملة، وأهتم بتحويل الأفكار والاحتياجات إلى منتجات رقمية عملية، تجمع بين جودة التصميم وقوة البرمجة وسهولة الاستخدام.",
            "أمتلك خبرة عملية في بناء واجهات المستخدم باستخدام React وNext.js وTypeScript، وتطوير الأنظمة الخلفية وواجهات API باستخدام Node.js وExpress.js وASP.NET Core، والعمل مع قواعد البيانات مثل PostgreSQL وSupabase.",
            "عملت على تطوير مشاريع متنوعة تشمل أنظمة إدارة المستشفيات والعيادات، ومنصات الويب، وتطبيقات الجوال، وأنظمة إدارة البيانات والعقارات، مع الاهتمام بهندسة البرمجيات، وتنظيم قواعد البيانات، والأداء، وقابلية التوسع والصيانة.",
            "أؤمن أن البرمجة ليست مجرد كتابة أكواد، بل هي القدرة على فهم المشكلة وبناء حل رقمي واضح وفعّال يحقق قيمة حقيقية.",
        ],
        specialtiesLabel: "التخصصات التقنية",
    },
    en: {
        eyebrow: "ABOUT ME",
        heading: "Hello, I'm Abdulrahman Bin Saad.",
        lead: "I'm a Full-Stack Developer based in Mukalla, Hadhramaut, Yemen.",
        paragraphs: [
            "I specialize in building modern web applications and integrated software solutions, turning ideas and business requirements into practical digital products with a focus on performance, usability, and maintainability.",
            "My technical experience includes frontend development with React, Next.js, and TypeScript, backend development with Node.js, Express.js, and ASP.NET Core, and database management using PostgreSQL and Supabase.",
            "I have worked on a variety of projects, including hospital and clinic management systems, web platforms, mobile applications, real estate solutions, and data management systems. I enjoy working across the full software development lifecycle, from database design and API development to building responsive user interfaces and delivering complete applications.",
            "I believe great software is not just about writing code; it is about understanding problems and engineering reliable solutions that create real value.",
        ],
        specialtiesLabel: "Technical Specialties",
    },
} as const satisfies Record<Locale, AboutCopy>;
