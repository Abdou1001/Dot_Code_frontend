"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function HeroContactMagnet({ children }: { children: ReactNode }) {
    const areaRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const area = areaRef.current;
        const button = area?.querySelector<HTMLElement>("[data-contact-magnet]");
        if (!area || !button) return;

        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
            const moveX = gsap.quickTo(button, "x", { duration: 0.35, ease: "power3.out" });
            const moveY = gsap.quickTo(button, "y", { duration: 0.35, ease: "power3.out" });
            const handleMove = (event: PointerEvent) => {
                const rect = area.getBoundingClientRect();
                const offsetX = event.clientX - (rect.left + rect.width / 2);
                const offsetY = event.clientY - (rect.top + rect.height / 2);
                if (Math.hypot(offsetX, offsetY) < 120) {
                    moveX(offsetX * 0.16);
                    moveY(offsetY * 0.16);
                }
            };
            const reset = () => {
                moveX(0);
                moveY(0);
            };

            area.addEventListener("pointermove", handleMove);
            area.addEventListener("pointerleave", reset);
            return () => {
                area.removeEventListener("pointermove", handleMove);
                area.removeEventListener("pointerleave", reset);
            };
        });
    }, { scope: areaRef });

    return <div ref={areaRef} className="hero-contact-area">{children}</div>;
}
