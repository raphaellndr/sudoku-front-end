import { useState } from "react";

import { useSession } from "next-auth/react";

import { Sudoku } from "@/types/types";
import { SudokuDifficultyEnum, SudokuStatusEnum } from "@/types/enums";
import { createHeaders } from "./sudoku-api";

export const defaultSudoku: Sudoku = {
    id: "",
    title: "",
    grid: "0".repeat(81),
    solution: null,
    status: SudokuStatusEnum.Values.created,
    difficulty: SudokuDifficultyEnum.Values.unknown,
} as Sudoku;

/**
 * Custom hook to manage sudoku state and operations
 */
export const useSudoku = () => {
    const { data: session } = useSession();
    const [sudoku, setSudoku] = useState<Sudoku>(defaultSudoku);
    const headers = createHeaders(session);

    /**
     * Handles cell change in the grid
     */
    const handleCellChange = (position: [number, number], value: string) => {
        const pos = position[0] * 9 + position[1];

        const newSudokuGrid =
            sudoku.grid.substring(0, pos) +
            (value || '0') +
            sudoku.grid.substring(pos + 1);

        setSudoku({ ...sudoku, grid: newSudokuGrid });
    };

    /**
     * Clear the sudoku grid
     */
    const clearSudokuGrid = () => {
        setSudoku(defaultSudoku);
    };

    return {
        sudoku,
        setSudoku,
        handleCellChange,
        clearSudokuGrid,
        headers
    };
};