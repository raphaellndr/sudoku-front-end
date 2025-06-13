import { useState } from "react";

import { Box, Button, HStack, VStack } from "@chakra-ui/react";

import { notifyError } from "@/toasts/toast";
import { Sudoku } from "@/types/types";
import { abortSolving, createSudoku, solveSudoku } from "@/services/sudokusApi";
import { useSudokuWebSocket } from "@/hooks/use-sudoku-websocket";
import { useSudoku } from "@/hooks/use-sudoku";

import { SudokuCreatorGrid } from "../sudoku/grid/sudoku-creator-grid";
import DisplayGrid from "../sudoku/grid/display-grid";

const SudokuSolver = () => {
    // Sudoku state from custom hook
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, validateSudokuGrid, headers } = useSudoku();

    // Mode state
    const [mode, setMode] = useState<"create" | "display" | "solved">("create");

    // WebSocket connection for status updates
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

    const handleClearButton = () => {
        clearSudokuGrid();
        setMode("create");
    }

    // Handler for solve button
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

            const sudoku = await createSudokuResponse.json() as Sudoku;
            setSudoku(sudoku);
            solveSudoku(headers, sudoku.id);
        }
    };

    // Handler for abort button
    const handleAbortButton = async () => {
        if (sudoku.id) {
            const abortSolvingResponse = await abortSolving(headers, sudoku.id);
            if (!abortSolvingResponse?.ok) {
                notifyError("Failed to abort solving");
            } else {
                setMode("create");
            }
        };
    };

    // Reset everything for a new puzzle
    const startNewPuzzle = () => {
        clearSudokuGrid();
        setMode("create");
    };

    return (
        <Box p="5">
            <VStack gap="4">
                {mode === "create" ? (
                    <SudokuCreatorGrid sudoku={sudoku} onCellChange={handleCellChange} />
                ) : (
                    <DisplayGrid sudoku={sudoku} isLoading={isLoading} />
                )}
                <HStack>
                    {mode !== "solved" ? (
                        <>
                            {!(!/[1-9]/.test(sudoku.grid) || isLoading) && (
                                <Button
                                    variant="outline"
                                    onClick={handleClearButton}
                                >
                                    Clear grid
                                </Button>
                            )}
                            {isLoading && (
                                <Button
                                    variant="outline"
                                    colorPalette="red"
                                    onClick={handleAbortButton}
                                >
                                    Abort solving
                                </Button>
                            )}
                            {!isLoading && (
                                <Button
                                    disabled={!/[1-9]/.test(sudoku.grid)}
                                    onClick={handleSolveSudoku}
                                >
                                    Solve sudoku
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button
                            variant="solid"
                            onClick={startNewPuzzle}
                        >
                            New puzzle
                        </Button>
                    )}
                </HStack>
            </VStack>
        </Box>
    );
};

export default SudokuSolver;
