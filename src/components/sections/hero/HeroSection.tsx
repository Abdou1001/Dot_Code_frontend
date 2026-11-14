import { getHeroPortfolioData } from "@/services/portfolio-hero.server";
import { getLocale } from "@/lib/locale";
import { cookies } from "next/headers";
import { HeroContent } from "./HeroContent";

/** Server boundary: public hero data is present in the initial document. */
export async function HeroSection() {
    const [data, cookieStore] = await Promise.all([getHeroPortfolioData(), cookies()]);
    const locale = getLocale(cookieStore.get("dot_code_locale")?.value);

    return (
        <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
            <HeroContent {...data} locale={locale} />
        </section>
    );
}
