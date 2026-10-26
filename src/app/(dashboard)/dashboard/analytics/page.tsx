"use client";

import {useState} from "react";
import {useAnalyticsSummary, useVisitorEvents} from "@/hooks/analytics/useAnalytics";
import {AnalyticsSkeleton} from "@/app/(dashboard)/dashboard/components/skeletons";
import {AnalyticsHeader} from "./components/AnalyticsHeader";
import {AnalyticsOverviewCards} from "./components/AnalyticsOverviewCards";
import {AnalyticsBreakdown} from "./components/AnalyticsBreakdown";
import {AnalyticsEventsToolbar} from "./components/AnalyticsEventsToolbar";
import {AnalyticsEventsTable} from "./components/AnalyticsEventsTable";

export default function AnalyticsPage() {
    const [timeframeDays, setTimeframeDays] = useState(30);

    // Raw events log table state
    const [page, setPage] = useState(1);
    const [pathSearch, setPathSearch] = useState("");
    const [deviceFilter, setDeviceFilter] = useState("all");

    // Fetch summary
    const {data: summaryData, isLoading: isSummaryLoading} = useAnalyticsSummary(timeframeDays);

    // Fetch raw event log
    const {data: eventsData, isLoading: isEventsLoading} = useVisitorEvents({
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

    if (isSummaryLoading && !summaryData) {
        return <AnalyticsSkeleton />;
    }

    return (
        <div className="space-y-6">
            <AnalyticsHeader
                timeframeDays={timeframeDays}
                onTimeframeChange={setTimeframeDays}
            />

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
                    onSearch={(val) => {
                        setPathSearch(val);
                        setPage(1);
                    }}
                    onDeviceFilterChange={(val) => {
                        setDeviceFilter(val);
                        setPage(1);
                    }}
                />

                <AnalyticsEventsTable
                    data={rawEvents}
                    isLoading={isEventsLoading}
                    pagination={
                        pagination
                            ? {
                                  page: pagination.page,
                                  totalPages: pagination.totalPages,
                                  totalResults: pagination.totalResults,
                              }
                            : undefined
                    }
                    onPageChange={(p) => setPage(p)}
                />
            </div>
        </div>
    );
}
