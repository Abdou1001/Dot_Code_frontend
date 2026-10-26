export interface TopPageItem {
    item: string;
    count: number;
}

export interface TopPagesListProps {
    data: TopPageItem[];
}

export function TopPagesList({data}: TopPagesListProps) {
    const pages = data.slice(0, 5);
    const maxCount = pages[0]?.count || 1;

    return (
        <div className="vision-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-white">الصفحات الأكثر زيارة</h4>
                <span className="text-xs text-slate-400">أعلى المسارات طلباً</span>
            </div>

            <div className="space-y-3">
                {pages.length === 0 ? (
                    <p className="text-slate-500 text-xs py-4 text-center">لا توجد صفحات مسجلة</p>
                ) : (
                    pages.map((page, index) => {
                        const percentage = Math.round((page.count / maxCount) * 100);

                        return (
                            <div key={page.item || index} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-200 font-mono truncate max-w-[200px]" dir="ltr">
                                        {page.item}
                                    </span>
                                    <span className="text-blue-400 font-bold shrink-0">
                                        {page.count} زيارة
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
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
