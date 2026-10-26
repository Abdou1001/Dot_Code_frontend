import {RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";

export interface OverviewHeaderProps {
    timeframeDays: number;
    onTimeframeChange: (days: number) => void;
    onRefresh: () => void;
}

export function OverviewHeader({
    timeframeDays,
    onTimeframeChange,
    onRefresh,
}: OverviewHeaderProps) {
    return (
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
                            onClick={() => onTimeframeChange(days)}
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
                    onClick={onRefresh}
                    className="size-9 border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl"
                    title="تحديث البيانات">
                    <RefreshCw className="size-4" />
                </Button>
            </div>
        </div>
    );
}
