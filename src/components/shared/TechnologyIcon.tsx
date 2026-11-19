"use client";

import React, {useMemo} from "react";
import * as simpleIcons from "simple-icons";
import type {SimpleIcon} from "simple-icons";
import {Code2} from "lucide-react";
import {cn} from "@/lib/utils";

// 1. Static slug map created once at module load
const slugMap = new Map<string, SimpleIcon>();
for (const key in simpleIcons) {
    const item = (simpleIcons as Record<string, any>)[key];
    if (item && typeof item === "object" && typeof item.slug === "string") {
        slugMap.set(item.slug.toLowerCase(), item as SimpleIcon);
    }
}


/**
 * Resolves a raw technology identifier into its corresponding SimpleIcon object.
 */
export function resolveSimpleIcon(rawIdentifier?: string | null): SimpleIcon | null {
    if (!rawIdentifier) return null;
    const trimmed = rawIdentifier.trim().toLowerCase();
    if (!trimmed) return null;

    // Direct slug match
    const directMatch = slugMap.get(trimmed);
    if (directMatch) return directMatch;

    // Alias match
    const aliasTarget = trimmed;
    if (aliasTarget) {
        const aliasMatch = slugMap.get(aliasTarget);
        if (aliasMatch) return aliasMatch;
    }

    // Strip "si-" or "si_" or "si" prefix
    const stripped = trimmed.replace(/^si[-_]?/, "");
    if (stripped !== trimmed) {
        const strippedMatch = slugMap.get(stripped);
        if (strippedMatch) return strippedMatch;

        const strippedAlias = stripped;
        if (strippedAlias) {
            const strippedAliasMatch = slugMap.get(strippedAlias);
            if (strippedAliasMatch) return strippedAliasMatch;
        }
    }

    return null;
}

/**
 * Ensures icons that are naturally black/dark (e.g. Next.js, GitHub, Vercel)
 * are rendered with high contrast (#F8FAFC) on dark dashboards.
 */
function getSafeBrandColor(hex: string): string {
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return `#${cleanHex}`;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 70 ? "#F8FAFC" : `#${cleanHex}`;
}

export interface TechnologyIconProps extends React.SVGAttributes<SVGElement> {
    icon?: string | null;
    name?: string;
    size?: number | string;
    useBrandColor?: boolean;
    color?: string;
    className?: string;
    fallbackIcon?: React.ReactNode;
}

export const TechnologyIcon = React.memo(function TechnologyIcon({
    icon,
    name,
    size = 20,
    useBrandColor = true,
    color,
    className,
    fallbackIcon,
    ...props
}: TechnologyIconProps) {
    const resolvedIcon = useMemo(() => resolveSimpleIcon(icon), [icon]);

    const isExternalImage = useMemo(() => {
        if (!icon || typeof icon !== "string") return false;
        return icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("/");
    }, [icon]);

    // Dimensions
    const dimension = typeof size === "number" ? `${size}px` : size;

    // 1. External image URL fallback
    if (isExternalImage && icon) {
        return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
                src={icon}
                alt={name || "technology icon"}
                className={cn("object-contain shrink-0 rounded", !useBrandColor && "brightness-0 invert", className)}
                style={{width: dimension, height: dimension}}
            />
        );
    }

    // 2. Simple Icon Resolved
    if (resolvedIcon) {
        const fillColor = color || (useBrandColor ? getSafeBrandColor(resolvedIcon.hex) : (props.fill || "currentColor"));

        return (
            <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className={cn("shrink-0 inline-block transition-transform", className)}
                style={{width: dimension, height: dimension}}
                aria-label={name || resolvedIcon.title}
                {...props}>
                <title>{name || resolvedIcon.title}</title>
                <path d={resolvedIcon.path} fill={fillColor} />
            </svg>
        );
    }

    // 3. Fallback Icon (Code2)
    if (fallbackIcon) {
        return <>{fallbackIcon}</>;
    }

    return (
        <Code2
            className={cn("shrink-0 inline-block", !useBrandColor ? "text-white" : "text-slate-400", className)}
            style={{width: dimension, height: dimension}}
            aria-hidden="true"
        />
    );
});

export default TechnologyIcon;
