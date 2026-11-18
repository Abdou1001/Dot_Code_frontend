"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface CursorFollowerProps {
    label: string;
}

export function CursorFollower({ label }: CursorFollowerProps) {
    const cursorRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const media = gsap.matchMedia();
        media.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
            const moveX = gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power3.out" });
            const moveY = gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power3.out" });

            const handleMove = (event: PointerEvent) => {
                moveX(event.clientX);
                moveY(event.clientY);
                cursor.dataset.visible = "true";
            };
            const handleOver = (event: PointerEvent) => {
                const target = event.target;
                cursor.dataset.link = String(target instanceof Element && Boolean(target.closest("a")));
            };

            window.addEventListener("pointermove", handleMove, { passive: true });
            document.addEventListener("pointerover", handleOver, { passive: true });

            return () => {
                window.removeEventListener("pointermove", handleMove);
                document.removeEventListener("pointerover", handleOver);
            };
        });
    }, { scope: cursorRef });

    return <div ref={cursorRef} aria-hidden="true" className="project-cursor"><span>{label}</span></div>;
}
