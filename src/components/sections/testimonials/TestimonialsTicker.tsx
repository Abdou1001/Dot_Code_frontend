import type { Testimonial } from "@/types/data";
import type { Locale } from "@/types/enums";
import { TestimonialCard } from "./TestimonialCard";
import { createTickerSets } from "./testimonials.utils";

interface TestimonialsTickerProps {
    testimonials: Testimonial[];
    locale: Locale;
    avatarAlt: string;
}

export function TestimonialsTicker({ testimonials, locale, avatarAlt }: TestimonialsTickerProps) {
    const tickerSets = createTickerSets(testimonials);

    return (
        <div className="testimonials-ticker-viewport" aria-label={locale === "ar" ? "آراء العملاء" : "Client testimonials"}>
            <div className="testimonials-ticker-track">
                {tickerSets.map((testimonialSet, setIndex) => (
                    <div key={setIndex} className="testimonials-ticker-set" aria-hidden={setIndex > 0}>
                        {testimonialSet.map((testimonial) => (
                            <TestimonialCard
                                key={`${setIndex}-${testimonial.id}`}
                                testimonial={testimonial}
                                locale={locale}
                                avatarAlt={avatarAlt}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
