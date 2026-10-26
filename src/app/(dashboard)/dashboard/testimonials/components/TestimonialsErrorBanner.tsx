"use client";

import {Button} from "@/components/ui/button";

interface TestimonialsErrorBannerProps {
    onRetry: () => void;
}

export function TestimonialsErrorBanner({onRetry}: TestimonialsErrorBannerProps) {
    return (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-center justify-between text-sm">
            <span>تعذر جلب آراء العملاء من الخادم.</span>
            <Button size="sm" variant="outline" onClick={onRetry}>
                إعادة المحاولة
            </Button>
        </div>
    );
}
