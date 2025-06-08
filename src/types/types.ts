// Custom types

import { z } from "zod";

import { GameStatusEnum, SudokuDifficultyEnum, SudokuStatusEnum } from "./enums";
import {
    GameRecordSchema,
    RegisterFormSchema,
    SettingsFormSchema,
    SignInFormSchema,
    SudokuSchema,
    SudokuSolutionSchema,
    UserStatsSchema
} from "./schemas";

export type Sudoku = z.infer<typeof SudokuSchema>
export type SudokuSolution = z.infer<typeof SudokuSolutionSchema>
export type SudokuDifficulty = z.infer<typeof SudokuDifficultyEnum>;
export type SudokuStatus = z.infer<typeof SudokuStatusEnum>;

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
export type SignInFormValues = z.infer<typeof SignInFormSchema>;

export type SettingsFormValues = z.infer<typeof SettingsFormSchema>;

export type GameRecord = z.infer<typeof GameRecordSchema>;
export type GameStatus = z.infer<typeof GameStatusEnum>;

export type UserStats = z.infer<typeof UserStatsSchema>;
