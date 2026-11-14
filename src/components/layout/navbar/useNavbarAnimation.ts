"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/components/providers/LanguageProvider";

/** Entrance animation (runs once on mount with smooth, deterministic sequencing) */
export function useNavbarAnimation(containerRef: RefObject<HTMLElement | null>) {
    const { isRtl } = useLanguage();

    useGSAP(
        () => {
            const container = containerRef.current;
            if (!container) return;

            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const tl = gsap.timeline({
                    defaults: { ease: "power3.out" },
                });

                // 1. Header slide down smoothly from top
                tl.fromTo(
                    container,
                    { yPercent: -100, opacity: 0 },
                    { yPercent: 0, opacity: 1, duration: 0.7 }
                )
                    // 2. Brand mark entrance
                    .fromTo(
                        ".navbar-brand",
                        { opacity: 0, y: -10, scale: 0.96 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.45 },
                        "-=0.35"
                    )
                    // 3. Center navigation pill entrance with subtle float
                    .fromTo(
                        ".navbar-navigation",
                        { opacity: 0, scale: 0.94, y: -6 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.45 },
                        "-=0.3"
                    )
                    // 4. Stagger navigation items in visual reading order
                    .fromTo(
                        ".nav-item",
                        { opacity: 0, y: -6 },
                        {
                            opacity: 1,
                            y: 0,
                            stagger: { each: 0.04, from: isRtl ? "end" : "start" },
                            duration: 0.35,
                        },
                        "-=0.25"
                    )
                    // 5. Action controls (theme, language, contact CTA)
                    .fromTo(
                        ".navbar-action",
                        { opacity: 0, scale: 0.9, y: -4 },
                        {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            stagger: 0.06,
                            duration: 0.35,
                            ease: "back.out(1.2)",
                        },
                        "-=0.25"
                    );
            });

            mm.add("(prefers-reduced-motion: reduce)", () => {
                gsap.fromTo(
                    container,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: "none" }
                );
            });
        },
        { scope: containerRef, dependencies: [isRtl] }
    );
}

/** Scroll-direction visibility: hides smoothly on scroll-down, shows snappy on scroll-up */
export function useNavbarScrollVisibility(
    headerRef: RefObject<HTMLElement | null>,
    isMenuOpen: boolean
) {
    useEffect(() => {
        const element = headerRef.current;
        if (!element || typeof window === "undefined") return;

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let lastScrollY = Math.max(0, window.scrollY);
        let isHidden = false;
        let ticking = false;

        const show = () => {
            if (prefersReduced) {
                gsap.set(element, { yPercent: 0 });
            } else {
                gsap.to(element, {
                    yPercent: 0,
                    duration: 0.38,
                    ease: "power3.out",
                    overwrite: "auto",
                });
            }
            isHidden = false;
        };

        const hide = () => {
            if (prefersReduced) {
                gsap.set(element, { yPercent: -100 });
            } else {
                gsap.to(element, {
                    yPercent: -100,
                    duration: 0.4,
                    ease: "power3.inOut",
                    overwrite: "auto",
                });
            }
            isHidden = true;
        };

        const update = () => {
            const currentY = Math.max(0, window.scrollY);
            const delta = currentY - lastScrollY;

            // When at the very top (or menu open), always keep visible
            if (currentY <= 20 || isMenuOpen) {
                if (isHidden) show();
            } else if (delta > 14 && !isHidden) {
                // Scrolling down past threshold -> hide
                hide();
            } else if (delta < -14 && isHidden) {
                // Scrolling up past threshold -> show
                show();
            }

            // Elevation: add subtle shadow when scrolled past top
            if (currentY > 15) {
                element.classList.add("shadow-xs");
            } else {
                element.classList.remove("shadow-xs");
            }

            lastScrollY = currentY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [headerRef, isMenuOpen]);
}
