"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function HeroIntroMotion({ children }: { children: ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.fromTo(
                "[data-hero-intro]",
                { opacity: 0.96, y: 8 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.11, ease: "power3.out", delay: 0.08 }
            );
        });
    }, { scope: containerRef });

    return <div ref={containerRef}>{children}</div>;
}
