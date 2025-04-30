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
    const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
        const position = rowIndex * 9 + colIndex;

        const newSudokuGrid =
            sudoku.grid.substring(0, position) +
            (value || '0') +
            sudoku.grid.substring(position + 1);

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