import { useState, useCallback } from "react";

import { notifyError } from "@/toasts/toast";
import { abortSolving, createSudoku, solveSudoku } from "@/services/sudokusApi";
import { Sudoku } from "@/types/sudoku";
import { GameMode } from "@/types/games";

export const useSudokuGameFlow = () => {
    const [mode, setMode] = useState<GameMode>("create");
    const [isGameWon, setIsGameWon] = useState<boolean>(false);

    const startPlaying = useCallback(async (
        sudoku: Sudoku,
        setSudoku: (sudoku: Sudoku) => void,
        headers: any,
        validateSudokuGrid: () => { valid: boolean; message: string }
    ) => {
        if (/^0+$/.test(sudoku.grid)) {
            notifyError("Cannot start playing with an empty grid!");
            return;
        }

        const validation = validateSudokuGrid();
        if (!validation.valid) {
            notifyError(validation.message);
            return;
        }

        const createSudokuResponse = await createSudoku(headers, sudoku.grid);
        if (createSudokuResponse?.ok) {
            setMode("display");
            const sudokuData = await createSudokuResponse.json() as Sudoku;
            setSudoku(sudokuData);
            solveSudoku(headers, sudokuData.id);
        }
    }, []);

    const abortGame = useCallback(async (sudokuId: string, headers: any) => {
        const abortSolvingResponse = await abortSolving(headers, sudokuId);
        if (!abortSolvingResponse?.ok) {
            notifyError("Failed to abort solving");
        } else {
            setMode("create");
        }
    }, []);

    const completeGame = useCallback((won: boolean) => {
        setIsGameWon(won);
        setMode("completed");
    }, []);

    const startNewGame = useCallback(() => {
        setMode("create");
        setIsGameWon(false);
    }, []);

    const startPlayMode = useCallback(() => {
        setMode("play");
    }, []);

    return {
        mode,
        isGameWon,
        startPlaying,
        abortGame,
        completeGame,
        startNewGame,
        startPlayMode,
    };
};
