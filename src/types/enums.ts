export const PROJECT_STATUS = ["draft", "published", "hidden"] as const;
export type ProjectStatus = (typeof PROJECT_STATUS)[number];

export const MESSAGE_STATUS = ["new", "read", "replied", "archived"] as const;
export type MessageStatus = (typeof MESSAGE_STATUS)[number];

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];