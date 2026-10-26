"use client";

import {useState} from "react";
import {useAnalyticsSummary} from "@/hooks/analytics/useAnalytics";
import {useProjectsCount} from "@/hooks/projects/useProjects";
import {useMessagesCount} from "@/hooks/messages/useMessages";
import {useTestimonialsCount} from "@/hooks/testimonials/useTestimonials";
import {
    Activity,
    Eye,
    FolderGit2,
    Mail,
    MessageSquareQuote,
    TrendingUp,
    Users,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {OverviewSkeleton} from "./components/skeletons";
import {
    OverviewHeader,
    StatCard,
    QuickMetricCard,
    DailyTrendsChart,
    DeviceBreakdownChart,
    TopPagesList,
    TopCountriesList,
} from "./components/overview";

export default function OverviewPage() {
    const [timeframeDays, setTimeframeDays] = useState(30);

    const {
        data: analyticsData,
        isLoading: isAnalyticsLoading,
        isError: isAnalyticsError,
        refetch: refetchAnalytics,
    } = useAnalyticsSummary(timeframeDays);

    const {data: projectsData, isLoading: isProjectsLoading} = useProjectsCount();
    const {data: messagesData, isLoading: isMessagesLoading} = useMessagesCount();
    const {data: testimonialsData, isLoading: isTestimonialsLoading} = useTestimonialsCount();

    const summary = analyticsData?.results;
    const overview = summary?.overview;
    const dailyTrends = summary?.daily_trends || [];
    const deviceBreakdown = summary?.device_breakdown || [];
    const topPages = summary?.top_pages || [];
    const topCountries = summary?.top_countries || [];

    const totalProjects = projectsData?.pagination?.totalResults ?? 0;
    const totalMessages = messagesData?.pagination?.totalResults ?? 0;
    const totalTestimonials = testimonialsData?.pagination?.totalResults ?? 0;

    if (isAnalyticsLoading && !analyticsData) {
        return <OverviewSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Top Bar with Timeframe Toggle & Refresh */}
            <OverviewHeader
                timeframeDays={timeframeDays}
                onTimeframeChange={setTimeframeDays}
                onRefresh={() => refetchAnalytics()}
            />

            {/* Error State */}
            {isAnalyticsError && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between">
                    <div className="text-sm">تعذر تحميل بيانات الإحصائيات الحالية من الخادم.</div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refetchAnalytics()}
                        className="border-red-500/30 hover:bg-red-500/20 text-red-300">
                        إعادة المحاولة
                    </Button>
                </div>
            )}

            {/* Stat Cards Grid (Vision UI Style) - Reusable StatCard with Icon first */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="إجمالي المشاهدات"
                    value={overview?.total_views ?? 0}
                    icon={Eye}
                    trendText={`خلال ${timeframeDays} يوم`}
                    trendColor="text-blue-400"
                    gradient="from-blue-600 to-cyan-500"
                    shadowColor="rgba(0,117,255,0.4)"
                />

                <StatCard
                    title="الزوار الفريدون"
                    value={overview?.unique_visitors ?? 0}
                    icon={Users}
                    trendText="جلسات مستخدمين"
                    trendColor="text-purple-400"
                    gradient="from-purple-600 to-pink-500"
                    shadowColor="rgba(117,81,255,0.4)"
                />

                <StatCard
                    title="مشاهدات اليوم"
                    value={overview?.today_views ?? 0}
                    icon={Activity}
                    trendText="اليوم حتى الآن"
                    trendIcon={Activity}
                    trendColor="text-emerald-400"
                    gradient="from-emerald-600 to-teal-400"
                    shadowColor="rgba(1,181,116,0.4)"
                />

                <StatCard
                    title="متوسط الصفحات / الجلسة"
                    value={(overview?.avg_pages_per_session ?? 0).toFixed(2)}
                    icon={TrendingUp}
                    trendText="معدل التصفح للزائر"
                    trendColor="text-amber-400"
                    gradient="from-amber-500 to-orange-400"
                    shadowColor="rgba(255,181,71,0.4)"
                />
            </div>

            {/* Quick Content Metrics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <QuickMetricCard
                    title="المشاريع في المعرض"
                    value={isProjectsLoading ? "..." : totalProjects}
                    icon={FolderGit2}
                    variant="blue"
                    href="/dashboard/projects"
                    badgeText="المعرض"
                />

                <QuickMetricCard
                    title="آراء العملاء"
                    value={isTestimonialsLoading ? "..." : totalTestimonials}
                    icon={MessageSquareQuote}
                    variant="emerald"
                    href="/dashboard/testimonials"
                    badgeText="التقييمات"
                />

                <QuickMetricCard
                    title="رسائل التواصل"
                    value={isMessagesLoading ? "..." : totalMessages}
                    icon={Mail}
                    variant="purple"
                    href="/dashboard/messages"
                    badgeText="الوارد"
                    className="sm:col-span-2 md:col-span-1"
                />
            </div>

            {/* Charts Row: Daily Trends & Device Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DailyTrendsChart data={dailyTrends} />
                <DeviceBreakdownChart data={deviceBreakdown} />
            </div>

            {/* Bottom Row: Top Visited Pages & Top Countries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopPagesList data={topPages} />
                <TopCountriesList data={topCountries} />
            </div>
        </div>
    );
}
