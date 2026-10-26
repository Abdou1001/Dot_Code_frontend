import {LucideIcon, TrendingUp} from "lucide-react";
import {cn} from "@/lib/utils";

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trendText?: string;
    trendIcon?: LucideIcon;
    trendColor?: string;
    gradient?: string;
    shadowColor?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    trendText,
    trendIcon: TrendIcon = TrendingUp,
    trendColor = "text-blue-400",
    gradient = "from-blue-600 to-cyan-500",
    shadowColor = "rgba(0,117,255,0.4)",
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "vision-card rounded-2xl p-5 relative overflow-hidden transition-all hover:scale-[1.01] hover:border-white/15",
                className
            )}>
            {/* الأيقونة في البداية تليها النصوص */}
            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        "size-12 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white shrink-0",
                        gradient
                    )}
                    style={{boxShadow: `0 0 15px ${shadowColor}`}}>
                    <Icon className="size-6" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 truncate">{title}</p>
                    <h3 className="text-2xl font-bold text-white mt-1 tracking-tight truncate">
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </h3>
                    {trendText && (
                        <p className={cn("text-[11px] flex items-center gap-1 mt-1.5 truncate", trendColor)}>
                            <TrendIcon className="size-3 shrink-0" />
                            <span>{trendText}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
