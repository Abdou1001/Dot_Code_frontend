import { cookies } from "next/headers";
import { MapPin } from "lucide-react";
import { getLocale } from "@/lib/locale";
import { getActiveCategories } from "@/services/portfolio-hero.server";
import { aboutCopy } from "./about.copy";
import { AboutMarquee } from "./AboutMarquee";
import { AboutNarrativeMotion } from "./AboutNarrativeMotion";
import { AboutTextHighlight } from "./AboutTextHighlight";

export async function AboutSection() {
    const [cookieStore, categories] = await Promise.all([cookies(), getActiveCategories()]);
    const locale = getLocale(cookieStore.get("dot_code_locale")?.value);
    const content = aboutCopy[locale];
    const isRtl = locale === "ar";

    return (
        <section
            id="about"
            aria-labelledby="about-title"
            className="relative w-full overflow-hidden border-y border-border/70 bg-background/65"
        >
            <AboutMarquee />

            <div dir={isRtl ? "rtl" : "ltr"} className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
                <AboutNarrativeMotion>
                    <div className="mx-auto max-w-4xl">
                        {/* 1. Small Section Label */}
                        <div
                            data-about-header
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB] dark:text-blue-400"
                        >
                            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2563EB]" />
                            <span>{content.eyebrow}</span>
                        </div>

                        {/* 2. Section Heading (H2) */}
                        <h2
                            id="about-title"
                            data-about-header
                            className="mt-4 text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl lg:text-4xl"
                        >
                            {content.heading}
                        </h2>

                        {/* 3. Role & Location Lead */}
                        <p
                            data-about-header
                            className="mt-3 flex items-center gap-2 text-base font-medium text-foreground/90 sm:text-lg"
                        >
                            <MapPin className="size-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
                            <span>{content.lead}</span>
                        </p>

                        {/* 4. Professional Description Paragraphs with GSAP Scroll Highlight */}
                        <AboutTextHighlight paragraphs={content.paragraphs} />

                        {/* 5. Technical Specialties */}
                        <div className="mt-10 border-t border-border/60 pt-8">
                            <p
                                data-about-specialty
                                className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                {content.specialtiesLabel}
                            </p>
                            <ul className="flex flex-wrap gap-2.5" aria-label={content.specialtiesLabel}>
                                {categories.map((category) => {
                                    const specialty = locale === "ar" ? category.name_ar || category.name : category.name;

                                    return (
                                        <li
                                            key={category.id}
                                            data-about-specialty
                                            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-3.5 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-xs sm:text-sm"
                                        >
                                            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2563EB]" />
                                            <span>{specialty}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </AboutNarrativeMotion>
            </div>
        </section>
    );
}
