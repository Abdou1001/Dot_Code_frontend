"use client";

import React from "react";
import { NavbarThemeToggle } from "./NavbarThemeToggle";
import { NavbarLanguageSwitcher } from "./NavbarLanguageSwitcher";
import { NavbarContactButton } from "./NavbarContactButton";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

interface NavbarActionsProps {
    className?: string;
    isMobileMenuOpen: boolean;
    onMobileMenuChange: (open: boolean) => void;
}

export function NavbarActions({ className = "", isMobileMenuOpen, onMobileMenuChange }: NavbarActionsProps) {
    return (
        <div className={`navbar-actions flex items-center gap-2 sm:gap-3 ${className}`}>
            {/* Theme Switcher */}
            <NavbarThemeToggle />

            {/* Language Switcher */}
            <NavbarLanguageSwitcher />

            {/* Contact CTA — desktop & tablet */}
            <div className="hidden sm:block">
                <NavbarContactButton />
            </div>

            {/* Mobile Menu Trigger & Drawer */}
            <NavbarMobileMenu
                isOpen={isMobileMenuOpen}
                onToggle={() => onMobileMenuChange(!isMobileMenuOpen)}
                onClose={() => onMobileMenuChange(false)}
            />
        </div>
    );
}

