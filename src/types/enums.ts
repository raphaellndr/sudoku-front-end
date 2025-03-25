// Custom enums

import { z } from "zod";

export const SudokuDifficultyEnum = z.enum(["Unknown", "Easy", "Medium", "Hard"]);
export const SudokuStatusEnum = z.enum(["Unknown", "Easy", "Medium", "Hard"]);