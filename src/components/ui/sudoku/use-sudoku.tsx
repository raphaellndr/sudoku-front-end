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

    /**
     * Validates that the sudoku grid follows sudoku rules
     * @returns An object with valid status and error message if invalid
     */
    const validateSudokuGrid = () => {
        const grid = sudoku.grid;

        // Check if grid is the right length
        if (grid.length !== 81) {
            return { valid: false, message: "Grid must contain exactly 81 cells" };
        }

        // Check if grid contains only digits 0-9
        if (!/^[0-9]{81}$/.test(grid)) {
            return { valid: false, message: "Grid must contain only digits 0-9" };
        }

        // Convert string to 2D array for easier processing
        const board = [];
        for (let i = 0; i < 9; i++) {
            board.push(grid.slice(i * 9, (i + 1) * 9).split('').map(Number));
        }

        // Check rows
        for (let row = 0; row < 9; row++) {
            const seen = new Set();
            for (let col = 0; col < 9; col++) {
                const num = board[row][col];
                if (num !== 0 && seen.has(num)) {
                    return { valid: false, message: `Duplicate number ${num} in row ${row + 1}` };
                }
                if (num !== 0) seen.add(num);
            }
        }

        // Check columns
        for (let col = 0; col < 9; col++) {
            const seen = new Set();
            for (let row = 0; row < 9; row++) {
                const num = board[row][col];
                if (num !== 0 && seen.has(num)) {
                    return { valid: false, message: `Duplicate number ${num} in column ${col + 1}` };
                }
                if (num !== 0) seen.add(num);
            }
        }

        // Check 3x3 subgrids
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                const seen = new Set();
                for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
                    for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
                        const num = board[row][col];
                        if (num !== 0 && seen.has(num)) {
                            return {
                                valid: false,
                                message: `Duplicate number ${num} in 3x3 box at position ${boxRow + 1},${boxCol + 1}`
                            };
                        }
                        if (num !== 0) seen.add(num);
                    }
                }
            }
        }

        return { valid: true, message: "Sudoku is valid" };
    };

    return {
        sudoku,
        setSudoku,
        handleCellChange,
        clearSudokuGrid,
        validateSudokuGrid,
        headers
    };
};
