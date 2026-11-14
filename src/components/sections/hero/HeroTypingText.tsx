"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function HeroTypingText({ phrases }: { phrases: readonly string[] }) {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const firstPhrase = phrases[0] ?? "";
    const [length, setLength] = useState(firstPhrase.length);
    const [deleting, setDeleting] = useState(false);
    const cursor = useRef<HTMLSpanElement>(null);
    const phrase = phrases[phraseIndex] ?? "";

    useGSAP(() => {
        gsap.to(cursor.current, { opacity: 0, duration: 0.55, repeat: -1, yoyo: true, ease: "power1.inOut" });
    }, { scope: cursor });

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            setLength(phrase.length);
            return;
        }
        const isComplete = length === phrase.length;
        const delay = deleting ? 38 : isComplete ? 1500 : 78;
        const timeout = window.setTimeout(() => {
            if (!deleting && isComplete) return setDeleting(true);
            if (deleting && length === 0) {
                setDeleting(false);
                setPhraseIndex((index) => (index + 1) % phrases.length);
                return;
            }
            setLength((value) => value + (deleting ? -1 : 1));
        }, delay);
        return () => window.clearTimeout(timeout);
    }, [deleting, length, phrase, phrases.length]);

    return (
        <span className="inline-block min-w-[19ch]">
            <span aria-hidden="true">{phrase.slice(0, length)}</span>
            <span ref={cursor} aria-hidden="true" className="ms-1 inline-block h-[1.1em] w-0.5 translate-y-0.5 bg-current" />
        </span>
    );
}
