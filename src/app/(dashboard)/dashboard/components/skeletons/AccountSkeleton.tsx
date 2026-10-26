import {Skeleton} from "@/components/ui/skeleton";

export function AccountSkeleton() {
    return (
        <div className="space-y-6 max-w-4xl animate-pulse">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-56 bg-white/10 rounded-lg" />
                <Skeleton className="h-4 w-96 bg-white/5 rounded-md" />
            </div>

            {/* Profile Overview Card */}
            <div className="vision-card rounded-2xl p-6 border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="size-16 rounded-2xl bg-white/15 shrink-0" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48 bg-white/15 rounded-md" />
                            <Skeleton className="h-4 w-60 bg-white/10 rounded" />
                            <div className="flex items-center gap-2 pt-1">
                                <Skeleton className="h-5 w-24 rounded-full bg-blue-500/20" />
                                <Skeleton className="h-5 w-16 rounded-full bg-emerald-500/20" />
                            </div>
                        </div>
                    </div>
                    <Skeleton className="h-10 w-32 rounded-xl bg-red-500/20 border border-red-500/30" />
                </div>
            </div>

            {/* Account Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="vision-card rounded-xl p-5 border border-white/10 space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-4 rounded bg-white/15" />
                            <Skeleton className="h-4 w-28 bg-white/10 rounded" />
                        </div>
                        <Skeleton className="h-6 w-40 bg-white/15 rounded" />
                    </div>
                ))}
            </div>

            {/* Permissions / Security Card */}
            <div className="vision-card rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-5 rounded bg-white/15" />
                    <Skeleton className="h-5 w-44 bg-white/10 rounded" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-white/5 rounded" />
                    <Skeleton className="h-4 w-5/6 bg-white/5 rounded" />
                </div>
            </div>
        </div>
    );
}
