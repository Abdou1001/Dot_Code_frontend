"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroStatCounter({ value, isRtl, children }: { value: number | null; isRtl: boolean; children: ReactNode }) {
    const counterRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        const counterElement = counterRef.current?.querySelector<HTMLElement>("[data-counter-value]");
        if (value === null || !counterElement) return;

        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
            const counter = { number: 0 };
            gsap.to(counter, {
                number: value,
                duration: 1.25,
                ease: "power2.out",
                scrollTrigger: { trigger: counterRef.current, start: "top 88%", once: true },
                onUpdate: () => {
                    counterElement.textContent = Math.round(counter.number).toLocaleString(isRtl ? "ar-SA" : "en-US");
                },
            });
        });
    }, { scope: counterRef, dependencies: [value, isRtl] });

    return <span ref={counterRef}>{children}</span>;
}
