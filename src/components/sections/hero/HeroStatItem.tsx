import { HeroStatCounter } from "./HeroStatCounter";

interface HeroStatItemProps {
    value: number | null;
    label: string;
    unavailable?: string;
    isRtl?: boolean;
}

export function HeroStatItem({ value, label, unavailable, isRtl = false }: HeroStatItemProps) {
    const formatted = value === null ? "—" : value.toLocaleString(isRtl ? "ar-SA" : "en-US");

    return (
        <div className="hero-stat-item">
            <HeroStatCounter value={value} isRtl={isRtl}>
                <span dir="ltr" className="hero-stat-value">
                    <span data-counter-value>{formatted}</span>
                    {value !== null && <span aria-hidden="true">+</span>}
                </span>
            </HeroStatCounter>
            <span className="hero-stat-label">{value === null ? unavailable : label}</span>
        </div>
    );
}
