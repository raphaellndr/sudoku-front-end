import { useState } from "react";

import { notifyError } from "@/toasts/toast";
import { Sudoku } from "@/types/types";
import { abortSolving, createSudoku, solveSudoku } from "@/services/sudokusApi";
import { useSudokuWebSocket } from "@/hooks/use-sudoku-websocket";
import { useSudoku } from "@/hooks/use-sudoku";

type SudokuMode = "create" | "display" | "solved";

export const useSudokuSolver = () => {
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, validateSudokuGrid, headers } = useSudoku();
    const [mode, setMode] = useState<SudokuMode>("create");

    const { isLoading } = useSudokuWebSocket(
        sudoku.id || null,
        headers,
        setSudoku,
        {
            onComplete: () => {
                setMode("solved");
            }
        }
    );

    const hasValidInput = !/^0+$/.test(sudoku.grid) && /[1-9]/.test(sudoku.grid);
    const isEmpty = !/[1-9]/.test(sudoku.grid);

    const handleSolveSudoku = async () => {
        if (/^0+$/.test(sudoku.grid)) {
            notifyError("Cannot solve a sudoku with an empty grid!");
            return;
        }

        const validation = validateSudokuGrid();
        if (!validation.valid) {
            notifyError(validation?.message);
            return;
        }

        const createSudokuResponse = await createSudoku(headers, sudoku.grid);
        if (createSudokuResponse?.ok) {
            setMode("display");
            const newSudoku = await createSudokuResponse.json() as Sudoku;
            setSudoku(newSudoku);
            solveSudoku(headers, newSudoku.id);
        }
    };

    const handleAbortSolving = async () => {
        if (sudoku.id) {
            const abortSolvingResponse = await abortSolving(headers, sudoku.id);
            if (!abortSolvingResponse?.ok) {
                notifyError("Failed to abort solving");
            } else {
                setMode("create");
            }
        }
    };

    const handleClearGrid = () => {
        clearSudokuGrid();
        setMode("create");
    };

    const startNewPuzzle = () => {
        clearSudokuGrid();
        setMode("create");
    };

    return {
        sudoku,
        mode,
        isLoading,
        hasValidInput,
        isEmpty,
        handleCellChange,
        handleSolveSudoku,
        handleAbortSolving,
        handleClearGrid,
        startNewPuzzle,
    };
};
