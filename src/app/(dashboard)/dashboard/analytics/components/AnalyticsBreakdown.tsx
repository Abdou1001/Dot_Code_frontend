"use client";

interface BreakdownItem {
    item: string;
    count: number;
}

interface AnalyticsBreakdownProps {
    referrers: BreakdownItem[];
    topPages: BreakdownItem[];
}

export function AnalyticsBreakdown({referrers, topPages}: AnalyticsBreakdownProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Referrers */}
            <div className="vision-card rounded-2xl p-5">
                <h4 className="text-base font-bold text-white mb-1">
                    أبرز مصادر الإحالة (Referrers)
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                    المواقع والمنصات التي أتى الزوار منها
                </p>

                <div className="space-y-2">
                    {referrers.length === 0 ? (
                        <p className="text-slate-500 text-xs py-3 text-center">
                            لا توجد مصادر إحالة مسجلة
                        </p>
                    ) : (
                        referrers.map((ref, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs">
                                <span className="text-slate-200 font-mono truncate max-w-xs" dir="ltr">
                                    {ref.item}
                                </span>
                                <span className="text-blue-400 font-semibold">
                                    {ref.count} زيارة
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Top Pages */}
            <div className="vision-card rounded-2xl p-5">
                <h4 className="text-base font-bold text-white mb-1">
                    أعلى الصفحات طلباً
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                    أكثر مسارات الموقع جذباً للمشاهدات
                </p>

                <div className="space-y-2">
                    {topPages.length === 0 ? (
                        <p className="text-slate-500 text-xs py-3 text-center">
                            لا توجد صفحات مسجلة
                        </p>
                    ) : (
                        topPages.slice(0, 5).map((page, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs">
                                <span className="text-slate-200 font-mono" dir="ltr">
                                    {page.item}
                                </span>
                                <span className="text-purple-400 font-semibold">
                                    {page.count} زيارة
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
