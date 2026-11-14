"use client";

import { useRef, useMemo, Fragment } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ABOUT_HIGHLIGHT_TERMS } from "./about.copy";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Token {
    type: "word" | "highlight";
    text: string;
    prefix?: string;
    punctuation?: string;
}

/**
 * Splits paragraph text into animateable tokens while preserving language typography.
 * In Arabic:
 * - Conjunction 'و' is bound to the following word or highlight term to avoid orphan letter flickers.
 * - Cursive font shaping is kept 100% intact.
 * - Trailing punctuation (Arabic comma '،', period, etc.) is anchored to its preceding word.
 */
function tokenizeParagraph(text: string, highlightTerms: readonly string[]): { tokens: Token[]; isArabic: boolean } {
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const escapedTerms = highlightTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = new RegExp(`(${escapedTerms.join("|")})`, "g");

    const rawParts = text.split(pattern);
    const tokens: Token[] = [];

    for (let i = 0; i < rawParts.length; i++) {
        const part = rawParts[i];
        if (!part) continue;

        if (highlightTerms.includes(part)) {
            let prefix = "";
            // In Arabic, if preceding word was a standalone 'و' conjunction, merge it so it doesn't flicker alone
            if (isArabic && tokens.length > 0) {
                const lastToken = tokens[tokens.length - 1];
                if (lastToken.type === "word" && lastToken.text === "و") {
                    tokens.pop();
                    prefix = "و ";
                }
            }

            let punctuation = "";
            // Anchor punctuation that immediately follows the term (e.g. '،' or '.')
            if (i + 1 < rawParts.length && /^([،,.:;!?])/.test(rawParts[i + 1])) {
                punctuation = rawParts[i + 1].charAt(0);
                rawParts[i + 1] = rawParts[i + 1].slice(1);
            }

            tokens.push({
                type: "highlight",
                prefix,
                text: part,
                punctuation,
            });
        } else {
            const words = part.split(/\s+/).filter(Boolean);
            for (let w = 0; w < words.length; w++) {
                const word = words[w];
                // In Arabic, if word is 'و' followed by another plain word, bind them together
                if (isArabic && word === "و" && w + 1 < words.length) {
                    tokens.push({
                        type: "word",
                        text: `و ${words[w + 1]}`,
                    });
                    w++;
                } else {
                    tokens.push({
                        type: "word",
                        text: word,
                    });
                }
            }
        }
    }

    return { tokens, isArabic };
}

interface AboutTextHighlightProps {
    paragraphs: readonly string[];
    highlightTerms?: readonly string[];
    className?: string;
}

export function AboutTextHighlight({
    paragraphs,
    highlightTerms = ABOUT_HIGHLIGHT_TERMS,
    className = "",
}: AboutTextHighlightProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Tokenize text cleanly on input changes with language detection
    const parsedParagraphs = useMemo(
        () => paragraphs.map((paragraph) => tokenizeParagraph(paragraph, highlightTerms)),
        [paragraphs, highlightTerms]
    );

    useGSAP(
        () => {
            if (!containerRef.current) return;

            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const paragraphElements = containerRef.current?.querySelectorAll<HTMLElement>("[data-about-paragraph]");
                if (!paragraphElements?.length) return;

                paragraphElements.forEach((paragraphEl, index) => {
                    const words = paragraphEl.querySelectorAll<HTMLElement>(".about-word");
                    if (!words.length) return;

                    const isArabic = parsedParagraphs[index]?.isArabic ?? false;

                    // Language-optimized animation calibration:
                    // Arabic: higher initial opacity (0.32) preserves thin cursive ligatures;
                    // slightly adjusted stagger (0.04) and duration (0.35) match Arabic reading pace.
                    // English: keeps the existing baseline (0.22, stagger 0.03) unchanged as preferred.
                    const initialOpacity = isArabic ? 0.32 : 0.22;
                    const staggerSpeed = isArabic ? 0.04 : 0.03;
                    const tweenDuration = isArabic ? 0.35 : 0.5;
                    const startPosition = isArabic ? "top 85%" : "top 82%";
                    const endPosition = isArabic ? "bottom 50%" : "bottom 55%";

                    gsap.fromTo(
                        words,
                        {
                            opacity: initialOpacity,
                        },
                        {
                            opacity: 1,
                            duration: tweenDuration,
                            ease: "none",
                            stagger: staggerSpeed,
                            scrollTrigger: {
                                trigger: paragraphEl,
                                start: startPosition,
                                end: endPosition,
                                scrub: 0.5,
                            },
                        }
                    );
                });
            });

            mm.add("(prefers-reduced-motion: reduce)", () => {
                const words = containerRef.current?.querySelectorAll<HTMLElement>(".about-word");
                if (words?.length) {
                    gsap.set(words, { opacity: 1 });
                }
            });
        },
        { scope: containerRef, dependencies: [paragraphs, parsedParagraphs] }
    );

    return (
        <div
            ref={containerRef}
            data-about-paragraphs-wrapper
            className={`mt-8 space-y-5 ${className}`}
        >
            {paragraphs.map((paragraph, pIndex) => {
                const { tokens, isArabic } = parsedParagraphs[pIndex] ?? { tokens: [], isArabic: false };

                return (
                    <p
                        key={pIndex}
                        data-about-paragraph
                        aria-label={paragraph}
                        className={`text-base leading-[1.9] text-foreground sm:text-lg ${
                            isArabic ? "font-normal tracking-normal" : ""
                        }`}
                    >
                        <span aria-hidden="true" className="inline">
                            {tokens.map((token, tIndex) => (
                                <Fragment key={tIndex}>
                                    <span
                                        className={
                                            token.type === "highlight"
                                                ? "about-word about-term inline font-semibold text-[#2563EB] dark:text-blue-400 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-300 will-change-[opacity]"
                                                : "about-word inline will-change-[opacity]"
                                        }
                                    >
                                        {token.type === "highlight" ? (
                                            <>
                                                {token.prefix && (
                                                    <span className="font-normal text-foreground">
                                                        {token.prefix}
                                                    </span>
                                                )}
                                                <bdi dir="ltr" className="inline-block">
                                                    {token.text}
                                                </bdi>
                                                {token.punctuation && (
                                                    <span className="font-normal text-foreground">
                                                        {token.punctuation}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            token.text
                                        )}
                                    </span>
                                    {tIndex < tokens.length - 1 && " "}
                                </Fragment>
                            ))}
                        </span>
                    </p>
                );
            })}
        </div>
    );
}
