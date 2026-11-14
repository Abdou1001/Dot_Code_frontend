"use client";

import React, { useRef, useState } from "react";
import { NavbarBrand } from "./NavbarBrand";
import { NavbarNavigation } from "./NavbarNavigation";
import { NavbarActions } from "./NavbarActions";
import { useNavbarAnimation, useNavbarScrollVisibility } from "./useNavbarAnimation";

interface NavbarProps {
    className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
    const navContainerRef = useRef<HTMLElement>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Entrance animation (once on mount)
    useNavbarAnimation(navContainerRef);

    // Intelligent hide-on-scroll-down / show-on-scroll-up
    useNavbarScrollVisibility(navContainerRef, isMobileMenuOpen);

    return (
        <header
            ref={navContainerRef}
            className={`sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-300 ${className}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
                {/* 1. Left: Brand Identity */}
                <div className="flex-1 flex justify-start">
                    <NavbarBrand />
                </div>

                {/* 2. Center: Navigation Links (Desktop / Tablet) */}
                <div className="flex-initial flex justify-center">
                    <NavbarNavigation />
                </div>

                {/* 3. Right: Action Controls */}
                <div className="flex-1 flex justify-end">
                    <NavbarActions
                        isMobileMenuOpen={isMobileMenuOpen}
                        onMobileMenuChange={setIsMobileMenuOpen}
                    />
                </div>
            </div>
        </header>
    );
}

export default Navbar;

