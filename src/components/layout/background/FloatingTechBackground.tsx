"use client";

import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Technology } from "@/types/data";
import { TechnologyIcon } from "@/components/shared/TechnologyIcon";

function getSeed(value: string) {
    return Array.from(value).reduce((seed, character) => (seed * 31 + character.charCodeAt(0)) >>> 0, 17);
}

export function FloatingTechBackground({ technologies }: { technologies: Technology[] }) {
    const layerRef = useRef<HTMLDivElement>(null);
    const particles = useMemo(
        () => Array.from({ length: Math.min(technologies.length * 2, 10) }, (_, index) => {
            const technology = technologies[index % technologies.length];
            const seed = getSeed(`${technology.id}-${index}`);
            return {
                id: `${technology.id}-${index}`,
                technology,
                left: 4 + (seed % 92),
                size: 20 + (seed % 18),
                duration: 36 + (seed % 25),
                drift: (seed % 2 === 0 ? 1 : -1) * (10 + (seed % 16)),
                rotation: (seed % 2 === 0 ? 1 : -1) * (3 + (seed % 6)),
            };
        }),
        [technologies]
    );

    useGSAP(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
            const isMobile = window.matchMedia("(max-width: 639px)").matches;
            gsap.utils.toArray<HTMLElement>("[data-floating-tech]").slice(0, isMobile ? 4 : particles.length).forEach((particle, index) => {
                const { duration, drift, rotation } = particles[index];
                gsap.fromTo(particle, { y: "112vh", rotation: -rotation }, {
                    y: "-122vh", rotation, duration,
                    delay: -(index * duration) / particles.length, repeat: -1, ease: "none",
                });
                gsap.to(particle, { x: drift, duration: 10 + index * 1.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
            });
        });
    }, { scope: layerRef, dependencies: [particles] });

    if (!particles.length) return null;

    return (
        <div ref={layerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {particles.map(({ id, technology, left, size }, index) => (
                <div key={id} data-floating-tech style={{ left: `${left}%` }} className={`floating-tech-particle ${index > 3 ? "hidden sm:block" : ""}`}>
                    <TechnologyIcon icon={technology.icon ?? technology.slug} name={technology.name} size={size} useBrandColor={false} />
                </div>
            ))}
        </div>
    );
}
