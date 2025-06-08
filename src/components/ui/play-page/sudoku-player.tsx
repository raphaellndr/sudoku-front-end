import { useMemo, useState } from "react";

import { Box, Button, HStack, VStack } from "@chakra-ui/react";

import { notifyError } from "@/toasts/toast";
import { GameRecord, Sudoku } from "@/types/types";
import { abortSolving, createSudoku, solveSudoku } from "@/services/sudokusApi";
import { createGame } from "@/services/gamesApi";
import { useSudokuPlayer } from "./use-sudoku-player";
import CompletionDialog from "./completion-dialog";
import Timer from "./timer";
import { HintButton, MAX_HINTS } from "./buttons/hint-button";
import { CheckButton, MAX_CHECKS } from "./buttons/check-button";
import { useTimer } from "../use-timer";
import { useSudoku } from "../sudoku/use-sudoku";
import { useSudokuWebSocket } from "../sudoku/use-sudoku-websocket";
import { SudokuCreatorGrid } from "../sudoku/grid/sudoku-creator-grid";
import { SudokuGameGrid } from "../sudoku/grid/sudoku-game-grid";
import { ReadOnlySudokuGrid } from "../sudoku/grid/read-only-sudoku-grid";
import { calculateScore } from "@/utils/score";
import { GameStatusEnum } from "@/types/enums";

export type Cell = {
    position: [number, number];
    value: string;
    isHint: boolean;
    isVerified: boolean;
};

const SudokuPlayer = () => {
    // Game mode state
    const [mode, setMode] = useState<"create" | "display" | "play" | "solved">("create");

    // Grid state
    const [grid, setGrid] = useState<Cell[]>([]);

    // Backtracking state
    const [cellDeletionCount, setCellDeletionCount] = useState(0);

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

    // Sudoku state from custom hook
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, validateSudokuGrid, headers } = useSudoku();

    // Timestamps states
    const [startDate, setStartDate] = useState<Date>(new Date());

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
    } = useSudokuPlayer({
        grid: grid,
        setGrid: setGrid,
        sudoku: sudoku,
        onPuzzleSolved: () => {
            setIsTimerRunning(false);

            const endDate = new Date();
            const score = calculateScore(remainingHints, remainingChecks, cellDeletionCount, timer);
            const gameData: GameRecord = {
                sudoku_id: sudoku.id,
                score: score,
                hints_used: 3,
                checks_used: MAX_CHECKS - remainingChecks,
                deletions: cellDeletionCount,
                time_taken: timer,
                won: true,
                status: GameStatusEnum.Values.completed,
                original_puzzle: sudoku.grid,
                solution: sudoku.solution ? sudoku.solution.grid : "",
                final_state: grid.map(cell => cell.value).join(""),
                started_at: startDate.toISOString(),
                completed_at: endDate.toISOString(),
            };
            createGame(headers, gameData);

            setMode("solved");
            setIsDialogOpen(true);
        },
        onPuzzleUnsolved: () => {
            setIsTimerRunning(false);

            const endDate = new Date();
            const score = calculateScore(remainingHints, remainingChecks, cellDeletionCount, timer);
            const gameData: GameRecord = {
                sudoku_id: sudoku.id,
                score: score,
                hints_used: 3,
                checks_used: MAX_CHECKS - remainingChecks,
                deletions: cellDeletionCount,
                time_taken: timer,
                won: false,
                status: GameStatusEnum.Values.completed,
                original_puzzle: sudoku.grid,
                solution: sudoku.solution ? sudoku.solution.grid : "",
                final_state: grid.map(cell => cell.value).join(""),
                started_at: startDate.toISOString(),
                completed_at: endDate.toISOString(),
            };
            createGame(headers, gameData);

            setMode("display");
            setIsDialogOpen(true);
        },
    });

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
                setStartDate(new Date());
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
                                            setCellDeletionCount={setCellDeletionCount}
                                        />
                                    );
                                case "solved":
                                case "display":
                                    return (
                                        <ReadOnlySudokuGrid sudoku={sudoku} isLoading={isLoading} />
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
                        {!isLoading && (
                            <Button
                                disabled={!/[1-9]/.test(sudoku.grid)}
                                onClick={handleStartPlaying}
                            >
                                Start playing
                            </Button>
                        )}
                    </HStack>
                )}

                {(mode === "display" && isLoading) && (
                    <HStack gap={2}>
                        <Button
                            variant="outline"
                            colorPalette="red"
                            onClick={handleAbortButton}
                        >
                            Cancel
                        </Button>
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
                cellDeletionCount={cellDeletionCount}
                won={mode === "solved"}
            />
        </Box>
    );
};

export default SudokuPlayer;
