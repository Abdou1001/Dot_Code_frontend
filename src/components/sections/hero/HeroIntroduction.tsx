import type { Locale } from "@/types/enums";
import { HeroName } from "./HeroName";
import { HeroTypingText } from "./HeroTypingText";
import { HeroIntroMotion } from "./HeroIntroMotion";
import { heroCopy } from "./hero.copy";

export function HeroIntroduction({ locale }: { locale: Locale }) {
    const content = heroCopy[locale];

    return (
        <HeroIntroMotion>
            <div className="max-w-3xl">
                <p data-hero-intro className="my-5 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-[#2563EB] sm:text-sm">
                    <span aria-hidden="true" className="h-px w-8 bg-current" />
                    {content.welcome}
                </p>
                <p data-hero-intro className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{content.greeting}</p>
                <HeroName name={content.name} />
                <div data-hero-intro className="mt-6 flex items-center gap-2 text-lg font-semibold text-[#2563EB] sm:text-xl">
                    <span className="size-2 rounded-full bg-[#2563EB]" aria-hidden="true" />
                    <span className="sr-only">{content.roles.join(", ")}</span>
                    <HeroTypingText key={locale} phrases={content.roles} />
                </div>
                <p data-hero-intro className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">{content.description}</p>
            </div>
        </HeroIntroMotion>
    );
}
