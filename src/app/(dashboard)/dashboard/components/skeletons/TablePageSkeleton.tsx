import {Skeleton} from "@/components/ui/skeleton";

interface TablePageSkeletonProps {
    titleWidth?: string;
    subtitleWidth?: string;
    hasActionBtn?: boolean;
    columnsCount?: number;
    rowsCount?: number;
}

export function TablePageSkeleton({
    titleWidth = "w-48",
    subtitleWidth = "w-72",
    hasActionBtn = true,
    columnsCount = 5,
    rowsCount = 6,
}: TablePageSkeletonProps) {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header: Title + Action Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className={`h-8 ${titleWidth} bg-white/10 rounded-lg`} />
                    <Skeleton className={`h-4 ${subtitleWidth} bg-white/5 rounded-md`} />
                </div>
                {hasActionBtn && (
                    <Skeleton className="h-10 w-36 bg-blue-600/30 rounded-xl border border-blue-500/20" />
                )}
            </div>

            {/* Toolbar: Search input + Select filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <Skeleton className="h-10 w-full sm:w-72 bg-white/5 rounded-xl border border-white/10" />
                <Skeleton className="h-10 w-full sm:w-44 bg-white/5 rounded-xl border border-white/10" />
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b1437]/50 backdrop-blur-md shadow-lg">
                {/* Table Header */}
                <div className="border-b border-white/10 bg-white/[0.02] p-4 flex items-center justify-between gap-4">
                    {Array.from({length: columnsCount}).map((_, i) => (
                        <Skeleton
                            key={i}
                            className={`h-4 bg-white/10 rounded ${
                                i === 0 ? "w-32" : i === columnsCount - 1 ? "w-16" : "w-20"
                            }`}
                        />
                    ))}
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-white/5">
                    {Array.from({length: rowsCount}).map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.01]">
                            {Array.from({length: columnsCount}).map((_, colIndex) => (
                                <Skeleton
                                    key={colIndex}
                                    className={`h-5 rounded ${
                                        colIndex === 0
                                            ? "w-40 bg-white/15"
                                            : colIndex === columnsCount - 1
                                            ? "w-16 bg-white/10"
                                            : "w-24 bg-white/5"
                                    }`}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Table Pagination Footer */}
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
    );
}
