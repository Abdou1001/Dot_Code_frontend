"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Coordinates a subtle, scroll-triggered entrance for the About section.
 * Uses transform-based GSAP tweens without hiding SSR content prior to hydration.
 */
export function AboutNarrativeMotion({ children }: { children: ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const tl = gsap.timeline({
                    defaults: { ease: "power3.out", clearProps: "transform,opacity" },
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 82%",
                        toggleActions: "play none none none",
                    },
                });

                tl.from("[data-about-header]", {
                    y: 18,
                    opacity: 0.25,
                    duration: 0.55,
                    stagger: 0.06,
                })
                    .from(
                        "[data-about-paragraphs-wrapper], [data-about-paragraph]",
                        {
                            y: 16,
                            duration: 0.5,
                        },
                        "-=0.3"
                    )
                    .from(
                        "[data-about-specialty]",
                        {
                            y: 10,
                            opacity: 0.25,
                            duration: 0.4,
                            stagger: 0.04,
                        },
                        "-=0.25"
                    );
            });
        },
        { scope: containerRef }
    );

    return <div ref={containerRef}>{children}</div>;
}
