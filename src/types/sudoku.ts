import { z } from "zod";

import { SudokuDifficultyEnum, SudokuStatusEnum } from "@/enums/sudoku";
import { SudokuSchema, SudokuSolutionSchema } from "@/schemas/sudoku";

export type Sudoku = z.infer<typeof SudokuSchema>
export type SudokuSolution = z.infer<typeof SudokuSolutionSchema>
export type SudokuDifficulty = z.infer<typeof SudokuDifficultyEnum>;
export type SudokuStatus = z.infer<typeof SudokuStatusEnum>;

export type Cell = {
    position: [number, number];
    value: string;
    isHint: boolean;
    isVerified: boolean;
};
