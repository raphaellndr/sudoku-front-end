// Custom types

import { z } from "zod";

import { Difficulty } from "./enums";
import { UserFormSchema } from "./schemas";

export interface Sudoku {
    id: number;
    title: string;
    grid: string;
    difficulty: Difficulty;
    created_at: string;
    updated_at: string;
}

export type UserFormValues = z.infer<typeof UserFormSchema>;