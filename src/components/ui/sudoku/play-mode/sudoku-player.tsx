import { useMemo, useState } from "react";
import { Box, Button, HStack, VStack, Spinner, Float } from "@chakra-ui/react";

import { notifyError } from "@/toasts/toast";
import { Sudoku } from "@/types/types";
import { useSudokuPlayer } from "./use-sudoku-player";
import CompletionDialog from "./completion-dialog";
import { useTimer } from "./timer/use-timer";
import Timer from "./timer/timer";
import { HintButton } from "./buttons/hint-button";
import { CheckButton } from "./buttons/check-button";
import { useSudoku } from "../use-sudoku";
import { abortSolving, createSudoku, solveSudoku } from "../sudoku-api";
import { useSudokuWebSocket } from "../use-sudoku-websocket";
import { useColorModeValue } from "../../color-mode";
import { SudokuCreatorGrid } from "../grid/sudoku-creator-grid";
import { SudokuGameGrid } from "../grid/sudoku-game-grid";
import { ReadOnlySudokuGrid } from "../grid/read-only-sudoku-grid";
import { Tooltip } from "../../tooltip";

export type Cell = {
    position: [number, number];
    value: string;
    isHint: boolean;
    isVerified: boolean;
};

const SudokuPlayer = () => {
    // Game mode state
    const [mode, setMode] = useState<"create" | "play" | "solved">("create");

    // Grid state
    const [grid, setGrid] = useState<Cell[]>([])

    // Timer state from custom hook
    const {
        timer,
        resetTimer,
        restartTimer,
        setIsActive: setIsTimerRunning,
        isPaused,
        setIsPaused: setIsTimerPaused
    } = useTimer();

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Color mode values
    const bgColor = useColorModeValue("gray.100", "gray.800");
    const boxShadow = useColorModeValue("0 4px 12px rgba(0, 0, 0, 0.05)", "0 4px 12px rgba(0, 0, 0, 0.2)");

    // Sudoku state from custom hook
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, validateSudokuGrid, headers } = useSudoku();

    // Boolean whether a player has entered a value or not
    const hasPlayerEnteredValues = useMemo(() => {
        return grid.some(cell => {
            const index = cell.position[0] * 9 + cell.position[1];
            const isOriginalValue = sudoku.grid[index] !== "0";
            return cell.value !== "0" && cell.value !== "" && !cell.isHint && !isOriginalValue;
        });
    }, [grid, sudoku.grid]);

    // Player grid state from custom hook
    const {
        remainingHints,
        remainingChecks,
        isCheckModeActive,
        setIsCheckModeActive,
        handleCellChange: handlePlayerCellChange,
        giveHint,
        toggleCheckMode,
        verifyCellValue,
        resetPlayerGrid,
        revealSolution,
    } = useSudokuPlayer(
        grid,
        setGrid,
        sudoku,
        () => {
            setIsTimerRunning(false);
            setMode("solved");
            setIsDialogOpen(true);
        }
    );

    // WebSocket connection for status updates
    const { isLoading } = useSudokuWebSocket(
        sudoku.id,
        headers,
        setSudoku,
        {
            onComplete: () => {
                resetPlayerGrid();
                setMode("play");
                setIsTimerRunning(true);
            }
        }
    );

    // Handle create and play flow
    const handleStartPlaying = async () => {
        if (/^0+$/.test(sudoku.grid)) {
            notifyError("Cannot start playing with an empty grid!");
            return;
        }

        const validation = validateSudokuGrid();
        if (!validation.valid) {
            notifyError(validation.message);
            return;
        }

        const createSudokuResponse = await createSudoku(sudoku.grid, headers);
        if (createSudokuResponse?.ok) {
            const sudoku = await createSudokuResponse.json() as Sudoku;
            setSudoku(sudoku);

            const solveSudokuResponse = await solveSudoku(sudoku.id, headers);
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

    // Reset everything for a new puzzle
    const startNewPuzzle = () => {
        clearSudokuGrid();
        setMode("create");
        resetTimer();
    };

    // Reset the current puzzle
    const handleRestartPuzzle = () => {
        resetPlayerGrid();
        restartTimer();
    };

    return (
        <Box p={5}>
            <VStack gap={4}>
                <VStack gap="4">
                    <Box
                        borderRadius="xl"
                        boxShadow={boxShadow}
                        bg={bgColor}
                        p={4}
                        pos="relative"
                    >
                        <HStack gap="4">
                            {(() => {
                                switch (mode) {
                                    case "create":
                                        return (
                                            <SudokuCreatorGrid sudoku={sudoku} onCellChange={handleCellChange} />
                                        );
                                    case "play":
                                        return (
                                            <SudokuGameGrid
                                                sudoku={sudoku}
                                                grid={grid}
                                                setGrid={setGrid}
                                                isCheckModeActive={isCheckModeActive}
                                                setIsCheckModeActive={setIsCheckModeActive}
                                                onCellChange={(p, v) => handlePlayerCellChange(p, v)}
                                                onCellVerify={verifyCellValue}
                                                isPaused={isPaused}
                                                setIsPaused={setIsTimerPaused}
                                            />
                                        );
                                    case "solved":
                                        return (
                                            <ReadOnlySudokuGrid sudoku={sudoku} />
                                        );
                                }
                            })()}
                            {mode === "play" && (
                                <VStack gap="4" align="stretch">
                                    <Timer
                                        timer={timer}
                                        isPaused={isPaused}
                                        setIsPaused={setIsTimerPaused}
                                    />
                                    <CheckButton
                                        remainingChecks={remainingChecks}
                                        canCheck={hasPlayerEnteredValues}
                                        isPaused={isPaused}
                                        onActivateCheckMode={toggleCheckMode}
                                        isCheckModeActive={isCheckModeActive}
                                    />
                                    <HintButton
                                        sudoku={sudoku}
                                        remainingHints={remainingHints}
                                        handleHint={giveHint}
                                        isPaused={isPaused}
                                        isCheckModeActive={isCheckModeActive}
                                    />
                                    <Button
                                        variant="solid"
                                        onClick={handleRestartPuzzle}
                                    >
                                        Restart
                                    </Button>
                                </VStack>
                            )}
                        </HStack>
                        {isLoading && (
                            <Tooltip content="Generating puzzle">
                                <Float>
                                    <Spinner size="sm" />
                                </Float>
                            </Tooltip>
                        )}
                    </Box>
                    {mode === "play" && (
                        <HStack gap="4">
                            <Button
                                colorPalette="red"
                                variant="outline"
                                onClick={startNewPuzzle}
                            >
                                New puzzle
                            </Button>
                            <Button
                                colorPalette="red"
                                variant="solid"
                                onClick={() => {
                                    revealSolution();
                                    resetTimer();
                                    setMode("solved");
                                }}
                            >
                                Give up
                            </Button>
                        </HStack>
                    )}
                </VStack>

                {mode === "create" && (
                    <HStack gap={4} flexWrap="wrap" justifyContent="center">
                        {!(!/[1-9]/.test(sudoku.grid) || isLoading) && (
                            <Button
                                variant="outline"
                                onClick={clearSudokuGrid}
                            >
                                Clear grid
                            </Button>
                        )}
                        {isLoading && (
                            <HStack gap={2}>
                                <Button
                                    variant="outline"
                                    colorPalette="red"
                                    onClick={handleAbortButton}
                                >
                                    Cancel puzzle generation
                                </Button>
                            </HStack>
                        )}
                        {!isLoading && (
                            <Button onClick={handleStartPlaying}> Start playing </Button>
                        )}
                    </HStack>
                )}

                {mode === "solved" && (
                    <>
                        <Button
                            variant="solid"
                            onClick={startNewPuzzle}
                        >
                            New puzzle
                        </Button>
                    </>
                )}
            </VStack>

            <CompletionDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                timer={timer}
                remainingHints={remainingHints}
                clearSudokuGrid={startNewPuzzle}
            />
        </Box>
    );
};

export default SudokuPlayer;
