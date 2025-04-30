import { useState } from "react";

import { Sudoku } from "@/types/types";
import { notifySuccess } from "@/toasts/toast";

type MoveHistoryItem = {
    position: number;
    oldValue: string;
    isHint: boolean;
};

/**
 * Custom hook to manage the player's grid state during play mode
 */
export const usePlayerGrid = (
    initialGrid: string = "0".repeat(81),
    onPuzzleSolved?: () => void
) => {
    const [playerGrid, setPlayerGrid] = useState<string>(initialGrid);
    const [moveHistory, setMoveHistory] = useState<MoveHistoryItem[]>([]);
    const [hintsUsed, setHintsUsed] = useState(0);

    /**
     * Updates a cell value in the player grid
     */
    const updateCell = (
        position: number,
        value: string,
        sudoku: Sudoku,
        isHint: boolean = false
    ) => {
        // Cannot modify an original cell
        if (sudoku.grid[position] !== '0') {
            return;
        }

        // Save the current value for undo history
        setMoveHistory(prev => [...prev, {
            position,
            oldValue: playerGrid[position],
            isHint
        }]);

        const newPlayerGrid =
            playerGrid.substring(0, position) +
            (value || '0') +
            playerGrid.substring(position + 1);

        setPlayerGrid(newPlayerGrid);

        // Check if the puzzle is solved
        if (!newPlayerGrid.includes('0') && sudoku.solution) {
            const isCorrect = newPlayerGrid === sudoku.solution.grid;
            if (isCorrect) {
                onPuzzleSolved?.();
                notifySuccess(isHint ? "Puzzle completed with hints!" : "Congratulations! You solved the puzzle!");
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
        sudoku: Sudoku
    ) => {
        const position = rowIndex * 9 + colIndex;
        updateCell(position, value, sudoku);
    };

    /**
     * Provides a hint by filling a random empty cell with the correct value
     */
    const giveHint = (sudoku: Sudoku) => {
        if (!sudoku.solution) return;

        // Find all empty cells
        const emptyCells = [];
        for (let i = 0; i < playerGrid.length; i++) {
            if (playerGrid[i] === '0') {
                emptyCells.push(i);
            }
        }

        if (emptyCells.length === 0) return;

        // Select a random empty cell
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellIndex = emptyCells[randomIndex];

        // Fill it with the correct value from solution
        updateCell(cellIndex, sudoku.solution.grid[cellIndex], sudoku, true);
        setHintsUsed(prev => prev + 1);
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
            playerGrid.substring(0, lastMove.position) +
            lastMove.oldValue +
            playerGrid.substring(lastMove.position + 1);

        setPlayerGrid(newPlayerGrid);

        // Remove all moves up to and including the undone move
        setMoveHistory(prev => prev.slice(0, lastMoveIndex));
    };

    /**
     * Reset the player grid to the initial state (original puzzle)
     */
    const resetPlayerGrid = (originalGrid: string) => {
        setPlayerGrid(originalGrid);
        setMoveHistory([]);
        setHintsUsed(0);
    };

    /**
     * Check current progress against the solution
     */
    const checkProgress = (sudoku: Sudoku) => {
        if (!sudoku.solution) return;

        let correct = 0;
        let incorrect = 0;

        for (let i = 0; i < playerGrid.length; i++) {
            if (playerGrid[i] !== '0') {
                if (playerGrid[i] === sudoku.solution.grid[i]) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        }

        notifySuccess(`Progress: ${correct} correct, ${incorrect} incorrect numbers, ${hintsUsed} hints used.`);
    };

    /**
     * Reveal the complete solution
     */
    const revealSolution = (sudoku: Sudoku) => {
        if (!sudoku.solution) return;
        setPlayerGrid(sudoku.solution.grid);
        notifySuccess("Solution revealed!");
    };

    return {
        playerGrid,
        setPlayerGrid,
        hintsUsed,
        moveHistory,
        handleCellChange,
        giveHint,
        undoMove,
        resetPlayerGrid,
        checkProgress,
        revealSolution,
        canUndo: moveHistory.length > 0 && moveHistory.some(move => !move.isHint)
    };
};