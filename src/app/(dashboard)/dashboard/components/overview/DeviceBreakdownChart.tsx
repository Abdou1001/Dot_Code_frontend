"use client";

import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer} from "recharts";

const DEVICE_COLORS: Record<string, string> = {
    desktop: "#0075FF",
    mobile: "#7551FF",
    tablet: "#2CD9FF",
    other: "#01B574",
};

export interface DeviceBreakdownItem {
    device: string;
    count: number;
}

export interface DeviceBreakdownChartProps {
    data: DeviceBreakdownItem[];
}

export function DeviceBreakdownChart({data}: DeviceBreakdownChartProps) {
    return (
        <div className="vision-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
                <h4 className="text-base font-bold text-white">توزيع الأجهزة</h4>
                <p className="text-xs text-slate-400">نوع أجهزة الزوار المستخدمة للتصفح</p>
            </div>

            <div className="h-[200px] w-full flex items-center justify-center" dir="ltr">
                {data.length === 0 ? (
                    <div className="text-slate-500 text-xs">لا توجد بيانات للأجهزة</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="count"
                                nameKey="device"
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={4}>
                                {data.map((entry, index) => (
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
                {data.map((item) => (
                    <div key={item.device} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span
                                className="size-2.5 rounded-full"
                                style={{
                                    backgroundColor: DEVICE_COLORS[item.device] || "#7551FF",
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
    );
}
