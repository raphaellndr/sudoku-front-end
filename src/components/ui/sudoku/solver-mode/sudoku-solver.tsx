import { useState } from "react";

import { Box, Button, HStack, VStack } from "@chakra-ui/react";

import { BaseSudokuGrid } from "../base-sudoku-grid";
import { useSudoku } from "../use-sudoku";
import { createSudoku, solveSudoku, abortSolving } from "../sudoku-api";
import { useSudokuWebSocket } from "../use-sudoku-websocket";
import { SudokuStatusEnum } from "@/types/enums";

const SudokuSolver = () => {
    // Mode state
    const [mode, setMode] = useState<"create" | "display">("create");

    // Button state
    const [disableSolveButton, setDisableSolveButton] = useState(false);

    // Sudoku state from custom hook
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, headers } = useSudoku();

    // WebSocket connection for status updates
    const { isLoading } = useSudokuWebSocket(
        sudoku.id || null,
        headers,
        setSudoku,
        {
            onStatusChange: (status) => {
                if (status === SudokuStatusEnum.Values.completed) {
                    setDisableSolveButton(false);
                }
            },
            onComplete: () => {
                setMode("display");
            }
        }
    );

    // Handler for solve button
    const handleSolveSudoku = async () => {
        const sudokuId = await createSudoku(sudoku.grid, headers, setSudoku);
        if (sudokuId) {
            setDisableSolveButton(true);
            setMode("display");
            const success = await solveSudoku(sudokuId, headers);
            if (!success) {
                setDisableSolveButton(false);
            }
        }
    };

    // Handler for abort button
    const handleAbortButton = async () => {
        if (sudoku.id) {
            await abortSolving(sudoku.id, headers);
        }
    };

    return (
        <Box p={5}>
            <VStack>
                {mode === "create" ? (
                    <BaseSudokuGrid
                        mode="create"
                        sudoku={sudoku}
                        onCellChange={handleCellChange}
                    />
                ) : (
                    <BaseSudokuGrid
                        mode="display"
                        sudoku={sudoku}
                        onCellChange={handleCellChange}
                    />
                )}
                <HStack>
                    <Button
                        disabled={!/[1-9]/.test(sudoku.grid) || [SudokuStatusEnum.Values.running, SudokuStatusEnum.Values.pending].includes(sudoku.status as any)}
                        colorPalette="red"
                        variant="outline"
                        onClick={() => {
                            clearSudokuGrid();
                            setMode("create");
                            setDisableSolveButton(false);
                        }}>
                        Clear grid
                    </Button>
                    <Button
                        disabled={![SudokuStatusEnum.Values.running, SudokuStatusEnum.Values.pending].includes(sudoku.status as any)}
                        colorPalette="red"
                        variant="outline"
                        onClick={handleAbortButton}
                    >
                        Abort solving
                    </Button>
                    <Button
                        disabled={disableSolveButton}
                        colorPalette="blue"
                        variant="subtle"
                        loadingText="Solving sudoku..."
                        loading={isLoading || sudoku.status === SudokuStatusEnum.Values.running}
                        onClick={handleSolveSudoku}
                    >
                        Solve sudoku
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default SudokuSolver;