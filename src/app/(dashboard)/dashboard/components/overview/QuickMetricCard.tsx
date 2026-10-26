import {LucideIcon, ChevronLeft} from "lucide-react";
import {cn} from "@/lib/utils";
import Link from "next/link";

export interface QuickMetricCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    variant?: "blue" | "emerald" | "purple";
    href?: string;
    badgeText?: string;
    className?: string;
}

const VARIANT_STYLES = {
    blue: {
        iconBg: "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white",
        iconShadow: "0 0 16px rgba(0, 117, 255, 0.4)",
        cardBorder: "hover:border-blue-500/40",
        cardGlow: "from-blue-600/10 via-transparent to-transparent",
        badge: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    },
    emerald: {
        iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white",
        iconShadow: "0 0 16px rgba(16, 185, 129, 0.4)",
        cardBorder: "hover:border-emerald-500/40",
        cardGlow: "from-emerald-600/10 via-transparent to-transparent",
        badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    purple: {
        iconBg: "bg-gradient-to-tr from-purple-600 to-pink-500 text-white",
        iconShadow: "0 0 16px rgba(168, 85, 247, 0.4)",
        cardBorder: "hover:border-purple-500/40",
        cardGlow: "from-purple-600/10 via-transparent to-transparent",
        badge: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    },
};

export function QuickMetricCard({
    title,
    value,
    icon: Icon,
    variant = "blue",
    href,
    badgeText,
    className,
}: QuickMetricCardProps) {
    const style = VARIANT_STYLES[variant];

    const content = (
        <div
            className={cn(
                "vision-card rounded-2xl p-4 md:p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.015] border border-white/10 group cursor-pointer",
                style.cardBorder,
                className
            )}>
            {/* Ambient accent background glow */}
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-l pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity",
                    style.cardGlow
                )}
            />

            <div className="relative flex items-center justify-between gap-4">
                {/* الأيقونة في البداية تليها النصوص */}
                <div className="flex items-center gap-3.5 min-w-0">
                    <div
                        className={cn(
                            "size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
                            style.iconBg
                        )}
                        style={{boxShadow: style.iconShadow}}>
                        <Icon className="size-6" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-400 truncate group-hover:text-slate-300 transition-colors">
                            {title}
                        </p>
                        <h4 className="text-2xl font-bold text-white mt-0.5 tracking-tight truncate">
                            {typeof value === "number" ? value.toLocaleString() : value}
                        </h4>
                    </div>
                </div>

                {/* شارة التنقل أو التصنيف السريع */}
                {badgeText && (
                    <div
                        className={cn(
                            "hidden sm:flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all shrink-0",
                            style.badge,
                            "group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20"
                        )}>
                        <span>{badgeText}</span>
                        <ChevronLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
                    </div>
                )}
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block focus:outline-none">
                {content}
            </Link>
        );
    }

    return content;
}
