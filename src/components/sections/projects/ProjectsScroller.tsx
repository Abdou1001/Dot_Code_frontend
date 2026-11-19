"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ProjectsScrollerProps {
    children: React.ReactNode;
    count: number;
    currentLabel: string;
    scrollHint: string;
    isRtl: boolean;
}

export function ProjectsScroller({ children, count, currentLabel, scrollHint, isRtl }: ProjectsScrollerProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const currentProjectRef = useRef<HTMLSpanElement>(null);
    const progressRef = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            const section = sectionRef.current;
            const track = trackRef.current;
            const currentProject = currentProjectRef.current;
            const progress = progressRef.current;

            if (!section || !track || !currentProject || !progress || count < 2) return;

            const media = gsap.matchMedia();
            media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
                const getTravelDistance = () => Math.max(0, track.scrollWidth - section.clientWidth);

                return gsap.to(track, {
                    x: () => (isRtl ? getTravelDistance() : -getTravelDistance()),
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => `+=${getTravelDistance()}`,
                        pin: true,
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                        onUpdate: (trigger) => {
                            const projectNumber = Math.min(count, Math.floor(trigger.progress * count) + 1);
                            currentProject.textContent = String(projectNumber).padStart(2, "0");
                            const fillRatio = (1 / count) + trigger.progress * (1 - (1 / count));
                            gsap.set(progress, { scaleX: Math.min(1, Math.max(1 / count, fillRatio)) });
                        },
                    },
                });
            });

            media.add("(prefers-reduced-motion: reduce)", () => {
                gsap.set(progress, { scaleX: 1 });
            });
        },
        { scope: sectionRef, dependencies: [count, isRtl], revertOnUpdate: true }
    );

    return (
        <div ref={sectionRef} className="projects-scroller">
            <div ref={trackRef} className="projects-scroller-track" dir={isRtl ? "rtl" : "ltr"}>
                {children}
            </div>

            <div className="projects-progress z-20" aria-label={`${currentLabel} 1 ${count}`}>
                <span className="font-mono text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5 select-none shrink-0">
                    <span ref={currentProjectRef} className="text-white font-extrabold text-base sm:text-lg">01</span>
                    <span className="text-neutral-500 font-light">/</span>
                    <span className="text-neutral-400 font-semibold">{String(count).padStart(2, "0")}</span>
                </span>
                <span className="projects-progress-line" aria-hidden="true">
                    <span ref={progressRef} style={{ transform: `scaleX(${1 / count})` }} />
                </span>
                <span className="hidden text-xs sm:text-sm font-semibold tracking-wider text-neutral-400 sm:inline-flex items-center gap-2 select-none shrink-0">
                    <span>{scrollHint}</span>
                    <span className={cn("inline-block text-primary text-base font-bold transition-transform", isRtl ? "rotate-180" : "")}>
                        →
                    </span>
                </span>
            </div>
        </div>
    );
}
