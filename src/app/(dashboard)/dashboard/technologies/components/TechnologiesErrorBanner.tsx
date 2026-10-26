"use client";

import {Button} from "@/components/ui/button";

interface TechnologiesErrorBannerProps {
    onRetry: () => void;
}

export function TechnologiesErrorBanner({onRetry}: TechnologiesErrorBannerProps) {
    return (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between text-sm">
            <span>تعذر جلب التقنيات من الخادم.</span>
            <Button size="sm" variant="outline" onClick={onRetry}>
                إعادة المحاولة
            </Button>
        </div>
    );
}
