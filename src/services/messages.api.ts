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
export const getDashboardMessages = (params?: MessageListParams) =>
    getDashboardResource<ContactMessage>(RESOURCE, params);

// 9.3 Get Message by ID
export const getMessageById = (id: string) =>
    getResourceById<ContactMessage>(RESOURCE, id);

// 9.4 Update Message Status
export const updateMessageStatus = (
    id: string,
    status: "new" | "read" | "replied" | "archived"
) => patchResource<ContactMessage>(RESOURCE, id, "status", {status});

// 9.5 Delete Message
export const deleteMessage = (id: string) =>
    deleteResource(RESOURCE, id);
