import type { Locale } from "@/types/enums";
import { HeroStatItem } from "./HeroStatItem";

interface HeroStatisticsProps {
    locale: Locale;
    isRtl: boolean;
    projectsCount: number | null;
    servicesCount: number | null;
    testimonialsCount: number | null;
}

export function HeroStatistics({ locale, isRtl, projectsCount, servicesCount, testimonialsCount }: HeroStatisticsProps) {
    const labels = locale === "ar"
        ? { projects: "المشاريع المنجزة", clients: "عملاء سعداء", services: "الخدمات" }
        : { projects: "Completed projects", clients: "Happy clients", services: "Services" };

    return (
        <div className="hero-statistics">
            <HeroStatItem value={projectsCount} label={labels.projects} isRtl={isRtl} />
            <HeroStatItem value={testimonialsCount} label={labels.clients} />
            <HeroStatItem value={servicesCount} label={labels.services} isRtl={isRtl} />
        </div>
    );
}
