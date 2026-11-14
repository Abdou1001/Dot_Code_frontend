"use client";

import React, { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { NAV_ITEMS } from "./navbar.config";
import { NavbarContactButton } from "./NavbarContactButton";

interface NavbarMobileMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}

export function NavbarMobileMenu({ isOpen, onToggle, onClose }: NavbarMobileMenuProps) {
    const { locale } = useLanguage();
    const menuRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Prevent body scroll when open & handle Escape key
    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // GSAP animation for mobile menu open
    useGSAP(
        () => {
            if (!menuRef.current) return;

            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                if (isOpen) {
                    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

                    tl.fromTo(
                        backdropRef.current,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.3 }
                    )
                        .fromTo(
                            contentRef.current,
                            { opacity: 0, y: -20, scale: 0.98 },
                            { opacity: 1, y: 0, scale: 1, duration: 0.35 },
                            "-=0.2"
                        )
                        .fromTo(
                            ".mobile-nav-link",
                            { opacity: 0, x: locale === "ar" ? 15 : -15 },
                            {
                                opacity: 1,
                                x: 0,
                                stagger: 0.04,
                                duration: 0.3,
                                ease: "power2.out",
                            },
                            "-=0.2"
                        );
                }
            });

            mm.add("(prefers-reduced-motion: reduce)", () => {
                if (isOpen) {
                    gsap.fromTo(
                        [backdropRef.current, contentRef.current],
                        { opacity: 0 },
                        { opacity: 1, duration: 0.2, ease: "none" }
                    );
                }
            });
        },
        { scope: menuRef, dependencies: [isOpen, locale] }
    );

    const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        onClose();

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
        <div ref={menuRef} className="md:hidden">
            {/* Hamburger Trigger Button */}
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation-drawer"
                aria-label={
                    isOpen
                        ? locale === "ar"
                            ? "إغلاق القائمة"
                            : "Close Menu"
                        : locale === "ar"
                        ? "فتح القائمة"
                        : "Open Menu"
                }
                className="navbar-action relative flex items-center justify-center size-9 rounded-full border border-neutral-200/80 dark:border-white/10 bg-neutral-100/80 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div
                    id="mobile-navigation-drawer"
                    role="dialog"
                    aria-modal="true"
                    aria-label={locale === "ar" ? "قائمة التنقل للجوال" : "Mobile Navigation"}
                    className="fixed inset-0 top-16 z-50 flex flex-col">
                    {/* Backdrop */}
                    <div
                        ref={backdropRef}
                        onClick={onClose}
                        className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Content Panel */}
                    <div
                        ref={contentRef}
                        className="relative z-10 w-full max-w-md mx-auto p-6 bg-white dark:bg-neutral-950 border-b border-neutral-200/80 dark:border-white/10 shadow-2xl rounded-b-2xl">
                        <nav aria-label={locale === "ar" ? "روابط الجوال" : "Mobile Links"}>
                            <ul className="flex flex-col space-y-1">
                                {NAV_ITEMS.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.sectionId}`}
                                            onClick={(e) => handleItemClick(e, item.sectionId)}
                                            className="mobile-nav-link flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-neutral-800 dark:text-neutral-200 hover:text-[#2563EB] dark:hover:text-[#2563EB] hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                                            <span>{item.label[locale]}</span>
                                            <span className="text-xs text-neutral-400 font-mono">
                                                #{item.sectionId}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Mobile CTA */}
                        <div className="mt-6 pt-5 border-t border-neutral-200/80 dark:border-white/10 flex justify-center">
                            <NavbarContactButton
                                className="w-full justify-center h-11 text-sm"
                                onClick={onClose}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

