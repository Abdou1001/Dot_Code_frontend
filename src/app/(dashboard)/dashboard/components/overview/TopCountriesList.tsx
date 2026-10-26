import {Globe2} from "lucide-react";

export interface TopCountryItem {
    item: string;
    count: number;
}

export interface TopCountriesListProps {
    data: TopCountryItem[];
}

export function TopCountriesList({data}: TopCountriesListProps) {
    const countries = data.slice(0, 5);
    const maxCount = countries[0]?.count || 1;

    return (
        <div className="vision-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Globe2 className="size-4 text-purple-400" />
                    <h4 className="text-base font-bold text-white">الدول الأكثر تفاعلاً</h4>
                </div>
                <span className="text-xs text-slate-400">التوزيع الجغرافي</span>
            </div>

            <div className="space-y-3">
                {countries.length === 0 ? (
                    <p className="text-slate-500 text-xs py-4 text-center">لا توجد بيانات جغرافية مسجلة</p>
                ) : (
                    countries.map((country, index) => {
                        const percentage = Math.round((country.count / maxCount) * 100);

                        return (
                            <div key={country.item || index} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-200 truncate max-w-[200px]">
                                        {country.item || "غير محدد"}
                                    </span>
                                    <span className="text-purple-400 font-bold shrink-0">
                                        {country.count} زائر
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-500"
                                        style={{width: `${percentage}%`}}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
