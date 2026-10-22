import api from "@/lib/axios";
import {ApiResponse, VisitorAnalyticsSummary, VisitorEvent} from "@/types/data";
import {VisitorEventsListParams as SharedVisitorEventsListParams} from "@/types/api";

export type VisitorEventsListParams = SharedVisitorEventsListParams;

const RESOURCE = "visitor-events";

// 10.2 Admin Analytics Dashboard Summary
export const getAnalyticsSummary = async (days = 30): Promise<ApiResponse<VisitorAnalyticsSummary>> => {
    const {data} = await api.get<ApiResponse<VisitorAnalyticsSummary>>(`/${RESOURCE}/dashboard`, {
        params: {days},
    });
    return data;
};

// 10.3 Admin Raw Events Log
export const getRawVisitorEvents = async (params?: VisitorEventsListParams): Promise<ApiResponse<VisitorEvent[]>> => {
    const {data} = await api.get<ApiResponse<VisitorEvent[]>>(`/${RESOURCE}/dashboard/events`, {params});
    return data;
};
