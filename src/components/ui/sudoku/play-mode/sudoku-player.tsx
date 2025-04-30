import { useRef, useState } from "react";

import { Box, Button, HStack, VStack, Badge } from "@chakra-ui/react";

import { usePlayerGrid } from "./use-player-grid";
import CompletionDialog from "./completion-dialog";
import Timer from "./timer";
import { BaseSudokuGrid } from "../base-sudoku-grid";
import { useSudoku } from "../use-sudoku";
import { createSudoku, solveSudoku } from "../sudoku-api";
import { useSudokuWebSocket } from "../use-sudoku-websocket";

const SudokuPlayer = () => {
    // Game mode state
    const [mode, setMode] = useState<"create" | "play" | "solved">("create");

    // Loading state
    const [disableButtons, setDisableButtons] = useState(false);

    // Timer state
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Sudoku state from custom hook
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, headers } = useSudoku();

    // Player grid state from custom hook
    const {
        playerGrid,
        hintsUsed,
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
                {/* Game status information */}
                {mode !== "create" && (
                    <HStack width="100%" justifyContent="space-between" px={4}>
                        <Timer
                            timerRef={timerRef}
                            timer={timer}
                            setTimer={setTimer}
                            isTimerRunning={isTimerRunning}
                        />
                        {hintsUsed > 0 && (
                            <Badge colorPalette="purple" fontSize="md" p={2} borderRadius="md">
                                Hints used: {hintsUsed}
                            </Badge>
                        )}
                    </HStack>
                )}

                {/* Sudoku Grid */}
                <VStack gap="4">
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
                                <Button
                                    colorPalette="orange"
                                    variant="outline"
                                    onClick={handleRestartPuzzle}
                                >
                                    Restart
                                </Button>
                                <Button
                                    colorPalette="teal"
                                    variant="outline"
                                    onClick={undoMove}
                                    disabled={!canUndo}
                                    title={!canUndo ? "Cannot undo hints" : ""}
                                >
                                    Undo
                                </Button>
                                <Button
                                    colorPalette="purple"
                                    variant="outline"
                                    onClick={() => giveHint(sudoku)}
                                >
                                    Hint
                                </Button>
                            </VStack>
                        )}
                    </HStack>
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

                {/* Controls */}
                <HStack gap={4} flexWrap="wrap" justifyContent="center">
                    {mode === "create" && (
                        <>
                            <Button
                                disabled={!/[1-9]/.test(sudoku.grid) || disableButtons}
                                colorPalette="red"
                                variant="outline"
                                onClick={clearSudokuGrid}
                            >
                                Clear grid
                            </Button>
                            <Button
                                disabled={disableButtons}
                                colorPalette="blue"
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
                                colorPalette="green"
                                variant="outline"
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
                hintsUsed={hintsUsed}
                clearSudokuGrid={startNewPuzzle}
            />
        </Box>
    );
};

export default SudokuPlayer;