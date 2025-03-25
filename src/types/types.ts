// Custom types

import { z } from "zod";

import { SudokuDifficultyEnum, SudokuStatusEnum } from "./enums";
import { SudokuSchema, SudokuSolutionSchema, UserFormSchema } from "./schemas";

export type Sudoku = z.infer<typeof SudokuSchema>
export type SudokuSolution = z.infer<typeof SudokuSolutionSchema>
export type SudokuDifficulty = z.infer<typeof SudokuDifficultyEnum>;
export type SudokuStatus = z.infer<typeof SudokuStatusEnum>;

export type UserFormValues = z.infer<typeof UserFormSchema>;