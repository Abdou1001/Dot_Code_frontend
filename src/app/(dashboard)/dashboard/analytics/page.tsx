import {AnalyticsHeader} from "./components/AnalyticsHeader";
import {AnalyticsContent} from "./components/AnalyticsContent";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <AnalyticsHeader />
            <AnalyticsContent />
        </div>
    );
}
