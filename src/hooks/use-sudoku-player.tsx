import { useEffect, useState } from "react";

import { Sudoku } from "@/types/sudoku";
import { notifySuccess } from "@/toasts/toast";
import { Cell } from "@/components/ui/play-page/sudoku-player";
import { MAX_HINTS } from "@/components/ui/play-page/buttons/hint-button";
import { MAX_CHECKS } from "@/components/ui/play-page/buttons/check-button";

interface UseSudokuPlayerProps {
    grid: Cell[];
    setGrid: React.Dispatch<React.SetStateAction<Cell[]>>;
    sudoku: Sudoku;
    onPuzzleSolved?: () => void;
    onPuzzleUnsolved?: () => void;
};

/**
 * Custom hook to manage the Sudoku player state and actions.
 * 
 * @param grid - The current player grid.
 * @param setGrid - Function to update the player grid.
 * @param sudoku - The Sudoku puzzle data.
 * @param onPuzzleSolved - Callback when the puzzle is solved.
 * @param onPuzzleUnsolved - Callback when the puzzle is unsolved.
 * @returns An object containing player actions and state.
 */
export const useSudokuPlayer = ({
    grid,
    setGrid,
    sudoku,
    onPuzzleSolved,
    onPuzzleUnsolved,
}: UseSudokuPlayerProps) => {
    const [remainingHints, setRemainingHints] = useState(MAX_HINTS);
    const [remainingChecks, setRemainingChecks] = useState(MAX_CHECKS);
    const [isCheckModeActive, setIsCheckModeActive] = useState(false);
    const [hasUsedCheck, setHasUsedCheck] = useState(false);
    const [solutionRevealed, setSolutionRevealed] = useState(false);

    useEffect(() => {
        if (solutionRevealed) return;

        const isFilled = !grid.some(cell => cell.value === "0");

        if (isFilled && sudoku.solution) {
            const gridString = grid.map(cell => cell.value).join("");
            const isCorrect = gridString === sudoku.solution.grid;

            if (isCorrect) {
                onPuzzleSolved?.();
            } else {
                onPuzzleUnsolved?.();
            }
        }
    }, [grid, solutionRevealed]);

    /**
     * Updates a cell value in the player grid with the given properties.
     * 
     * @param position - The position of the cell to update, as a tuple [row, col].
     * @param updates - The properties to update in the cell, excluding the position.
     *                  This can include `value`, `isHint`, and `isVerified`.
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
        // Don't trigger win/lose logic if solution was manually revealed
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
        setHasUsedCheck(false);
        setSolutionRevealed(false);
    };

    /**
     * Toggle check mode to verify cell values
     */
    const toggleCheckMode = () => {
        if (!isCheckModeActive) {
            // Entering check mode
            setIsCheckModeActive(true);
            setHasUsedCheck(false);
        } else {
            // Exiting check mode without using the check
            setIsCheckModeActive(false);

            // Only decrease the count if the check was actually used
            if (hasUsedCheck) {
                setRemainingChecks(prev => Math.max(0, prev - 1));
            }
        }
    };

    /**
     * Verify a cell by updating the check usage
     */
    const verifyCellValue = () => {
        setHasUsedCheck(true);
        setIsCheckModeActive(false);
        setRemainingChecks(prev => Math.max(0, prev - 1));
    };

    /**
     * Reveal the complete solution
     */
    const revealSolution = () => {
        if (!sudoku.solution || solutionRevealed) return;

        setSolutionRevealed(true);

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
        verifyCellValue,
        resetPlayerGrid,
        revealSolution,
    };
};
