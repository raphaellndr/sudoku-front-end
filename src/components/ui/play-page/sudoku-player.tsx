import { useMemo, useState, useCallback } from "react";

import { Box, Button, HStack, VStack } from "@chakra-ui/react";

import { Cell } from "@/types/sudoku";
import { useSudokuPlayer } from "@/hooks/use-sudoku-player";
import { useSudoku } from "@/hooks/use-sudoku";
import { useSudokuWebSocket } from "@/hooks/use-sudoku-websocket";
import { useTimer } from "@/hooks/use-timer";
import { useGameManager } from "@/hooks/use-game-manager";
import { useSudokuGameFlow } from "@/hooks/use-sudoku-game-flow";
import { GameStatusEnum } from "@/enums/games";

import Timer from "./timer";
import { HintButton } from "./buttons/hint-button";
import { CheckButton } from "./buttons/check-button";
import CompletionDialog from "./completion/completion-dialog";
import { SudokuCreatorGrid } from "../sudoku/grid/sudoku-creator-grid";
import { SudokuGameGrid } from "../sudoku/grid/sudoku-game-grid";
import PlayerResultGrid from "../sudoku/grid/player-result-grid";
import DisplayGrid from "../sudoku/grid/display-grid";

const SudokuPlayer = () => {
    // Grid state
    const [grid, setGrid] = useState<Cell[]>([]);
    const [cellDeletionCount, setCellDeletionCount] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Custom hooks
    const { timer, resetTimer, restartTimer, setIsActive: setIsTimerRunning, isPaused, setIsPaused: setIsTimerPaused } = useTimer();
    const { sudoku, setSudoku, handleCellChange, clearSudokuGrid, validateSudokuGrid, headers } = useSudoku();
    const { createGameRecord, saveGame, resetStartDate } = useGameManager();
    const { mode, isGameWon, startPlaying, abortGame, completeGame, startNewGame, startPlayMode } = useSudokuGameFlow();

    // Player game logic
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
        grid,
        setGrid,
        sudoku,
        onPuzzleSolved: async () => {
            setIsTimerRunning(false);
            const gameData = createGameRecord(
                sudoku, grid, remainingHints, remainingChecks,
                cellDeletionCount, timer, true, GameStatusEnum.Values.completed
            );
            await saveGame(headers, gameData);
            completeGame(true);
            setIsDialogOpen(true);
        },
        onPuzzleUnsolved: async () => {
            setIsTimerRunning(false);
            const gameData = createGameRecord(
                sudoku, grid, remainingHints, remainingChecks,
                cellDeletionCount, timer, false, GameStatusEnum.Values.completed
            );
            await saveGame(headers, gameData);
            completeGame(false);
            setIsDialogOpen(true);
        },
    });

    // WebSocket connection
    const { isLoading } = useSudokuWebSocket(sudoku.id, headers, setSudoku, {
        onComplete: () => {
            resetPlayerGrid();
            startPlayMode();
            setIsTimerRunning(true);
            resetStartDate();
        }
    });

    // Computed values
    const hasPlayerEnteredValues = useMemo(() => {
        return grid.some(cell => {
            const index = cell.position[0] * 9 + cell.position[1];
            const isOriginalValue = sudoku.grid[index] !== "0";
            return cell.value !== "0" && cell.value !== "" && !cell.isHint && !isOriginalValue;
        });
    }, [grid, sudoku.grid]);

    // Event handlers
    const handleStartPlaying = useCallback(() => {
        startPlaying(sudoku, setSudoku, headers, validateSudokuGrid);
    }, [sudoku, setSudoku, headers, validateSudokuGrid, startPlaying]);

    const handleAbortButton = useCallback(() => {
        if (sudoku.id) {
            abortGame(sudoku.id, headers);
        }
    }, [sudoku.id, headers, abortGame]);

    const handleGiveUpButton = useCallback(async () => {
        const gameData = createGameRecord(
            sudoku, grid, remainingHints, remainingChecks,
            cellDeletionCount, timer, false, GameStatusEnum.Values.abandoned
        );
        await saveGame(headers, gameData);
        revealSolution();
        resetTimer();
        completeGame(false);
    }, [sudoku, grid, remainingHints, remainingChecks, cellDeletionCount, timer, headers, createGameRecord, saveGame, revealSolution, resetTimer, completeGame]);

    const handleStartNewPuzzle = useCallback(() => {
        clearSudokuGrid();
        startNewGame();
        resetTimer();
    }, [clearSudokuGrid, startNewGame, resetTimer]);

    const handleRestartPuzzle = useCallback(() => {
        resetPlayerGrid();
        restartTimer();
    }, [resetPlayerGrid, restartTimer]);

    // Render grid based on mode
    const renderGrid = () => {
        switch (mode) {
            case "create":
                return <SudokuCreatorGrid sudoku={sudoku} onCellChange={handleCellChange} />;
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
                return <PlayerResultGrid sudoku={sudoku} grid={grid} isLoading={isLoading} won={isGameWon} />;
            case "display":
                return <DisplayGrid sudoku={sudoku} isLoading={isLoading} />;
        }
    };

    return (
        <Box p={5}>
            <VStack gap={4}>
                <VStack gap="4">
                    <HStack gap="4">
                        {renderGrid()}
                        {mode === "play" && (
                            <VStack gap="4" align="stretch">
                                <Timer timer={timer} isPaused={isPaused} setIsPaused={setIsTimerPaused} />
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
                                <Button variant="solid" onClick={handleRestartPuzzle}>
                                    Restart
                                </Button>
                            </VStack>
                        )}
                    </HStack>
                    {mode === "play" && (
                        <HStack gap="4">
                            <Button colorPalette="red" variant="outline" onClick={handleStartNewPuzzle}>
                                New puzzle
                            </Button>
                            <Button colorPalette="red" variant="solid" onClick={handleGiveUpButton}>
                                Give up
                            </Button>
                        </HStack>
                    )}
                </VStack>

                {mode === "create" && (
                    <HStack gap={4} flexWrap="wrap" justifyContent="center">
                        {!(!/[1-9]/.test(sudoku.grid) || isLoading) && (
                            <Button variant="outline" onClick={clearSudokuGrid}>
                                Clear grid
                            </Button>
                        )}
                        {!isLoading && (
                            <Button disabled={!/[1-9]/.test(sudoku.grid)} onClick={handleStartPlaying}>
                                Start playing
                            </Button>
                        )}
                    </HStack>
                )}

                {mode === "display" && isLoading && (
                    <HStack gap={2}>
                        <Button variant="outline" colorPalette="red" onClick={handleAbortButton}>
                            Cancel
                        </Button>
                    </HStack>
                )}

                <HStack gap={2}>
                    {mode === "completed" && !isGameWon && (
                        <Button variant="subtle" colorPalette="green" onClick={revealSolution}>
                            Reveal solution
                        </Button>
                    )}
                    {mode === "completed" && (
                        <Button variant="solid" onClick={handleStartNewPuzzle}>
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
                clearSudokuGrid={handleStartNewPuzzle}
                cellDeletionCount={cellDeletionCount}
                won={isGameWon}
            />
        </Box>
    );
};

export default SudokuPlayer;
