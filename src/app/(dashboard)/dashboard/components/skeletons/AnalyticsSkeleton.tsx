import {Skeleton} from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Top Bar Skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-60 bg-white/10 rounded-lg" />
                    <Skeleton className="h-4 w-96 bg-white/5 rounded-md" />
                </div>
                <Skeleton className="h-9 w-48 bg-white/5 rounded-xl border border-white/5" />
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({length: 4}).map((_, i) => (
                    <div
                        key={i}
                        className="vision-card rounded-2xl p-5 border border-white/10 flex items-center justify-between">
                        <div className="space-y-3 flex-1">
                            <Skeleton className="h-3 w-28 bg-white/10 rounded" />
                            <Skeleton className="h-8 w-24 bg-white/15 rounded-lg" />
                            <Skeleton className="h-3 w-32 bg-white/5 rounded" />
                        </div>
                        <Skeleton className="size-12 rounded-xl bg-white/10 shrink-0" />
                    </div>
                ))}
            </div>

            {/* 2 Side-by-Side Cards (Top Referrers & Top Landing Pages) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({length: 2}).map((_, i) => (
                    <div key={i} className="vision-card rounded-2xl p-5 border border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-40 bg-white/10 rounded" />
                            <Skeleton className="h-3 w-24 bg-white/5 rounded" />
                        </div>
                        <div className="space-y-3 pt-2">
                            {Array.from({length: 4}).map((_, j) => (
                                <div key={j} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3 w-36 bg-white/10 rounded" />
                                        <Skeleton className="h-3 w-16 bg-white/15 rounded" />
                                    </div>
                                    <Skeleton className="h-1.5 w-full bg-white/5 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Raw Visitor Events Section */}
            <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-52 bg-white/10 rounded" />
                    <Skeleton className="h-4 w-80 bg-white/5 rounded" />
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Skeleton className="h-10 w-full sm:w-72 bg-white/5 rounded-xl border border-white/10" />
                    <Skeleton className="h-10 w-full sm:w-44 bg-white/5 rounded-xl border border-white/10" />
                </div>

                {/* Events Table Container */}
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b1437]/50 backdrop-blur-md shadow-lg">
                    <div className="border-b border-white/10 bg-white/[0.02] p-4 flex items-center justify-between gap-4">
                        {Array.from({length: 6}).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-24 bg-white/10 rounded" />
                        ))}
                    </div>

                    <div className="divide-y divide-white/5">
                        {Array.from({length: 6}).map((_, rowIndex) => (
                            <div key={rowIndex} className="p-4 flex items-center justify-between gap-4">
                                {Array.from({length: 6}).map((_, colIndex) => (
                                    <Skeleton
                                        key={colIndex}
                                        className={`h-5 rounded ${
                                            colIndex === 0
                                                ? "w-28 bg-white/15"
                                                : colIndex === 1
                                                ? "w-44 bg-white/10"
                                                : "w-20 bg-white/5"
                                        }`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-white/10 flex items-center justify-between gap-4 bg-white/[0.01]">
                        <Skeleton className="h-4 w-36 bg-white/10 rounded" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-20 bg-white/5 rounded-lg border border-white/10" />
                            <Skeleton className="h-8 w-8 bg-white/10 rounded-lg" />
                            <Skeleton className="h-8 w-20 bg-white/5 rounded-lg border border-white/10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
