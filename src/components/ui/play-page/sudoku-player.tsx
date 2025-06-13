import { useMemo, useState, useCallback } from "react";

import { useSession } from "next-auth/react";
import { Box, Button, HStack, VStack } from "@chakra-ui/react";

import { notifyError } from "@/toasts/toast";
import { abortSolving, createSudoku, solveSudoku } from "@/services/sudokusApi";
import { createGame } from "@/services/gamesApi";
import { calculateScore } from "@/utils/score";
import { GameStatusEnum } from "@/enums/games";
import { useSudokuPlayer } from "@/hooks/use-sudoku-player";
import { useSudoku } from "@/hooks/use-sudoku";
import { useSudokuWebSocket } from "@/hooks/use-sudoku-websocket";
import { useTimer } from "@/hooks/use-timer";
import { GameRecord } from "@/types/games";
import { Sudoku } from "@/types/sudoku";

import Timer from "./timer";
import { HintButton, MAX_HINTS } from "./buttons/hint-button";
import { CheckButton, MAX_CHECKS } from "./buttons/check-button";
import CompletionDialog from "./completion/completion-dialog";
import { SudokuCreatorGrid } from "../sudoku/grid/sudoku-creator-grid";
import { SudokuGameGrid } from "../sudoku/grid/sudoku-game-grid";
import PlayerResultGrid from "../sudoku/grid/player-result-grid";
import DisplayGrid from "../sudoku/grid/display-grid";

export type Cell = {
    position: [number, number];
    value: string;
    isHint: boolean;
    isVerified: boolean;
};

const SudokuPlayer = () => {
    // Session state
    const { data: session } = useSession();

    // Game mode state
    const [mode, setMode] = useState<"create" | "display" | "play" | "completed">("create");
    const [isGameWon, setIsGameWon] = useState<boolean>(false);

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
        setIsPaused: setIsTimerPaused,
    } = useTimer();

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Timestamps states
    const [startDate, setStartDate] = useState<Date>(new Date());

    // Sudoku state from custom hook
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, validateSudokuGrid, headers } = useSudoku();

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
            setIsGameWon(true);
            setIsTimerRunning(false);

            if (session) {
                const endDate = new Date();
                const score = calculateScore(remainingHints, remainingChecks, cellDeletionCount, timer);
                const gameData: GameRecord = {
                    sudoku_id: sudoku.id,
                    score: score,
                    hints_used: MAX_HINTS - remainingHints,
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
            }

            setMode("completed");
            setIsDialogOpen(true);
        },
        onPuzzleUnsolved: () => {
            setIsGameWon(false);
            setIsTimerRunning(false);

            if (session) {
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
            }

            setMode("completed");
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

    // Boolean whether a player has entered a value or not
    const hasPlayerEnteredValues = useMemo(() => {
        return grid.some(cell => {
            const index = cell.position[0] * 9 + cell.position[1];
            const isOriginalValue = sudoku.grid[index] !== "0";
            return cell.value !== "0" && cell.value !== "" && !cell.isHint && !isOriginalValue;
        });
    }, [grid, sudoku.grid]);

    // Handle create and play flow
    const handleStartPlaying = useCallback(async () => {
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
    }, [sudoku.grid, headers, validateSudokuGrid]);

    // Handler for abort button
    const handleAbortButton = useCallback(async () => {
        if (sudoku.id) {
            const abortSolvingResponse = await abortSolving(headers, sudoku.id);
            if (!abortSolvingResponse?.ok) {
                notifyError("Failed to abort solving");
            } else {
                setMode("create");
            }
        }
    }, [sudoku.id, headers]);

    // Handler for give up button
    const handleGiveUpButton = useCallback(() => {
        if (session) {
            const endDate = new Date();
            const gameData: GameRecord = {
                sudoku_id: sudoku.id,
                score: 0,
                hints_used: 3,
                checks_used: MAX_CHECKS - remainingChecks,
                deletions: cellDeletionCount,
                time_taken: timer,
                won: false,
                status: GameStatusEnum.Values.abandoned,
                original_puzzle: sudoku.grid,
                solution: sudoku.solution ? sudoku.solution.grid : "",
                final_state: grid.map(cell => cell.value).join(""),
                started_at: startDate.toISOString(),
                completed_at: endDate.toISOString(),
            };
            createGame(headers, gameData);
        }

        revealSolution();
        resetTimer();
        setMode("completed");
    }, [session, sudoku, remainingChecks, cellDeletionCount, timer, grid, startDate, headers]);

    // Reset everything for a new puzzle
    const startNewPuzzle = useCallback(() => {
        clearSudokuGrid();
        setMode("create");
        resetTimer();
    }, [clearSudokuGrid, resetTimer]);

    // Reset the current puzzle
    const handleRestartPuzzle = useCallback(() => {
        resetPlayerGrid();
        restartTimer();
    }, [resetPlayerGrid, restartTimer]);

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
                                            onCellChange={handlePlayerCellChange}
                                            onCellVerify={verifyCellValue}
                                            isPaused={isPaused}
                                            setIsPaused={setIsTimerPaused}
                                            setCellDeletionCount={setCellDeletionCount}
                                        />
                                    );
                                case "completed":
                                    return (
                                        <PlayerResultGrid sudoku={sudoku} grid={grid} isLoading={isLoading} won={isGameWon} />
                                    );
                                case "display":
                                    return (
                                        <DisplayGrid sudoku={sudoku} isLoading={isLoading} />
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
                                onClick={handleGiveUpButton}
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

                {mode === "display" && isLoading && (
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

                <HStack gap={2}>
                    {mode === "completed" && !isGameWon && (
                        <Button
                            variant="subtle"
                            colorPalette="green"
                            onClick={revealSolution}
                        >
                            Reveal solution
                        </Button>
                    )}
                    {mode === "completed" && (
                        <Button
                            variant="solid"
                            onClick={startNewPuzzle}
                        >
                            New puzzle
                        </Button>
                    )}
                </HStack>
            </VStack>

            <CompletionDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                timer={timer}
                remainingHints={remainingHints}
                clearSudokuGrid={startNewPuzzle}
                cellDeletionCount={cellDeletionCount}
                won={isGameWon}
            />
        </Box>
    );
};

export default SudokuPlayer;
