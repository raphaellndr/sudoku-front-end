// Custom enums

import { z } from "zod";

export const SudokuDifficultyEnum = z.enum(["unknown", "easy", "medium", "hard"]);
export const SudokuStatusEnum = z.enum(["created", "running", "pending", "completed", "failed", "aborted", "invalid"]);

export const GameStatusEnum = z.enum(["in_progress", "completed", "abandoned", "stopped"]);

export const StatsPeriodEnum = z.enum(["daily", "weekly", "monthly", "yearly", "allTime"]);
export const ChartsPeriodEnum = z.enum(["daily", "monthly"]);
