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
    Globe2,
    Mail,
    MessageSquareQuote,
    RefreshCw,
    TrendingUp,
    Users,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const DEVICE_COLORS: Record<string, string> = {
    desktop: "#0075FF",
    mobile: "#7551FF",
    tablet: "#2CD9FF",
    other: "#01B574",
};

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

    return (
        <div className="space-y-6">
            {/* Top Bar with Timeframe Toggle & Refresh */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                        لوحة المؤشرات والتحليلات
                    </h2>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">
                        متابعة حية لتفاعل الزوار ونشاط محتوى Dot Code Portfolio
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
                        {[7, 30, 90].map((days) => (
                            <button
                                key={days}
                                onClick={() => setTimeframeDays(days)}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    timeframeDays === days
                                        ? "bg-blue-600 text-white font-semibold shadow-[0_0_10px_rgba(0,117,255,0.4)]"
                                        : "text-slate-400 hover:text-white"
                                }`}>
                                {days === 7 ? "7 أيام" : days === 30 ? "30 يوم" : "90 يوم"}
                            </button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetchAnalytics()}
                        className="size-9 border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl"
                        title="تحديث البيانات">
                        <RefreshCw className="size-4" />
                    </Button>
                </div>
            </div>

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

            {/* Stat Cards Grid (Vision UI Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Views */}
                <div className="vision-card rounded-2xl p-5 relative overflow-hidden transition-all hover:scale-[1.01] hover:border-white/15">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400">إجمالي المشاهدات</p>
                            {isAnalyticsLoading ? (
                                <Skeleton className="h-8 w-24 mt-2 bg-white/10" />
                            ) : (
                                <h3 className="text-2xl font-bold text-white mt-1">
                                    {(overview?.total_views ?? 0).toLocaleString()}
                                </h3>
                            )}
                            <p className="text-[11px] text-blue-400 flex items-center gap-1 mt-2">
                                <TrendingUp className="size-3" />
                                <span>خلال {timeframeDays} يوم الماضية</span>
                            </p>
                        </div>
                        <div className="size-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,117,255,0.4)]">
                            <Eye className="size-6" />
                        </div>
                    </div>
                </div>

                {/* Unique Visitors */}
                <div className="vision-card rounded-2xl p-5 relative overflow-hidden transition-all hover:scale-[1.01] hover:border-white/15">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400">الزوار الفريدون</p>
                            {isAnalyticsLoading ? (
                                <Skeleton className="h-8 w-24 mt-2 bg-white/10" />
                            ) : (
                                <h3 className="text-2xl font-bold text-white mt-1">
                                    {(overview?.unique_visitors ?? 0).toLocaleString()}
                                </h3>
                            )}
                            <p className="text-[11px] text-purple-400 flex items-center gap-1 mt-2">
                                <Users className="size-3" />
                                <span>جلسات مستخدمين مميزة</span>
                            </p>
                        </div>
                        <div className="size-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(117,81,255,0.4)]">
                            <Users className="size-6" />
                        </div>
                    </div>
                </div>

                {/* Today Views */}
                <div className="vision-card rounded-2xl p-5 relative overflow-hidden transition-all hover:scale-[1.01] hover:border-white/15">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400">مشاهدات اليوم</p>
                            {isAnalyticsLoading ? (
                                <Skeleton className="h-8 w-24 mt-2 bg-white/10" />
                            ) : (
                                <h3 className="text-2xl font-bold text-white mt-1">
                                    {(overview?.today_views ?? 0).toLocaleString()}
                                </h3>
                            )}
                            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
                                <Activity className="size-3" />
                                <span>اليوم حتى الآن</span>
                            </p>
                        </div>
                        <div className="size-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-[0_0_15px_rgba(1,181,116,0.4)]">
                            <Activity className="size-6" />
                        </div>
                    </div>
                </div>

                {/* Avg Pages per Session */}
                <div className="vision-card rounded-2xl p-5 relative overflow-hidden transition-all hover:scale-[1.01] hover:border-white/15">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400">متوسط الصفحات / الجلسة</p>
                            {isAnalyticsLoading ? (
                                <Skeleton className="h-8 w-24 mt-2 bg-white/10" />
                            ) : (
                                <h3 className="text-2xl font-bold text-white mt-1">
                                    {(overview?.avg_pages_per_session ?? 0).toFixed(2)}
                                </h3>
                            )}
                            <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-2">
                                <TrendingUp className="size-3" />
                                <span>معدل التصفح للزائر</span>
                            </p>
                        </div>
                        <div className="size-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,181,71,0.4)]">
                            <TrendingUp className="size-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Content Metrics Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="vision-card rounded-xl p-4 flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                        <FolderGit2 className="size-5" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-400">المشاريع في المعرض</span>
                        <p className="text-lg font-bold text-white">
                            {isProjectsLoading ? "..." : totalProjects}
                        </p>
                    </div>
                </div>

                <div className="vision-card rounded-xl p-4 flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <MessageSquareQuote className="size-5" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-400">آراء العملاء</span>
                        <p className="text-lg font-bold text-white">
                            {isTestimonialsLoading ? "..." : totalTestimonials}
                        </p>
                    </div>
                </div>

                <div className="vision-card rounded-xl p-4 flex items-center gap-3 col-span-2 md:col-span-1">
                    <div className="size-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Mail className="size-5" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-400">رسائل التواصل</span>
                        <p className="text-lg font-bold text-white">
                            {isMessagesLoading ? "..." : totalMessages}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Row: Daily Trends & Device Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Trends Area Chart */}
                <div className="vision-card rounded-2xl p-5 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-base font-bold text-white">مسار الزيارات اليومي</h4>
                            <p className="text-xs text-slate-400">
                                عدد الزيارات اليومية المسجلة خلال الفترة
                            </p>
                        </div>
                    </div>

                    <div className="h-[280px] w-full" dir="ltr">
                        {isAnalyticsLoading ? (
                            <Skeleton className="h-full w-full rounded-xl bg-white/5" />
                        ) : dailyTrends.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                لا توجد بيانات زيارات مسجلة خلال هذه الفترة
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyTrends}>
                                    <defs>
                                        <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0075FF" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#0075FF" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        stroke="#64748B"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#64748B"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#0B1437",
                                            borderColor: "rgba(255,255,255,0.1)",
                                            borderRadius: "0.75rem",
                                            color: "#fff",
                                            fontSize: "12px",
                                        }}
                                        formatter={(value: any) => [`${value} زيارة`, "المشاهدات"]}
                                        labelFormatter={(label) => `التاريخ: ${label}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#0075FF"
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#viewsGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Device Breakdown Donut Chart */}
                <div className="vision-card rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                        <h4 className="text-base font-bold text-white">توزيع الأجهزة</h4>
                        <p className="text-xs text-slate-400">نوع أجهزة الزوار المستخدمة للتصفح</p>
                    </div>

                    <div className="h-[200px] w-full flex items-center justify-center" dir="ltr">
                        {isAnalyticsLoading ? (
                            <Skeleton className="size-40 rounded-full bg-white/5" />
                        ) : deviceBreakdown.length === 0 ? (
                            <div className="text-slate-500 text-xs">لا توجد بيانات للأجهزة</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceBreakdown}
                                        dataKey="count"
                                        nameKey="device"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={4}>
                                        {deviceBreakdown.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={DEVICE_COLORS[entry.device] || "#7551FF"}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#0B1437",
                                            borderColor: "rgba(255,255,255,0.1)",
                                            borderRadius: "0.5rem",
                                            color: "#fff",
                                            fontSize: "12px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        {deviceBreakdown.map((item) => (
                            <div key={item.device} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="size-2.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                DEVICE_COLORS[item.device] || "#7551FF",
                                        }}
                                    />
                                    <span className="text-slate-300 capitalize">
                                        {item.device === "desktop"
                                            ? "حاسوب (Desktop)"
                                            : item.device === "mobile"
                                            ? "هاتف (Mobile)"
                                            : item.device}
                                    </span>
                                </div>
                                <span className="font-semibold text-white">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Top Visited Pages & Top Countries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Visited Pages */}
                <div className="vision-card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-bold text-white">الصفحات الأكثر زيارة</h4>
                        <span className="text-xs text-slate-400">أعلى المسارات طلباً</span>
                    </div>

                    <div className="space-y-3">
                        {isAnalyticsLoading ? (
                            Array.from({length: 4}).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full bg-white/5 rounded-lg" />
                            ))
                        ) : topPages.length === 0 ? (
                            <p className="text-slate-500 text-xs py-4 text-center">لا توجد صفحات مسجلة</p>
                        ) : (
                            topPages.slice(0, 5).map((page, index) => {
                                const maxCount = topPages[0]?.count || 1;
                                const percentage = Math.round((page.count / maxCount) * 100);

                                return (
                                    <div key={page.item || index} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-200 font-mono" dir="ltr">
                                                {page.item}
                                            </span>
                                            <span className="text-blue-400 font-bold">
                                                {page.count} زيارة
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                                                style={{width: `${percentage}%`}}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Top Countries */}
                <div className="vision-card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Globe2 className="size-4 text-purple-400" />
                            <h4 className="text-base font-bold text-white">الدول الأكثر تفاعلاً</h4>
                        </div>
                        <span className="text-xs text-slate-400">التوزيع الجغرافي</span>
                    </div>

                    <div className="space-y-3">
                        {isAnalyticsLoading ? (
                            Array.from({length: 4}).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full bg-white/5 rounded-lg" />
                            ))
                        ) : topCountries.length === 0 ? (
                            <p className="text-slate-500 text-xs py-4 text-center">لا توجد بيانات جغرافية مسجلة</p>
                        ) : (
                            topCountries.slice(0, 5).map((country, index) => {
                                const maxCount = topCountries[0]?.count || 1;
                                const percentage = Math.round((country.count / maxCount) * 100);

                                return (
                                    <div key={country.item || index} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-200">
                                                {country.item || "غير محدد"}
                                            </span>
                                            <span className="text-purple-400 font-bold">
                                                {country.count} زائر
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                                                style={{width: `${percentage}%`}}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
