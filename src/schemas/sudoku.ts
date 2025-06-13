import { z } from "zod";

import { SudokuDifficultyEnum, SudokuStatusEnum } from "@/enums/sudoku";

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
