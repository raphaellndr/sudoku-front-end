import { z } from "zod";

export const RegisterFormSchema = z.object({
    username: z
        .string()
        .optional(),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
        .string()
        .min(1, { message: "Password confirmation is required" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const SignInFormSchema = z.object({
    username: z
        .string()
        .optional(),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email(),
    password: z
        .string()
})

export const SettingsFormSchema = z.object({
    username: z
        .string()
        .optional(),
    email: z
        .union([
            z.string().email(),
            z.literal("")
        ])
        .optional(),
}).refine((data) => data.username || data.email, {
    message: "Both fields cannot be empty",
    path: ["username"],
});
