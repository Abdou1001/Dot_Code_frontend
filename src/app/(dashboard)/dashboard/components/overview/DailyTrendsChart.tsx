"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export interface DailyTrendItem {
    date: string;
    count: number;
}

export interface DailyTrendsChartProps {
    data: DailyTrendItem[];
}

export function DailyTrendsChart({data}: DailyTrendsChartProps) {
    return (
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
                {data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        لا توجد بيانات زيارات مسجلة خلال هذه الفترة
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
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
    );
}
