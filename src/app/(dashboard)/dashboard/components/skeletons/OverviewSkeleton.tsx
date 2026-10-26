import {Skeleton} from "@/components/ui/skeleton";

export function OverviewSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Top Bar Skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64 bg-white/10 rounded-lg" />
                    <Skeleton className="h-4 w-80 bg-white/5 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-48 bg-white/5 rounded-xl border border-white/5" />
                    <Skeleton className="size-9 bg-white/5 rounded-xl border border-white/5" />
                </div>
            </div>

            {/* Stat Cards Grid (4 Cards) - الأيقونة في البداية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({length: 4}).map((_, i) => (
                    <div
                        key={i}
                        className="vision-card rounded-2xl p-5 relative overflow-hidden flex items-center gap-4 border border-white/10">
                        <Skeleton className="size-12 rounded-xl bg-white/10 shrink-0" />
                        <div className="space-y-2 flex-1 min-w-0">
                            <Skeleton className="h-3 w-24 bg-white/10 rounded" />
                            <Skeleton className="h-7 w-20 bg-white/15 rounded-lg" />
                            <Skeleton className="h-3 w-32 bg-white/5 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Content Metrics (3 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({length: 3}).map((_, i) => (
                    <div
                        key={i}
                        className={`vision-card rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 border border-white/10 ${
                            i === 2 ? "sm:col-span-2 md:col-span-1" : ""
                        }`}>
                        <div className="flex items-center gap-3.5 min-w-0">
                            <Skeleton className="size-12 rounded-xl bg-white/10 shrink-0" />
                            <div className="space-y-2 min-w-0">
                                <Skeleton className="h-3 w-24 bg-white/10 rounded" />
                                <Skeleton className="h-7 w-16 bg-white/15 rounded-lg" />
                            </div>
                        </div>
                        <Skeleton className="hidden sm:block h-6 w-16 rounded-full bg-white/5 shrink-0" />
                    </div>
                ))}
            </div>

            {/* Charts Row: Area Chart (2 cols) & Donut Chart (1 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Trends Skeleton */}
                <div className="vision-card rounded-2xl p-5 lg:col-span-2 border border-white/10 space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-44 bg-white/10 rounded" />
                        <Skeleton className="h-3 w-64 bg-white/5 rounded" />
                    </div>
                    <Skeleton className="h-[280px] w-full rounded-xl bg-white/5" />
                </div>

                {/* Device Breakdown Skeleton */}
                <div className="vision-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32 bg-white/10 rounded" />
                        <Skeleton className="h-3 w-48 bg-white/5 rounded" />
                    </div>

                    <div className="h-[200px] flex items-center justify-center">
                        <Skeleton className="size-36 rounded-full bg-white/5 border-4 border-white/10" />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        {Array.from({length: 3}).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-2.5 rounded-full bg-white/15" />
                                    <Skeleton className="h-3 w-24 bg-white/10 rounded" />
                                </div>
                                <Skeleton className="h-3 w-8 bg-white/15 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Top Pages & Top Countries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <div className="vision-card rounded-2xl p-5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-40 bg-white/10 rounded" />
                        <Skeleton className="h-3 w-24 bg-white/5 rounded" />
                    </div>
                    <div className="space-y-3 pt-2">
                        {Array.from({length: 5}).map((_, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-3 w-36 bg-white/10 rounded" />
                                    <Skeleton className="h-3 w-14 bg-white/15 rounded" />
                                </div>
                                <Skeleton className="h-1.5 w-full bg-white/5 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Countries */}
                <div className="vision-card rounded-2xl p-5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-4 rounded bg-white/15" />
                            <Skeleton className="h-5 w-36 bg-white/10 rounded" />
                        </div>
                        <Skeleton className="h-3 w-20 bg-white/5 rounded" />
                    </div>
                    <div className="space-y-3 pt-2">
                        {Array.from({length: 5}).map((_, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-3 w-32 bg-white/10 rounded" />
                                    <Skeleton className="h-3 w-14 bg-white/15 rounded" />
                                </div>
                                <Skeleton className="h-1.5 w-full bg-white/5 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
