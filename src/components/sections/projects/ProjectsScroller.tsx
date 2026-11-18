"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
                            gsap.set(progress, { scaleX: trigger.progress });
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

            <div className="projects-progress" aria-label={`${currentLabel} 1 ${count}`}>
                <span className="font-mono text-sm font-semibold text-foreground">
                    <span ref={currentProjectRef}>01</span>
                    <span className="mx-2 text-muted-foreground">/</span>
                    <span className="text-muted-foreground">{String(count).padStart(2, "0")}</span>
                </span>
                <span className="projects-progress-line" aria-hidden="true">
                    <span ref={progressRef} style={{ transform: `scaleX(${1 / count})` }} />
                </span>
                <span className="hidden text-sm text-muted-foreground sm:block">{scrollHint}</span>
            </div>
        </div>
    );
}
