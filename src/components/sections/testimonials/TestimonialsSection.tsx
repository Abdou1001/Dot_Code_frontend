import { cookies } from "next/headers";
import { getLocale } from "@/lib/locale";
import { getPublishedTestimonials } from "@/services/portfolio-hero.server";
import { testimonialsCopy } from "./testimonials.copy";
import { TestimonialsTicker } from "./TestimonialsTicker";
import { filterTestimonialsByLocale } from "./testimonials.utils";

export async function TestimonialsSection() {
    const [cookieStore, testimonials] = await Promise.all([cookies(), getPublishedTestimonials(100)]);
    const locale = getLocale(cookieStore.get("dot_code_locale")?.value);
    const content = testimonialsCopy[locale];
    const localizedTestimonials = filterTestimonialsByLocale(testimonials, locale);
    const isRtl = locale === "ar";

    return (
        <section
            id="testimonials"
            aria-labelledby="testimonials-title"
            className="relative overflow-hidden border-y border-white/5 py-16 text-white sm:py-24 lg:py-28"
        >
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2563EB]/80 to-transparent" />
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-24">
                    <div className="order-2 lg:order-1">
                        {localizedTestimonials.length > 0 ? (
                            <TestimonialsTicker testimonials={localizedTestimonials} locale={locale} avatarAlt={content.avatarAlt} />
                        ) : (
                            <p dir={isRtl ? "rtl" : "ltr"} className="rounded-[1.75rem] border border-dashed border-white/15 p-8 text-base leading-7 text-slate-300">
                                {content.empty}
                            </p>
                        )}
                    </div>

                    <div dir={isRtl ? "rtl" : "ltr"} className="order-1 flex min-h-96 flex-col justify-center lg:order-2 lg:border-s lg:border-white/10 lg:ps-12 xl:ps-16">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300">
                            <span aria-hidden="true" className="size-2 rounded-full bg-[#2563EB]" />
                            <span>{content.eyebrow}</span>
                        </div>
                        <h2 id="testimonials-title" className="mt-5 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            {content.heading}
                        </h2>
                        <p className="mt-7 max-w-xl text-lg leading-9 text-slate-300 sm:text-xl">
                            {content.description}
                        </p>
                        <div className="mt-10 flex items-center gap-3 text-sm text-slate-400">
                            <span>{localizedTestimonials.length.toLocaleString(isRtl ? "ar-SA" : "en-US")}</span>
                            <span>{content.publishedLabel}</span>
                            <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
