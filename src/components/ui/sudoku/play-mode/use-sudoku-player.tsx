import { useState } from "react";

import { Sudoku } from "@/types/types";
import { notifySuccess } from "@/toasts/toast";
import { MAX_HINTS } from "./hint-button";
import { MAX_CHECKS } from "./check-button";
import { Cell } from "./sudoku-player";

/**
 * Custom hook to manage the player's grid state during play mode
 */
export const useSudokuPlayer = (
    grid: Cell[],
    setGrid: React.Dispatch<React.SetStateAction<Cell[]>>,
    sudoku: Sudoku,
    onPuzzleSolved?: () => void
) => {
    const [remainingHints, setRemainingHints] = useState(MAX_HINTS);
    const [remainingChecks, setRemainingChecks] = useState(MAX_CHECKS);
    const [isCheckModeActive, setIsCheckModeActive] = useState(false);

    /**
     * Updates a cell value in the player grid with the given properties
     */
    const updateCellProperties = (
        position: [number, number],
        updates: Partial<Omit<Cell, "position">>
    ) => {
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((cell) => {
                if (cell.position[0] === position[0] && cell.position[1] === position[1]) {
                    return {
                        ...cell,
                        ...updates
                    };
                }
                return cell;
            });

            const isFilled = !newGrid.some(cell => cell.value === "0");

            if (isFilled && sudoku.solution) {
                const gridString = newGrid.map(cell => cell.value).join("");
                const isCorrect = gridString === sudoku.solution.grid;

                if (isCorrect) {
                    onPuzzleSolved?.();
                }
            }

            return newGrid;
        });
    };

    /**
     * Handles cell change during play mode
     */
    const handleCellChange = (
        position: [number, number],
        value: string,
    ) => {
        updateCellProperties(position, { value: value });
    };

    /**
     * Provides a hint by filling a random empty cell with the correct value
     */
    const giveHint = () => {
        if (!sudoku.solution) return;

        // Find all empty cells
        const emptyCells = grid.filter(cell => cell.value === "0");
        if (emptyCells.length === 0) return;

        // Select a random empty cell
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const selectedCell = emptyCells[randomIndex];

        // Get the correct value from the solution string
        const row = selectedCell.position[0];
        const col = selectedCell.position[1];
        const solutionIndex = row * 9 + col;
        const correctValue = sudoku.solution.grid[solutionIndex];

        updateCellProperties(selectedCell.position, {
            value: correctValue,
            isHint: true
        });

        setRemainingHints(prev => Math.max(0, prev - 1));
    };

    /**
     * Reset the player grid to the initial state (original puzzle)
     */
    const resetPlayerGrid = () => {
        // Convert the grid string back to Cell objects
        const initialGrid = sudoku.grid.split("").map((value, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            return {
                position: [row, col] as [number, number],
                value: value,
                isHint: false,
                isVerified: false
            };
        });

        setGrid(initialGrid);
        setRemainingHints(MAX_HINTS);
        setRemainingChecks(MAX_CHECKS);
        setIsCheckModeActive(false);
    };

    /**
     * Toggle check mode to verify cell values
     */
    const toggleCheckMode = () => {
        if (!isCheckModeActive && remainingChecks > 0) {
            setIsCheckModeActive(true);
            setRemainingChecks(prev => Math.max(0, prev - 1));
        } else {
            setIsCheckModeActive(false);
        }
    };

    /**
     * Reveal the complete solution
     */
    const revealSolution = () => {
        if (!sudoku.solution) return;

        const solutionGrid = sudoku.solution.grid.split("").map((value, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            return {
                position: [row, col] as [number, number],
                value: value,
                isHint: false,
                isVerified: false
            };
        });

        setGrid(solutionGrid);
        notifySuccess("Solution revealed!");
    };

    return {
        remainingHints,
        remainingChecks,
        isCheckModeActive,
        setIsCheckModeActive,
        handleCellChange,
        giveHint,
        toggleCheckMode,
        resetPlayerGrid,
        revealSolution,
    };
};
