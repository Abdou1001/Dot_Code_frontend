import Image from "next/image";
import { Quote, Star, UserRound } from "lucide-react";
import type { Testimonial } from "@/types/data";
import type { Locale } from "@/types/enums";

const MAX_RATING = 5;

interface TestimonialCardProps {
    testimonial: Testimonial;
    locale: Locale;
    avatarAlt: string;
}

function getRating(rating?: number): number {
    return Math.max(0, Math.min(MAX_RATING, rating ?? MAX_RATING));
}

export function TestimonialCard({ testimonial, locale, avatarAlt }: TestimonialCardProps) {
    const rating = getRating(testimonial.rating);
    const attribution = [testimonial.client_role, testimonial.company]
        .filter(Boolean)
        .join(locale === "ar" ? "، " : ", ");
    const isRtl = locale === "ar";

    return (
        <article
            dir={isRtl ? "rtl" : "ltr"}
            className="flex min-h-96 flex-col rounded-[1.75rem] border border-[#2563EB]/70 bg-[#111827] p-7 shadow-[0_26px_70px_-38px_rgba(0,0,0,1)] sm:p-8"
        >
            <div className="flex items-center justify-between gap-4">
                <Quote aria-hidden="true" className="size-8 text-[#2563EB]" />
                <div className="flex items-center gap-1" aria-label={`${rating} ${isRtl ? "من" : "out of"} ${MAX_RATING}`}>
                    {Array.from({ length: MAX_RATING }, (_, index) => (
                        <Star
                            key={index}
                            aria-hidden="true"
                            className={`size-4 ${index < rating ? "fill-amber-300 text-amber-300" : "text-slate-700"}`}
                        />
                    ))}
                </div>
            </div>

            <blockquote className="mt-10 flex-1 text-base font-medium leading-8 text-slate-100 sm:text-lg sm:leading-9">
                “{testimonial.testimonial}”
            </blockquote>

            <footer className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
                <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5">
                    {testimonial.client_image_url ? (
                        <Image
                            src={testimonial.client_image_url}
                            alt={`${avatarAlt}: ${testimonial.client_name}`}
                            fill
                            sizes="48px"
                            className="object-cover"
                        />
                    ) : (
                        <UserRound aria-hidden="true" className="size-5 text-slate-400" />
                    )}
                </div>
                <div className="min-w-0">
                    <cite className="block truncate text-sm font-bold not-italic text-white">{testimonial.client_name}</cite>
                    {attribution ? <span className="mt-1 block truncate text-xs text-blue-200">{attribution}</span> : null}
                </div>
            </footer>
        </article>
    );
}
