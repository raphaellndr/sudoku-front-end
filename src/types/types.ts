// Custom types

import { z } from "zod";

import { SudokuDifficultyEnum } from "./enums";
import { UserFormSchema } from "./schemas";

export interface Sudoku {
    id: number;
    title: string;
    grid: string;
    difficulty: SudokuDifficulty;
    created_at: string;
    updated_at: string;
}

export type SudokuDifficulty = z.infer<typeof SudokuDifficultyEnum>;

export type UserFormValues = z.infer<typeof UserFormSchema>;