import {useQuery} from "@tanstack/react-query";
import {getAnalyticsSummary, getRawVisitorEvents, VisitorEventsListParams} from "@/services/analytics.api";

export const useAnalyticsSummary = (days = 30) => {
    return useQuery({
        queryKey: ["analytics-summary", days],
        queryFn: () => getAnalyticsSummary(days),
    });
};

export const useVisitorEvents = (params?: VisitorEventsListParams) => {
    return useQuery({
        queryKey: ["visitor-events-log", params?.page, params?.page_path, params?.device_type, params?.country],
        queryFn: () => getRawVisitorEvents(params),
    });
};
