// Custom types

import { Difficulty } from "./enums";

export interface Sudoku {
    id: number;
    title: string;
    grid: string;
    difficulty: Difficulty;
    created_at: string;
    updated_at: string;
}