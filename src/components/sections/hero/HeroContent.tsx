import type { Locale } from "@/types/enums";
import { HeroActions } from "./HeroActions";
import { HeroIntroduction } from "./HeroIntroduction";
import { HeroStatistics } from "./HeroStatistics";
import { HeroContactMagnet } from "./HeroContactMagnet";
import { ArrowUpRight } from "lucide-react";

interface HeroContentProps {
    projectsCount: number | null;
    servicesCount: number | null;
    testimonialsCount: number | null;
    locale: Locale;
}

export function HeroContent({ projectsCount, servicesCount, testimonialsCount, locale }: HeroContentProps) {
    const isRtl = locale === "ar";
    const contactLabel = locale === "ar" ? "تواصل معي" : "Contact me";

    return (
        <div dir={isRtl ? "rtl" : "ltr"} className="hero-layout">
            <div className="hero-introduction-column">
                <HeroIntroduction locale={locale} />
                <HeroActions locale={locale} />
            </div>
            <div className="hero-side-column">
                <HeroContactMagnet>
                    <a href="#contact" data-contact-magnet className="hero-contact-button group">
                        <ArrowUpRight aria-hidden="true" className="size-7 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
                        <span>{contactLabel}</span>
                    </a>
                </HeroContactMagnet>
                <HeroStatistics locale={locale} isRtl={isRtl} projectsCount={projectsCount} servicesCount={servicesCount} testimonialsCount={testimonialsCount} />
            </div>
        </div>
    );
}
