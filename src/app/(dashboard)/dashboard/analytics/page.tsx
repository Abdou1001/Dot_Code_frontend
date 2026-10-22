"use client";

import {useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {
    Activity,
    Compass,
    Laptop,
    Smartphone,
    TrendingUp,
    Users,
} from "lucide-react";
import {VisitorEvent} from "@/types/data";
import {useAnalyticsSummary, useVisitorEvents} from "@/hooks/analytics/useAnalytics";
import {DataTable} from "@/app/(dashboard)/dashboard/components/table/DataTable";
import DataTableToolbar from "@/app/(dashboard)/dashboard/components/table/DataTableToolbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
import {Badge} from "@/components/ui/badge";

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

    const eventColumns: ColumnDef<VisitorEvent>[] = [
        {
            accessorKey: "page_path",
            header: "المسار المزار (Page Path)",
            cell: ({row}) => (
                <div className="py-1">
                    <span className="font-mono text-xs text-blue-400 font-medium" dir="ltr">
                        {row.original.page_path}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "device_type",
            header: "نوع الجهاز",
            cell: ({row}) => {
                const device = row.original.device_type?.toLowerCase();
                const isMobile = device === "mobile";
                return (
                    <Badge
                        variant="outline"
                        className={`text-xs border-white/10 flex items-center gap-1.5 w-fit ${
                            isMobile ? "text-purple-400 bg-purple-500/10" : "text-blue-400 bg-blue-500/10"
                        }`}>
                        {isMobile ? <Smartphone className="size-3" /> : <Laptop className="size-3" />}
                        <span>{device || "غير معروف"}</span>
                    </Badge>
                );
            },
        },
        {
            accessorKey: "country",
            header: "الدولة",
            cell: ({row}) => (
                <span className="text-xs text-slate-300">
                    {row.original.country || "غير محدد"}
                </span>
            ),
        },
        {
            accessorKey: "referrer",
            header: "المصدر (Referrer)",
            cell: ({row}) => {
                const ref = row.original.referrer;
                return (
                    <span className="text-xs text-slate-400 font-mono max-w-[200px] truncate block" dir="ltr" title={ref}>
                        {ref || "Direct (مباشر)"}
                    </span>
                );
            },
        },
        {
            accessorKey: "session_id",
            header: "معرف الجلسة",
            cell: ({row}) => (
                <span className="text-[10px] text-slate-500 font-mono max-w-[100px] truncate block" dir="ltr">
                    {row.original.session_id.substring(0, 8)}...
                </span>
            ),
        },
        {
            accessorKey: "created_at",
            header: "وقت الزيارة",
            cell: ({row}) => (
                <span className="text-xs text-slate-400">
                    {row.original.created_at
                        ? new Date(row.original.created_at).toLocaleString("ar-EG", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                          })
                        : "—"}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                        تحليلات وسجل الزوار
                    </h2>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">
                        إحصائيات تفاعل الجلسات وسجل أحداث التصفح المباشرة
                    </p>
                </div>

                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
                    {[7, 30, 90, 365].map((days) => (
                        <button
                            key={days}
                            onClick={() => setTimeframeDays(days)}
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

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="vision-card rounded-2xl p-5">
                    <p className="text-xs text-slate-400">إجمالي المشاهدات</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                        {isSummaryLoading ? "..." : (overview?.total_views ?? 0).toLocaleString()}
                    </h3>
                    <p className="text-[11px] text-blue-400 mt-2 flex items-center gap-1">
                        <TrendingUp className="size-3" />
                        <span>خلال {timeframeDays} يوم</span>
                    </p>
                </div>

                <div className="vision-card rounded-2xl p-5">
                    <p className="text-xs text-slate-400">الزوار الفريدون</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                        {isSummaryLoading ? "..." : (overview?.unique_visitors ?? 0).toLocaleString()}
                    </h3>
                    <p className="text-[11px] text-purple-400 mt-2 flex items-center gap-1">
                        <Users className="size-3" />
                        <span>مستخدمون فريدون</span>
                    </p>
                </div>

                <div className="vision-card rounded-2xl p-5">
                    <p className="text-xs text-slate-400">مشاهدات اليوم</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                        {isSummaryLoading ? "..." : (overview?.today_views ?? 0).toLocaleString()}
                    </h3>
                    <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                        <Activity className="size-3" />
                        <span>نشاط حي لليوم</span>
                    </p>
                </div>

                <div className="vision-card rounded-2xl p-5">
                    <p className="text-xs text-slate-400">معدل التصفح / الجلسة</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                        {isSummaryLoading ? "..." : (overview?.avg_pages_per_session ?? 0).toFixed(2)}
                    </h3>
                    <p className="text-[11px] text-amber-400 mt-2 flex items-center gap-1">
                        <Compass className="size-3" />
                        <span>صفحة لكل زائر</span>
                    </p>
                </div>
            </div>

            {/* Referrers & Top Pages Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Referrers */}
                <div className="vision-card rounded-2xl p-5">
                    <h4 className="text-base font-bold text-white mb-1">أبرز مصادر الإحالة (Referrers)</h4>
                    <p className="text-xs text-slate-400 mb-4">المواقع والمنصات التي أتى الزوار منها</p>

                    <div className="space-y-2">
                        {isSummaryLoading ? (
                            Array.from({length: 3}).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-full bg-white/5 rounded-lg" />
                            ))
                        ) : referrers.length === 0 ? (
                            <p className="text-slate-500 text-xs py-3 text-center">لا توجد مصادر إحالة مسجلة</p>
                        ) : (
                            referrers.map((ref, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs">
                                    <span className="text-slate-200 font-mono truncate max-w-xs" dir="ltr">
                                        {ref.item}
                                    </span>
                                    <span className="text-blue-400 font-semibold">{ref.count} زيارة</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Pages */}
                <div className="vision-card rounded-2xl p-5">
                    <h4 className="text-base font-bold text-white mb-1">أعلى الصفحات طلباً</h4>
                    <p className="text-xs text-slate-400 mb-4">أكثر مسارات الموقع جذباً للمشاهدات</p>

                    <div className="space-y-2">
                        {isSummaryLoading ? (
                            Array.from({length: 3}).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-full bg-white/5 rounded-lg" />
                            ))
                        ) : topPages.length === 0 ? (
                            <p className="text-slate-500 text-xs py-3 text-center">لا توجد صفحات مسجلة</p>
                        ) : (
                            topPages.slice(0, 5).map((page, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs">
                                    <span className="text-slate-200 font-mono" dir="ltr">
                                        {page.item}
                                    </span>
                                    <span className="text-purple-400 font-semibold">{page.count} زيارة</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Raw Visitor Event Stream Log */}
            <div className="space-y-4 pt-4">
                <div>
                    <h3 className="text-lg font-bold text-white">سجل أحداث الزوار المباشر (Raw Events)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        سجل دقيق لجميع طلبات الصفحات مع نوع الجهاز ومصدر الإحالة والدولة
                    </p>
                </div>

                <DataTableToolbar
                    searchPlaceholder="بحث في المسارات المزارة (Path)..."
                    onSearch={(val) => {
                        setPathSearch(val);
                        setPage(1);
                    }}>
                    <div className="w-36">
                        <Select
                            value={deviceFilter}
                            onValueChange={(val) => {
                                setDeviceFilter(val);
                                setPage(1);
                            }}>
                            <SelectTrigger className="border-white/10 bg-white/5 text-slate-200 text-xs h-9">
                                <SelectValue placeholder="نوع الجهاز" />
                            </SelectTrigger>
                            <SelectContent className="border-white/10 bg-[#0B1437] text-slate-200 text-xs">
                                <SelectItem value="all">كل الأجهزة</SelectItem>
                                <SelectItem value="desktop">حاسوب (Desktop)</SelectItem>
                                <SelectItem value="mobile">هاتف (Mobile)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </DataTableToolbar>

                <DataTable
                    columns={eventColumns}
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
