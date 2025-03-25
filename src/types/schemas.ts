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
});

export const SudokuSolutionSchema = z.object({
    id: z
        .string()
        .uuid({ message: "Must be a valid UUID" }),
    sudoku_id: z
        .string()
        .uuid({ message: "Must be a valid UUID" }),
    grid: z
        .string()
        .length(81, { message: "Solution grid must contain 81 characters" })
        .nullable()
        .optional(),
    created_at: z
        .string(),
    updated_at: z
        .string(),
});

export const SudokuSchema = z.object({
    id: z
        .string()
        .uuid({ message: "Must be a valid UUID" }),
    user_id: z
       .string()
       .uuid({ message: "Must be a valid UUID" }),
    title: z
        .string()
        .max(255),
    difficulty: z
        .enum(SudokuDifficultyEnum.options),
    grid: z
        .string()
        .length(81, { message: "Sudoku must contain 81 characters" }),
    task_id: z
       .string()
       .max(255)
       .nullable()
       .optional(),
    solution: SudokuSolutionSchema
        .optional(),
    created_at: z
        .string(),
    updated_at: z
        .string(),
});