import { z } from "zod";

export const UserFormSchema = z.object({
    username: z
        .string(),
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
})