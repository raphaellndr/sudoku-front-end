import { z } from "zod";

import { SudokuDifficultyEnum } from "./enums";

export const UserFormSchema = z.object({
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
})

export const SudokuSchema = z.object({
    id: z
        .string(),
    title: z
        .string(),
    difficulty: z
        .enum(SudokuDifficultyEnum.options),
    grid: z
        .string()
        .length(81, { message: "Sudoku must contain 81 characters" }),
    created_at: z
        .string(),
    updated_at: z
        .string(),
})