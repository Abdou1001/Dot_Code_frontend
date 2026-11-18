import { cookies } from "next/headers";
import { SectionMarquee } from "@/components/shared/SectionMarquee";
import { getLocale } from "@/lib/locale";
import { getActiveServices } from "@/services/portfolio-hero.server";
import { servicesCopy } from "./services.copy";
import { ServicesGrid } from "./ServicesGrid";
import { localizeServices } from "./services.utils";

export async function ServicesSection() {
    const [cookieStore, services] = await Promise.all([cookies(), getActiveServices()]);
    const locale = getLocale(cookieStore.get("dot_code_locale")?.value);
    const content = servicesCopy[locale];
    const localizedServices = localizeServices(services, locale);
    const isRtl = locale === "ar";

    return (
        <section id="services" aria-labelledby="services-title" className="overflow-hidden border-y border-border/70 bg-background">
            <SectionMarquee label="OUR SERVICES" />

            <div dir={isRtl ? "rtl" : "ltr"} className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
                <header className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-semibold text-primary">{content.eyebrow}</p>
                    <h2 id="services-title" className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        {content.heading}
                    </h2>
                    <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{content.description}</p>
                </header>

                <div className="mt-10 lg:mt-14">
                    <ServicesGrid services={localizedServices} emptyMessage={content.empty} />
                </div>
            </div>
        </section>
    );
}
