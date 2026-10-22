import {z} from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "البريد الإلكتروني مطلوب")
        .email("يرجى إدخال بريد إلكتروني صالح"),
    password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
