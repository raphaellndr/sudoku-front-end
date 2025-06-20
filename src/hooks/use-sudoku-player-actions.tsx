import { useCallback } from "react";

import { Cell, Sudoku } from "@/types/sudoku";
import { GameStatusEnum } from "@/enums/games";
import { GameRecord, GameStatus } from "@/types/games";

interface UseSudokuPlayerActionsProps {
    sudoku: Sudoku;
    setSudoku: React.Dispatch<React.SetStateAction<Sudoku>>;
    grid: Cell[];
    remainingHints: number;
    remainingChecks: number;
    cellDeletionCount: number;
    timer: number;
    headers: HeadersInit;
    createGameRecord: (
        sudoku: Sudoku,
        grid: Cell[],
        remainingHints: number,
        remainingChecks: number,
        cellDeletionCount: number,
        timer: number,
        won: boolean,
        status: GameStatus
    ) => GameRecord;
    saveGame: (headers: any, gameData: GameRecord) => Promise<void>;
    revealSolution: () => void;
    resetTimer: () => void;
    completeGame: (won: boolean) => void;
    startPlaying: any;
    abortGame: (sudokuId: string, headers: any) => Promise<void>;
    clearSudokuGrid: () => void;
    startNewGame: () => void;
    resetPlayerGrid: () => void;
    restartTimer: () => void;
    validateSudokuGrid: () => {
        valid: boolean;
        message: string;
    };
}

const useSudokuPlayerActions = ({
    sudoku,
    setSudoku,
    grid,
    remainingHints,
    remainingChecks,
    cellDeletionCount,
    timer,
    headers,
    createGameRecord,
    saveGame,
    revealSolution,
    resetTimer,
    completeGame,
    startPlaying,
    abortGame,
    clearSudokuGrid,
    startNewGame,
    resetPlayerGrid,
    restartTimer,
    validateSudokuGrid,
}: UseSudokuPlayerActionsProps) => {

    const handleStartPlaying = useCallback(() => {
        startPlaying(sudoku, setSudoku, headers, validateSudokuGrid);
    }, [sudoku, headers, validateSudokuGrid, startPlaying]);

    const handleAbortButton = useCallback(() => {
        if (sudoku.id) {
            abortGame(sudoku.id, headers);
        }
    }, [sudoku.id, abortGame, headers]);

    const handleGiveUpButton = useCallback(async () => {
        const gameData = createGameRecord(
            sudoku, grid, remainingHints, remainingChecks,
            cellDeletionCount, timer, false, GameStatusEnum.Values.abandoned
        );
        await saveGame(headers, gameData);
        revealSolution();
        resetTimer();
        completeGame(false);
    }, [
        sudoku, grid, remainingHints, remainingChecks,
        cellDeletionCount, timer, headers, createGameRecord,
        saveGame, revealSolution, resetTimer, completeGame
    ]);

    const handleStartNewPuzzle = useCallback(() => {
        clearSudokuGrid();
        startNewGame();
        resetTimer();
    }, [clearSudokuGrid, startNewGame, resetTimer]);

    const handleRestartPuzzle = useCallback(() => {
        resetPlayerGrid();
        restartTimer();
    }, [resetPlayerGrid, restartTimer]);

    return {
        handleStartPlaying,
        handleAbortButton,
        handleGiveUpButton,
        handleStartNewPuzzle,
        handleRestartPuzzle,
    };
};

export default useSudokuPlayerActions;
