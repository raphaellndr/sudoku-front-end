import { useState } from "react";

import { Box, Button, HStack, VStack } from "@chakra-ui/react";

import { usePlayerGrid } from "./use-player-grid";
import CompletionDialog from "./completion-dialog";
import { useTimer } from "./timer/use-timer";
import Timer from "./timer/timer";
import { HintButton } from "./hint-button";
import { UndoButton } from "./undo-button";
import { BaseSudokuGrid } from "../base-sudoku-grid";
import { useSudoku } from "../use-sudoku";
import { createSudoku, solveSudoku } from "../sudoku-api";
import { useSudokuWebSocket } from "../use-sudoku-websocket";
import { useColorModeValue } from "../../color-mode";

const SudokuPlayer = () => {
    // Game mode state
    const [mode, setMode] = useState<"create" | "play" | "solved">("create");

    // Loading state
    const [disableButtons, setDisableButtons] = useState(false);

    // Timer state from custom hook
    const {
        timer,
        setTimer,
        isActive: isTimerRunning,
        setIsActive: setIsTimerRunning,
        timerRef
    } = useTimer();

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Color mode values
    const bgColor = useColorModeValue("gray.100", "gray.800");
    const boxShadow = useColorModeValue("0 4px 12px rgba(0, 0, 0, 0.05)", "0 4px 12px rgba(0, 0, 0, 0.2)");

    // Sudoku state from custom hook
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, headers } = useSudoku();

    // Player grid state from custom hook
    const {
        playerGrid,
        remainingHints,
        remainingUndos,
        handleCellChange: handlePlayerCellChange,
        giveHint,
        undoMove,
        resetPlayerGrid,
        checkProgress,
        revealSolution,
        canUndo
    } = usePlayerGrid(sudoku.grid, () => {
        setIsTimerRunning(false);
        setMode("solved");
        setIsDialogOpen(true);
    });

    // WebSocket connection for status updates
    useSudokuWebSocket(
        sudoku.id,
        headers,
        setSudoku,
        {
            onComplete: () => {
                setDisableButtons(false);
                resetPlayerGrid(sudoku.grid);
                setMode("play");
                setIsTimerRunning(true);
            }
        }
    );

    // Handle create and play flow
    const handleStartPlaying = async () => {
        const sudokuId = await createSudoku(sudoku.grid, headers, setSudoku);
        if (sudokuId) {
            setDisableButtons(true);
            const success = await solveSudoku(sudokuId, headers);
            if (!success) {
                setDisableButtons(false);
            }
        }
    };

    // Reset everything for a new puzzle
    const startNewPuzzle = () => {
        clearSudokuGrid();
        setMode("create");
        setDisableButtons(false);
        setTimer(0);
        setIsTimerRunning(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    // Reset the current puzzle
    const handleRestartPuzzle = () => {
        resetPlayerGrid(sudoku.grid);
        setTimer(0);
        setIsTimerRunning(true);
        setMode("play");
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
                                            <BaseSudokuGrid
                                                mode="create"
                                                sudoku={sudoku}
                                                onCellChange={handleCellChange}
                                            />
                                        );
                                    case "play":
                                        return (
                                            <BaseSudokuGrid
                                                mode="play"
                                                sudoku={{
                                                    ...sudoku,
                                                    grid: playerGrid,
                                                }}
                                                onCellChange={(r, c, v) => handlePlayerCellChange(r, c, v, sudoku)}
                                            />
                                        );
                                    case "solved":
                                        return (
                                            <BaseSudokuGrid
                                                mode="display"
                                                sudoku={{
                                                    ...sudoku,
                                                    grid: playerGrid,
                                                }}
                                                onCellChange={() => { }}
                                            />
                                        );
                                }
                            })()}
                            {mode === "play" && (
                                <VStack gap="4" align="stretch">
                                    <Timer
                                        timer={timer}
                                        isActive={isTimerRunning}
                                        setIsActive={setIsTimerRunning}
                                    />
                                    <UndoButton canUndo={canUndo} remainingUndos={remainingUndos} undoMove={undoMove} />
                                    <HintButton sudoku={sudoku} remainingHints={remainingHints} handleHint={giveHint} />
                                    <Button
                                        variant="solid"
                                        onClick={handleRestartPuzzle}
                                    >
                                        Restart
                                    </Button>
                                </VStack>
                            )}
                        </HStack>
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
                                colorPalette="blue"
                                variant="outline"
                                onClick={() => checkProgress(sudoku)}
                            >
                                Check progress
                            </Button>
                            <Button
                                colorPalette="red"
                                variant="solid"
                                onClick={() => {
                                    revealSolution(sudoku);
                                    setIsTimerRunning(false);
                                    setMode("solved");
                                }}
                            >
                                Give up
                            </Button>
                        </HStack>
                    )}
                </VStack>

                <HStack gap={4} flexWrap="wrap" justifyContent="center">
                    {mode === "create" && (
                        <>
                            <Button
                                disabled={!/[1-9]/.test(sudoku.grid) || disableButtons}
                                variant="outline"
                                onClick={clearSudokuGrid}
                            >
                                Clear grid
                            </Button>
                            <Button
                                disabled={disableButtons}
                                loading={disableButtons}
                                loadingText="Preparing puzzle..."
                                onClick={handleStartPlaying}
                            >
                                Start playing
                            </Button>
                        </>
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
                </HStack>
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