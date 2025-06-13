import { z } from "zod";

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

export const LeaderboardSchema = z.object({
    id: z
        .string()
        .uuid({ message: "Must be a valid UUID" })
        .optional(),
    user_id: z
        .string()
        .uuid({ message: "Must be a valid UUID" }),
    email: z
        .string()
        .email(),
    username: z
        .string(),
    total_games: z
        .number()
        .int()
        .min(0, { message: "Total games must be a non-negative integer" }),
    completed_games: z
        .number()
        .int()
        .min(0, { message: "Completed games must be a non-negative integer" }),
    won_games: z
        .number()
        .int()
        .min(0, { message: "Won games must be a non-negative integer" }),
    win_rate: z
        .number()
        .min(0.0, { message: "Win rate must be a non-negative number" })
        .max(1.0, { message: "Win rate must not exceed 1.0" }),
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
        .min(0.0, { message: "Average score must be a non-negative number" })
        .nullable(),
    best_score: z
        .number()
        .int()
        .min(0, { message: "Best score must be a non-negative integer" }),
    created_at: z
        .string()
        .optional(),
    updated_at: z
        .string()
        .optional(),
});
