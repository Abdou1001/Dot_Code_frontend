import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {getAnalyticsSummary, getRawVisitorEvents, VisitorEventsListParams} from "@/services/analytics.api";

export const useAnalyticsSummary = (days = 30) => {
    return useQuery({
        queryKey: ["analytics-summary", days],
        queryFn: ({signal}) => getAnalyticsSummary(days, signal),
        staleTime: 60 * 1000,
    });
};

export const useVisitorEvents = (params?: VisitorEventsListParams) => {
    return useQuery({
        queryKey: [
            "visitor-events-log",
            params?.page,
            params?.limit,
            params?.page_path,
            params?.device_type,
            params?.country,
        ],
        queryFn: ({signal}) => getRawVisitorEvents(params, signal),
        placeholderData: keepPreviousData,
    });
};
