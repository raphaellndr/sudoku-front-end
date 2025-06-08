import { z } from "zod";

import { GameStatusEnum, SudokuDifficultyEnum, SudokuStatusEnum } from "./enums";

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

export const SudokuSolutionSchema = z.object({
    id: z
        .string()
        .uuid({ message: "Must be a valid UUID" }),
    sudoku_id: z
        .string()
        .uuid({ message: "Must be a valid UUID" }),
    grid: z
        .string()
        .length(81, { message: "Solution grid must contain 81 characters" }),
    created_at: z
        .string()
        .optional(),
    updated_at: z
        .string()
        .optional(),
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
    status: z
        .enum(SudokuStatusEnum.options),
    task_id: z
        .string()
        .max(255)
        .nullable(),
    solution: SudokuSolutionSchema
        .nullable(),
    created_at: z
        .string()
        .optional(),
    updated_at: z
        .string()
        .optional(),
});

export const GameRecordSchema = z.object({
    id: z
        .string()
        .uuid({ message: "Must be a valid UUID" })
        .optional(),
    user_id: z
        .string()
        .uuid({ message: "Must be a valid UUID" })
        .optional(),
    sudoku_id: z
        .string()
        .uuid({ message: "Must be a valid UUID" })
        .nullable(),
    score: z
        .number()
        .int()
        .min(0, { message: "Score must be a non-negative integer" })
        .max(1000, { message: "Score must not exceed 1000" }),
    hints_used: z
        .number()
        .int()
        .min(0, { message: "Hints used must be a non-negative integer" })
        .max(3, { message: "Hints used must not exceed 3" }),
    checks_used: z
        .number()
        .int()
        .min(0, { message: "Checks used must be a non-negative integer" })
        .max(3, { message: "Checks used must not exceed 3" }),
    deletions: z
        .number()
        .int()
        .min(0, { message: "Deletions must be a non-negative integer" }),
    time_taken: z
        .number()
        .min(0, { message: "Time taken must be a non-negative integer" }),
    won: z
        .boolean(),
    status: z
        .enum(GameStatusEnum.options),
    original_puzzle: z
        .string()
        .length(81, { message: "Original puzzle must contain 81 characters" }),
    solution: z
        .string()
        .length(81, { message: "Solution must contain 81 characters" }),
    final_state: z
        .string()
        .length(81, { message: "Final state must contain 81 characters" }),
    started_at: z
        .string()
        .nullable(),
    completed_at: z
        .string()
        .nullable(),
    created_at: z
        .string()
        .optional(),
    updated_at: z
        .string()
        .optional(),
});

export const UserStatsSchema = z.object({
    id: z
        .string()
        .uuid({ message: "Must be a valid UUID" })
        .optional(),
    user_id: z
        .string()
        .uuid({ message: "Must be a valid UUID" })
        .optional(),
    total_games: z
        .number()
        .int()
        .min(0, { message: "Total games must be a non-negative integer" }),
    completed_games: z
        .number()
        .int()
        .min(0, { message: "Completed games must be a non-negative integer" }),
    abandoned_games: z
        .number()
        .int()
        .min(0, { message: "Abandoned games must be a non-negative integer" }),
    stopped_games: z
        .number()
        .int()
        .min(0, { message: "Stopped games must be a non-negative integer" }),
    in_progress_games: z
        .number()
        .int()
        .min(0, { message: "In progress games must be a non-negative integer" }),
    won_games: z
        .number()
        .int()
        .min(0, { message: "Won games must be a non-negative integer" }),
    lost_games: z
        .number()
        .int()
        .min(0, { message: "Lost games must be a non-negative integer" }),
    win_rate: z
        .number()
        .min(0.0, { message: "Win rate must be a non-negative number" })
        .max(1.0, { message: "Win rate must not exceed 1.0" }),
    total_time_seconds: z
        .number()
        .int()
        .min(0, { message: "Total time must be a non-negative integer" }),
    average_time_seconds: z
        .number()
        .min(0.0, { message: "Average time must be a non-negative number" }),
    best_time_seconds: z
        .number()
        .int()
        .min(0, { message: "Best time must be a non-negative integer" }),
    total_score: z
        .number()
        .int()
        .min(0, { message: "Total score must be a non-negative integer" }),
    average_score: z
        .number()
        .min(0.0, { message: "Average score must be a non-negative number" }),
    best_score: z
        .number()
        .int()
        .min(0, { message: "Best score must be a non-negative integer" }),
    total_hints_used: z
        .number()
        .int()
        .min(0, { message: "Total hints used must be a non-negative integer" }),
    total_checks_used: z
        .number()
        .int()
        .min(0, { message: "Total checks used must be a non-negative integer" }),
    total_deletions: z
        .number()
        .int()
        .min(0, { message: "Total deletions used must be a non-negative integer" }),
    created_at: z
        .string()
        .optional(),
    updated_at: z
        .string()
        .optional(),
});
