import api from "@/lib/axios";
import {ApiResponse} from "@/types/data";
import {
    LoginPayload as SharedLoginPayload,
    RegisterPayload as SharedRegisterPayload,
    VerifyEmailOtpPayload as SharedVerifyEmailOtpPayload,
    ResendOtpPayload as SharedResendOtpPayload,
    ForgotPasswordPayload as SharedForgotPasswordPayload,
    VerifyResetCodePayload as SharedVerifyResetCodePayload,
    ResetPasswordPayload as SharedResetPasswordPayload,
    AuthUserResponse,
} from "@/types/api";

export type LoginPayload = SharedLoginPayload;
export type RegisterPayload = SharedRegisterPayload;
export type VerifyEmailOtpPayload = SharedVerifyEmailOtpPayload;
export type ResendOtpPayload = SharedResendOtpPayload;
export type ForgotPasswordPayload = SharedForgotPasswordPayload;
export type VerifyResetCodePayload = SharedVerifyResetCodePayload;
export type ResetPasswordPayload = SharedResetPasswordPayload;

const RESOURCE = "auth";

// 2.1 Login: POST /api/auth/login
export const login = async (values: LoginPayload): Promise<ApiResponse<AuthUserResponse>> => {
    const {data} = await api.post<ApiResponse<AuthUserResponse>>(`/${RESOURCE}/login`, values);
    return data;
};

// 2.2 Register: POST /api/auth/register
export const register = async (values: RegisterPayload): Promise<ApiResponse<null>> => {
    const {data} = await api.post<ApiResponse<null>>(`/${RESOURCE}/register`, values);
    return data;
};

// 2.3 Verify Email OTP: POST /api/auth/verify-email-otp
export const verifyEmailOtp = async (values: VerifyEmailOtpPayload): Promise<ApiResponse<AuthUserResponse>> => {
    const {data} = await api.post<ApiResponse<AuthUserResponse>>(`/${RESOURCE}/verify-email-otp`, values);
    return data;
};

// 2.4 Resend OTP: POST /api/auth/resend-otp
export const resendOtp = async (values: ResendOtpPayload): Promise<ApiResponse<null>> => {
    const {data} = await api.post<ApiResponse<null>>(`/${RESOURCE}/resend-otp`, values);
    return data;
};

// 2.5 Forgot Password: POST /api/auth/forgot-password
export const forgotPassword = async (values: ForgotPasswordPayload): Promise<ApiResponse<null>> => {
    const {data} = await api.post<ApiResponse<null>>(`/${RESOURCE}/forgot-password`, values);
    return data;
};

// 2.6 Verify Password Reset Code: POST /api/auth/verify-reset-code
export const verifyResetCode = async (values: VerifyResetCodePayload): Promise<ApiResponse<null>> => {
    const {data} = await api.post<ApiResponse<null>>(`/${RESOURCE}/verify-reset-code`, values);
    return data;
};

// 2.7 Reset Password: POST /api/auth/reset-password
export const resetPassword = async (values: ResetPasswordPayload): Promise<ApiResponse<null>> => {
    const {data} = await api.post<ApiResponse<null>>(`/${RESOURCE}/reset-password`, values);
    return data;
};

// 2.8 Logout: POST /api/auth/logout
export const logout = async (): Promise<ApiResponse<null>> => {
    const {data} = await api.post<ApiResponse<null>>(`/${RESOURCE}/logout`);
    return data;
};

// 2.9 Get Current Authenticated User: GET /api/auth/me
export const getMe = async (): Promise<ApiResponse<AuthUserResponse>> => {
    const {data} = await api.get<ApiResponse<AuthUserResponse>>(`/${RESOURCE}/me`);
    return data;
};