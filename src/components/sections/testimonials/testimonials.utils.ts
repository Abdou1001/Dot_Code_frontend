import type { Testimonial } from "@/types/data";
import type { Locale } from "@/types/enums";

const ARABIC_CHARACTER_PATTERN = /[\u0600-\u06FF]/;
const TICKER_REPETITIONS = 4;

export function filterTestimonialsByLocale(testimonials: Testimonial[], locale: Locale): Testimonial[] {
    return testimonials.filter(({ testimonial }) => {
        const isArabic = ARABIC_CHARACTER_PATTERN.test(testimonial);
        return locale === "ar" ? isArabic : !isArabic;
    });
}

export function createTickerSets(testimonials: Testimonial[]): Testimonial[][] {
    return Array.from({ length: TICKER_REPETITIONS }, () => testimonials);
}
