"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { NAV_ITEMS } from "./navbar.config";

interface NavbarNavigationProps {
    className?: string;
    onItemClick?: () => void;
}

/** Renders a single nav link with the signature character-roll hover effect */
function NavLink({
    label,
    badge,
    href,
    isActive = false,
    onClick,
    isRtl,
}: {
    label: string;
    badge: string;
    href: string;
    isActive?: boolean;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    isRtl: boolean;
}) {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // Arabic = cursive connected script → keep words intact; Latin = per-character roll
    const isArabicScript = isRtl || /[\u0600-\u06FF]/.test(label);
    const segments = isArabicScript ? label.split(" ") : Array.from(label);

    const { contextSafe } = useGSAP({ scope: linkRef });

    useGSAP(
        () => {
            const origEls = linkRef.current?.querySelectorAll(".ch-orig");
            const cloneEls = linkRef.current?.querySelectorAll(".ch-clone");
            if (!origEls || !cloneEls || origEls.length === 0) return;

            // Prepare starting positions: clone is below and hidden, original is at baseline
            gsap.set(cloneEls, { yPercent: 100, opacity: 0 });
            gsap.set(origEls, { yPercent: 0, opacity: 1 });

            const tl = gsap.timeline({
                paused: true,
                defaults: { duration: 0.35, ease: "power3.inOut" },
            });

            const staggerTime = isArabicScript ? 0.045 : 0.018;

            tl.to(origEls, {
                yPercent: -100,
                opacity: 0,
                stagger: staggerTime,
            }).to(
                cloneEls,
                {
                    yPercent: 0,
                    opacity: 1,
                    stagger: staggerTime,
                },
                0
            );

            timelineRef.current = tl;
        },
        { scope: linkRef, dependencies: [label, isArabicScript], revertOnUpdate: true }
    );

    const handleMouseEnter = contextSafe(() => timelineRef.current?.play());
    const handleMouseLeave = contextSafe(() => timelineRef.current?.reverse());

    return (
        <a
            ref={linkRef}
            href={href}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className={`nav-link group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] transition-all duration-200 ${
                isActive
                    ? "bg-white dark:bg-white/15 text-neutral-950 dark:text-white font-semibold shadow-xs"
                    : ""
            }`}
        >
            {/* Clipping container keeps stable width; overflow-hidden clips rolling chars */}
            <span aria-hidden="true" className="relative inline-flex overflow-hidden leading-tight py-[1px]">
                {/* Layer 1: exiting original */}
                <span className="inline-flex">
                    {segments.map((seg, i) => (
                        <span
                            key={`o${i}`}
                            className={`ch-orig inline-block will-change-transform ${isArabicScript ? "mx-[0.12em] first:mr-0 last:ml-0" : ""}`}
                        >
                            {seg === " " ? "\u00A0" : seg}
                        </span>
                    ))}
                </span>

                {/* Layer 2: entering clone */}
                <span className="absolute inset-0 inline-flex pointer-events-none">
                    {segments.map((seg, i) => (
                        <span
                            key={`c${i}`}
                            className={`ch-clone inline-block will-change-transform ${isArabicScript ? "mx-[0.12em] first:mr-0 last:ml-0" : ""}`}
                        >
                            {seg === " " ? "\u00A0" : seg}
                        </span>
                    ))}
                </span>
            </span>

            {/* Superscript index — e.g. 01 */}
            <sup
                aria-hidden="true"
                className="text-[9px] font-mono leading-none text-neutral-400 dark:text-neutral-500 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors duration-200 -mt-2"
            >
                {badge}
            </sup>
        </a>
    );
}

export function NavbarNavigation({ className = "", onItemClick }: NavbarNavigationProps) {
    const { locale, isRtl } = useLanguage();
    const [activeSection, setActiveSection] = useState<string>("about");

    useEffect(() => {
        if (typeof window === "undefined") return;

        const sectionIds = NAV_ITEMS.map((item) => item.sectionId);

        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "");
            if (hash && sectionIds.includes(hash)) setActiveSection(hash);
        };

        window.addEventListener("hashchange", handleHashChange);

        const existingSections = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (existingSections.length === 0) {
            return () => window.removeEventListener("hashchange", handleHashChange);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
        );

        existingSections.forEach((section) => observer.observe(section));

        return () => {
            observer.disconnect();
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        setActiveSection(sectionId);
        if (onItemClick) onItemClick();

        if (typeof window !== "undefined") {
            const targetEl = document.getElementById(sectionId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", `#${sectionId}`);
            }
        }
    };

    return (
        <nav
            aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main Navigation"}
            className={`navbar-navigation hidden md:flex items-center ${className}`}
        >
            <ul className="nav-pill">
                {NAV_ITEMS.map((item, index) => {
                    const isActive = activeSection === item.sectionId;
                    return (
                        <li key={item.id} className="nav-item">
                            <NavLink
                                label={item.label[locale]}
                                badge={String(index + 1).padStart(2, "0")}
                                href={`#${item.sectionId}`}
                                isActive={isActive}
                                isRtl={isRtl}
                                onClick={(e) => handleLinkClick(e, item.sectionId)}
                            />
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
