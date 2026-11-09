import React from "react";

function AnalyticsHeaderComponent() {
    return (
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                تحليلات وسجل الزوار
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
                إحصائيات تفاعل الجلسات وسجل أحداث التصفح المباشرة
            </p>
        </div>
    );
}

export const AnalyticsHeader = React.memo(AnalyticsHeaderComponent);
export default AnalyticsHeader;
