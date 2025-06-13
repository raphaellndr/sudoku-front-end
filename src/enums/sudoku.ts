import { z } from "zod";

export const SudokuDifficultyEnum = z.enum(["unknown", "easy", "medium", "hard"]);
export const SudokuStatusEnum = z.enum(["created", "running", "pending", "completed", "failed", "aborted", "invalid"]);
