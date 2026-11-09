"use client";

import {useState, useCallback} from "react";
import {useAnalyticsSummary, useVisitorEvents} from "@/hooks/analytics/useAnalytics";
import {AnalyticsSkeleton} from "@/app/(dashboard)/dashboard/components/skeletons";
import {AnalyticsOverviewCards} from "./AnalyticsOverviewCards";
import {AnalyticsBreakdown} from "./AnalyticsBreakdown";
import {AnalyticsEventsToolbar} from "./AnalyticsEventsToolbar";
import {AnalyticsEventsTable} from "./AnalyticsEventsTable";

const TIMEFRAMES = [7, 30, 90, 365];

export function AnalyticsContent() {
    const [timeframeDays, setTimeframeDays] = useState(30);

    // Raw events log table state
    const [page, setPage] = useState(1);
    const [pathSearch, setPathSearch] = useState("");
    const [deviceFilter, setDeviceFilter] = useState("all");

    // Fetch summary
    const {data: summaryData, isLoading: isSummaryLoading} = useAnalyticsSummary(timeframeDays);

    // Fetch raw event log with automatic debounce and cancellation
    const {data: eventsData, isLoading: isEventsLoading, isFetching: isEventsFetching} = useVisitorEvents({
        page,
        limit: 15,
        page_path: pathSearch.trim() || undefined,
        device_type: deviceFilter === "all" ? undefined : deviceFilter,
    });

    const summary = summaryData?.results;
    const overview = summary?.overview;
    const referrers = summary?.top_referrers || [];
    const topPages = summary?.top_pages || [];

    const rawEvents = eventsData?.results || [];
    const pagination = eventsData?.pagination;

    const handleTimeframeChange = useCallback((days: number) => {
        setTimeframeDays(days);
    }, []);

    const handleSearch = useCallback((val: string) => {
        setPathSearch(val);
        setPage(1);
    }, []);

    const handleDeviceFilterChange = useCallback((val: string) => {
        setDeviceFilter(val);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((p: number) => {
        setPage(p);
    }, []);

    if (isSummaryLoading && !summaryData) {
        return <AnalyticsSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Timeframe Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-semibold text-slate-300">
                    تصفية الإحصائيات حسب النطاق الزمني:
                </span>
                <div className="flex items-center bg-[#060b26]/60 border border-white/10 rounded-xl p-1 text-xs">
                    {TIMEFRAMES.map((days) => (
                        <button
                            key={days}
                            onClick={() => handleTimeframeChange(days)}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                timeframeDays === days
                                    ? "bg-blue-600 text-white font-semibold shadow-[0_0_10px_rgba(0,117,255,0.4)]"
                                    : "text-slate-400 hover:text-white"
                            }`}>
                            {days} يوم
                        </button>
                    ))}
                </div>
            </div>

            <AnalyticsOverviewCards
                overview={overview}
                timeframeDays={timeframeDays}
                isLoading={isSummaryLoading}
            />

            <AnalyticsBreakdown
                referrers={referrers}
                topPages={topPages}
            />

            <div className="space-y-4 pt-4">
                <div>
                    <h3 className="text-lg font-bold text-white">
                        سجل أحداث الزوار المباشر (Raw Events)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        سجل دقيق لجميع طلبات الصفحات مع نوع الجهاز ومصدر الإحالة والدولة
                    </p>
                </div>

                <AnalyticsEventsToolbar
                    deviceFilter={deviceFilter}
                    onSearch={handleSearch}
                    onDeviceFilterChange={handleDeviceFilterChange}
                />

                <AnalyticsEventsTable
                    data={rawEvents}
                    isLoading={isEventsLoading}
                    isFetching={isEventsFetching}
                    pagination={
                        pagination
                            ? {
                                  page: pagination.page,
                                  totalPages: pagination.totalPages,
                                  totalResults: pagination.totalResults,
                              }
                            : undefined
                    }
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default AnalyticsContent;

