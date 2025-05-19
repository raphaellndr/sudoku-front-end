import { useState } from "react";

import { Box, Button, HStack, VStack } from "@chakra-ui/react";

import { notifyError } from "@/toasts/toast";
import { Sudoku } from "@/types/types";
import { useSudoku } from "../use-sudoku";
import { createSudoku, solveSudoku, abortSolving } from "../sudoku-api";
import { useSudokuWebSocket } from "../use-sudoku-websocket";
import { SudokuCreatorGrid } from "../grid/sudoku-creator-grid";
import { ReadOnlySudokuGrid } from "../grid/read-only-sudoku-grid";
import { useColorModeValue } from "../../color-mode";
import { LoadingStatus } from "../play-mode/loading-status";

const SudokuSolver = () => {
    // Sudoku state from custom hook
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, validateSudokuGrid, headers } = useSudoku();

    // Mode state
    const [mode, setMode] = useState<"create" | "display" | "solved">("create");

    // Color mode values
    const bgColor = useColorModeValue("gray.100", "gray.800");
    const boxShadow = useColorModeValue("0 4px 12px rgba(0, 0, 0, 0.05)", "0 4px 12px rgba(0, 0, 0, 0.2)");

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

        const createSudokuResponse = await createSudoku(sudoku.grid, headers);
        if (createSudokuResponse?.ok) {
            setMode("display");

            const sudoku = await createSudokuResponse.json() as Sudoku;
            setSudoku(sudoku);
            solveSudoku(sudoku.id, headers);
        }
    };

    // Handler for abort button
    const handleAbortButton = async () => {
        if (sudoku.id) {
            const abortSolvingResponse = await abortSolving(sudoku.id, headers);
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
                <Box
                    borderRadius="xl"
                    boxShadow={boxShadow}
                    bg={bgColor}
                    p="4"
                    pos="relative"
                >
                    {mode === "create" ? (
                        <SudokuCreatorGrid sudoku={sudoku} onCellChange={handleCellChange} />
                    ) : (
                        <ReadOnlySudokuGrid sudoku={sudoku} />
                    )}
                    {isLoading && (<LoadingStatus />)}
                </Box>
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
