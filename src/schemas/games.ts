import { z } from "zod";

import { GameStatusEnum } from "@/enums/games";

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
