import {ContactMessage} from "@/types/data";
import {MessageListParams as SharedMessageListParams} from "@/types/api";
import {
    getDashboardResource,
    getResourceById,
    patchResource,
    deleteResource,
} from "./base.api";

export type MessageListParams = SharedMessageListParams;

const RESOURCE = "messages";

// 9.2 Admin Dashboard: List Messages
export const getDashboardMessages = (params?: MessageListParams, signal?: AbortSignal) =>
    getDashboardResource<ContactMessage>(RESOURCE, params, signal);

// 9.3 Get Message by ID
export const getMessageById = (id: string, signal?: AbortSignal) =>
    getResourceById<ContactMessage>(RESOURCE, id, undefined, signal);

// 9.4 Update Message Status
export const updateMessageStatus = (
    id: string,
    status: "new" | "read" | "replied" | "archived"
) => patchResource<ContactMessage>(RESOURCE, id, "status", {status});

// 9.5 Delete Message
export const deleteMessage = (id: string) =>
    deleteResource(RESOURCE, id);
