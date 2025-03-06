// Custom types

import { z } from "zod";

import { SudokuDifficultyEnum } from "./enums";
import { SudokuSchema, UserFormSchema } from "./schemas";

export type Sudoku = z.infer<typeof SudokuSchema>
export type SudokuDifficulty = z.infer<typeof SudokuDifficultyEnum>;

export type UserFormValues = z.infer<typeof UserFormSchema>;