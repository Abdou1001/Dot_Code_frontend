"use client";

import {Activity, Compass, TrendingUp, Users} from "lucide-react";

interface AnalyticsOverviewCardsProps {
    overview?: {
        total_views?: number;
        unique_visitors?: number;
        today_views?: number;
        avg_pages_per_session?: number;
    } | null;
    timeframeDays: number;
    isLoading: boolean;
}

export function AnalyticsOverviewCards({
    overview,
    timeframeDays,
    isLoading,
}: AnalyticsOverviewCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Views */}
            <div className="vision-card rounded-2xl p-5">
                <p className="text-xs text-slate-400">إجمالي المشاهدات</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                    {isLoading ? "..." : (overview?.total_views ?? 0).toLocaleString()}
                </h3>
                <p className="text-[11px] text-blue-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    <span>خلال {timeframeDays} يوم</span>
                </p>
            </div>

            {/* Unique Visitors */}
            <div className="vision-card rounded-2xl p-5">
                <p className="text-xs text-slate-400">الزوار الفريدون</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                    {isLoading ? "..." : (overview?.unique_visitors ?? 0).toLocaleString()}
                </h3>
                <p className="text-[11px] text-purple-400 mt-2 flex items-center gap-1">
                    <Users className="size-3" />
                    <span>مستخدمون فريدون</span>
                </p>
            </div>

            {/* Today's Views */}
            <div className="vision-card rounded-2xl p-5">
                <p className="text-xs text-slate-400">مشاهدات اليوم</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                    {isLoading ? "..." : (overview?.today_views ?? 0).toLocaleString()}
                </h3>
                <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                    <Activity className="size-3" />
                    <span>نشاط حي لليوم</span>
                </p>
            </div>

            {/* Avg Pages Per Session */}
            <div className="vision-card rounded-2xl p-5">
                <p className="text-xs text-slate-400">معدل التصفح / الجلسة</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                    {isLoading ? "..." : (overview?.avg_pages_per_session ?? 0).toFixed(2)}
                </h3>
                <p className="text-[11px] text-amber-400 mt-2 flex items-center gap-1">
                    <Compass className="size-3" />
                    <span>صفحة لكل زائر</span>
                </p>
            </div>
        </div>
    );
}
