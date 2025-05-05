import { useState } from "react";

import { Sudoku } from "@/types/types";
import { notifySuccess } from "@/toasts/toast";
import { MAX_HINTS } from "./hint-button";
import { MAX_UNDOS } from "./undo-button";
import { MAX_CHECKS } from "./check-button";

type MoveHistoryItem = {
    position: number;
    oldValue: string;
    isHint: boolean;
};

/**
 * Custom hook to manage the player's grid state during play mode
 */
export const useSudokuPlayer = (
    sudoku: Sudoku,
    setSudoku: React.Dispatch<React.SetStateAction<Sudoku>>,
    onPuzzleSolved?: () => void
) => {
    const [moveHistory, setMoveHistory] = useState<MoveHistoryItem[]>([]);
    const [remainingHints, setRemainingHints] = useState(MAX_HINTS);
    const [remainingUndos, setRemainingUndos] = useState(MAX_UNDOS);
    const [remainingChecks, setRemainingChecks] = useState(MAX_CHECKS);
    const [isCheckModeActive, setIsCheckModeActive] = useState(false);

    /**
     * Updates a cell value in the player grid
     */
    const updateCell = (
        position: number,
        value: string,
        isHint: boolean = false
    ) => {
        // Save the current value for undo history
        setMoveHistory(prev => [...prev, {
            position,
            oldValue: sudoku.grid[position],
            isHint
        }]);

        const newPlayerGrid =
            sudoku.grid.substring(0, position) +
            (value || "0") +
            sudoku.grid.substring(position + 1);

        setSudoku((prev) => ({ ...prev, grid: newPlayerGrid }))

        // Check if the puzzle is solved
        if (!newPlayerGrid.includes("0") && sudoku.solution) {
            const isCorrect = newPlayerGrid === sudoku.solution.grid;
            if (isCorrect) {
                onPuzzleSolved?.();
            }
        }
    };

    /**
     * Handles cell change during play mode
     */
    const handleCellChange = (
        rowIndex: number,
        colIndex: number,
        value: string,
    ) => {
        const position = rowIndex * 9 + colIndex;
        updateCell(position, value);
    };

    /**
     * Provides a hint by filling a random empty cell with the correct value
     */
    const giveHint = () => {
        if (!sudoku.solution) return;

        // Find all empty cells
        const emptyCells = [];
        for (let i = 0; i < sudoku.grid.length; i++) {
            if (sudoku.grid[i] === "0") {
                emptyCells.push(i);
            }
        }

        if (emptyCells.length === 0) return;

        // Select a random empty cell
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellIndex = emptyCells[randomIndex];

        // Fill it with the correct value from solution
        updateCell(cellIndex, sudoku.solution.grid[cellIndex], true);
        setRemainingHints(prev => Math.max(0, prev - 1));
    };

    /**
     * Get hint positions from move history
     */
    const getHintPositions = () => {
        return moveHistory
            .filter(move => move.isHint)
            .map(move => move.position);
    };

    /**
     * Undo the last non-hint move
     */
    const undoMove = () => {
        if (moveHistory.length === 0) {
            return;
        }

        // Find the last non-hint move
        let lastMoveIndex = moveHistory.length - 1;
        let lastMove = moveHistory[lastMoveIndex];

        // Skip hint moves
        while (lastMoveIndex >= 0 && lastMove.isHint) {
            lastMoveIndex--;
            if (lastMoveIndex >= 0) {
                lastMove = moveHistory[lastMoveIndex];
            }
        }

        // If no valid moves found, return
        if (lastMoveIndex < 0) {
            return;
        }

        // Update the grid with the previous value
        const newPlayerGrid =
            sudoku.grid.substring(0, lastMove.position) +
            lastMove.oldValue +
            sudoku.grid.substring(lastMove.position + 1);

        setSudoku((prev) => ({ ...prev, grid: newPlayerGrid }))

        // Decrease the remaining undos
        setRemainingUndos(prev => Math.max(0, prev - 1));

        // Remove all moves up to and including the undone move
        setMoveHistory(prev => prev.slice(0, lastMoveIndex));
    };

    /**
     * Reset the player grid to the initial state (original puzzle)
     */
    const resetPlayerGrid = (originalGrid: string) => {
        setSudoku((prev) => ({ ...prev, grid: originalGrid }))
        setMoveHistory([]);
        setRemainingHints(MAX_HINTS);
        setRemainingUndos(MAX_UNDOS);
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
        setSudoku((prev) => ({ ...prev, grid: sudoku.solution!.grid }))
        notifySuccess("Solution revealed!");
    };

    return {
        remainingHints,
        remainingUndos,
        remainingChecks,
        isCheckModeActive,
        hintPositions: getHintPositions(),
        handleCellChange,
        giveHint,
        undoMove,
        toggleCheckMode,
        resetPlayerGrid,
        revealSolution,
        canUndo: moveHistory.length > 0 && moveHistory.some(move => !move.isHint)
    };
};
