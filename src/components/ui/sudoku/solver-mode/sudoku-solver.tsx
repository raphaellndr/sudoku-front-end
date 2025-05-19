import { useEffect, useState } from "react";

import { Box, Button, HStack, VStack } from "@chakra-ui/react";

import { useSudoku } from "../use-sudoku";
import { createSudoku, solveSudoku, abortSolving } from "../sudoku-api";
import { useSudokuWebSocket } from "../use-sudoku-websocket";
import { SudokuStatusEnum } from "@/types/enums";
import { SudokuCreatorGrid } from "../grid/sudoku-creator-grid";
import { ReadOnlySudokuGrid } from "../grid/read-only-sudoku-grid";
import { notifyError } from "@/toasts/toast";
import { Sudoku } from "@/types/types";
import { useColorModeValue } from "../../color-mode";

const SudokuSolver = () => {
    // Sudoku state from custom hook
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, validateSudokuGrid, headers } = useSudoku();

    // Mode state
    const [mode, setMode] = useState<"create" | "display">("create");

    // Buttons state
    const [disableSolveButton, setDisableSolveButton] = useState(!/[1-9]/.test(sudoku.grid));
    const disableClearButton =
        !/[1-9]/.test(sudoku.grid) ||
        [SudokuStatusEnum.Values.running, SudokuStatusEnum.Values.pending].includes(sudoku.status as any)
    const disableAbortButton =
        ![SudokuStatusEnum.Values.running, SudokuStatusEnum.Values.pending].includes(sudoku.status as any)

    // Color mode values
    const bgColor = useColorModeValue("gray.100", "gray.800");
    const boxShadow = useColorModeValue("0 4px 12px rgba(0, 0, 0, 0.05)", "0 4px 12px rgba(0, 0, 0, 0.2)");

    useEffect(() => {
        setDisableSolveButton(!/[1-9]/.test(sudoku.grid));
    }, [sudoku.grid])

    // WebSocket connection for status updates
    const { isLoading } = useSudokuWebSocket(
        sudoku.id || null,
        headers,
        setSudoku,
        {
            onComplete: () => {
                setMode("display");
                setDisableSolveButton(true);
            }
        }
    );

    const handleClearButton = () => {
        clearSudokuGrid();
        setMode("create");
        setDisableSolveButton(false);
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
            setDisableSolveButton(true);
            setMode("display");

            const sudoku = await createSudokuResponse.json() as Sudoku;
            setSudoku(sudoku);

            const solveSudokuResponse = await solveSudoku(sudoku.id, headers);
            if (solveSudokuResponse?.ok) {
                setDisableSolveButton(false);
            }
        }
    };

    // Handler for abort button
    const handleAbortButton = async () => {
        if (sudoku.id) {
            const abortSolvingResponse = await abortSolving(sudoku.id, headers);
            if (!abortSolvingResponse?.ok) {
                notifyError("Failed to abort solving")
            }
        };
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
                </Box>
                <HStack>
                    <Button
                        disabled={disableClearButton}
                        variant="outline"
                        onClick={handleClearButton}
                    >
                        Clear grid
                    </Button>
                    {isLoading && (
                        <Button
                            disabled={disableAbortButton}
                            variant="outline"
                            onClick={handleAbortButton}
                        >
                            Abort solving
                        </Button>
                    )}
                    <Button
                        disabled={disableSolveButton}
                        loadingText="Solving..."
                        loading={isLoading}
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
