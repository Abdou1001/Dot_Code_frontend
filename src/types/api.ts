import {Locale, MessageStatus, ProjectStatus} from "./enums";
import {User} from "./data";

/**
 * -----------------------------------------------------------------------------
 * 1. Common Query / Filter Parameters (DRY)
 * -----------------------------------------------------------------------------
 */
export interface BasePaginationParams {
    page?: number;
    limit?: number;
}

export interface BaseListParams extends BasePaginationParams {
    search?: string;
}

export interface ActiveListParams extends BaseListParams {
    is_active?: "true" | "false";
}

export interface ProjectListParams extends BaseListParams {
    status?: ProjectStatus;
}

export interface MessageListParams extends BaseListParams {
    status?: MessageStatus;
}

export interface TestimonialListParams extends BaseListParams {
    is_published?: "true" | "false";
    is_featured?: "true" | "false";
}

export interface VisitorEventsListParams extends BasePaginationParams {
    session_id?: string;
    page_path?: string;
    device_type?: string;
    country?: string;
    from_date?: string;
    to_date?: string;
}

/**
 * -----------------------------------------------------------------------------
 * 2. Common Entity Creation & Update Payloads (DRY)
 * -----------------------------------------------------------------------------
 */
export interface BaseEntityPayload {
    slug: string;
    sort_order?: number;
    is_active?: boolean;
}

export interface NamedEntityPayload extends BaseEntityPayload {
    name: string;
    name_ar?: string | null;
}

export interface IconEntityPayload extends BaseEntityPayload {
    icon?: string;
}

export interface NamedIconEntityPayload extends NamedEntityPayload {
    icon?: string;
}

export interface CreateProjectPayload extends BaseEntityPayload {
    status?: ProjectStatus;
    featured?: boolean;
    live_url?: string | null;
    github_url?: string | null;
}

/**
 * -----------------------------------------------------------------------------
 * 3. Translation Payloads (DRY)
 * -----------------------------------------------------------------------------
 */
export interface BaseTranslationPayload {
    locale?: Locale;
    title: string;
    description?: string;
}

export interface ProjectTranslationPayload extends BaseTranslationPayload {
    role?: string;
    challenge?: string;
    solution?: string;
    result?: string;
    meta_title?: string;
    meta_description?: string;
}

/**
 * -----------------------------------------------------------------------------
 * 4. Authentication Payloads & Responses (DRY)
 * -----------------------------------------------------------------------------
 */
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    full_name: string;
    email: string;
    password: string;
}

export interface VerifyEmailOtpPayload {
    email: string;
    otp: string;
}

export interface ResendOtpPayload {
    email: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface VerifyResetCodePayload {
    email: string;
    otp: string;
}

export interface ResetPasswordPayload {
    email: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AuthUserResponse {
    user: User;
}

