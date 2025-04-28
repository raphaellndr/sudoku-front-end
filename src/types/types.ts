// Custom types

import { z } from "zod";

import { SudokuDifficultyEnum, SudokuStatusEnum } from "./enums";
import { RegisterFormSchema, SettingsFormSchema, SignInFormSchema, SudokuSchema, SudokuSolutionSchema } from "./schemas";

export type Sudoku = z.infer<typeof SudokuSchema>
export type SudokuSolution = z.infer<typeof SudokuSolutionSchema>
export type SudokuDifficulty = z.infer<typeof SudokuDifficultyEnum>;
export type SudokuStatus = z.infer<typeof SudokuStatusEnum>;

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
export type SignInFormValues = z.infer<typeof SignInFormSchema>;

export type SettingsFormValues = z.infer<typeof SettingsFormSchema>;