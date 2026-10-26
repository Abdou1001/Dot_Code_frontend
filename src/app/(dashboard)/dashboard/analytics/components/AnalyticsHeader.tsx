"use client";

interface AnalyticsHeaderProps {
    timeframeDays: number;
    onTimeframeChange: (days: number) => void;
}

const TIMEFRAMES = [7, 30, 90, 365];

export function AnalyticsHeader({
    timeframeDays,
    onTimeframeChange,
}: AnalyticsHeaderProps) {
    return (
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
                {TIMEFRAMES.map((days) => (
                    <button
                        key={days}
                        onClick={() => onTimeframeChange(days)}
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
    );
}
