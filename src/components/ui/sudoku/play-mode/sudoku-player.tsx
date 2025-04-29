import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import {
    Badge,
    Box,
    Button,
    CloseButton,
    Dialog,
    HStack,
    VStack,
    Text,
    Portal,
} from "@chakra-ui/react";

import { BaseSudokuGrid } from "../base-sudoku-grid";
import { Sudoku, SudokuSolution } from "@/types/types";
import { SudokuDifficultyEnum, SudokuStatusEnum } from "@/types/enums";
import { notifyError, notifySuccess } from "@/toasts/toast";

const defaultSudoku: Sudoku = {
    id: "",
    title: "",
    grid: "0".repeat(81),
    solution: null,
    status: SudokuStatusEnum.Values.created,
    difficulty: SudokuDifficultyEnum.Values.unknown,
} as Sudoku;

const SudokuPlayer = () => {
    const { data: session } = useSession();
    const [sudoku, setSudoku] = useState<Sudoku>(defaultSudoku);
    const [mode, setMode] = useState<"create" | "play" | "solved">("create");
    const [playerGrid, setPlayerGrid] = useState<string>("0".repeat(81));
    const [disableButtons, setDisableButtons] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [moveHistory, setMoveHistory] = useState<{ position: number, oldValue: string, isHint: boolean }[]>([]);

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (session) {
        headers.Authorization = "Bearer " + session.accessToken;
    }

    // Timer effect
    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isTimerRunning]);

    // Format timer as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const clearSudokuGrid = () => {
        setSudoku(defaultSudoku);
        setPlayerGrid("0".repeat(81));
        setMode("create");
        setDisableButtons(false);
        setTimer(0);
        setIsTimerRunning(false);
        setHintsUsed(0);
        setMoveHistory([]);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
        const position = rowIndex * 9 + colIndex;

        if (mode === "create") {
            const newSudokuGrid =
                sudoku.grid.substring(0, position) +
                (value || '0') +
                sudoku.grid.substring(position + 1);

            setSudoku({ ...sudoku, grid: newSudokuGrid });
        } else if (mode === "play") {
            // Cannot modify an original cell in play mode
            if (sudoku.grid[position] !== '0') {
                return;
            }

            // Save the current value for undo history
            setMoveHistory(prev => [...prev, { position, oldValue: playerGrid[position], isHint: false }]);

            const newPlayerGrid =
                playerGrid.substring(0, position) +
                (value || '0') +
                playerGrid.substring(position + 1);

            setPlayerGrid(newPlayerGrid);

            // Check if the puzzle is solved
            if (!newPlayerGrid.includes('0') && sudoku.solution) {
                const isCorrect = newPlayerGrid === sudoku.solution.grid;
                if (isCorrect) {
                    setIsTimerRunning(false);
                    setMode("solved");
                    notifySuccess("Congratulations! You solved the puzzle!");
                    setIsDialogOpen(true); // Open the completion dialog
                }
            }
        }
    };

    const handleUndo = () => {
        if (moveHistory.length === 0) {
            return;
        }

        // Find the last non-hint move
        let lastMoveIndex = moveHistory.length - 1;
        let lastMove = moveHistory[lastMoveIndex];

        // Skip hint moves
        while (lastMoveIndex >= 0 && lastMove.isHint) {
            lastMoveIndex--;
            if (lastMoveIndex >= 0) {
                lastMove = moveHistory[lastMoveIndex];
            }
        }

        // If no valid moves found, return
        if (lastMoveIndex < 0) {
            return;
        }

        // Update the grid with the previous value
        const newPlayerGrid =
            playerGrid.substring(0, lastMove.position) +
            lastMove.oldValue +
            playerGrid.substring(lastMove.position + 1);

        setPlayerGrid(newPlayerGrid);

        // Remove all moves up to and including the undone move
        setMoveHistory(prev => prev.slice(0, lastMoveIndex));
    };

    const handleCreateSudoku = async () => {
        if (/^0+$/.test(sudoku.grid)) {
            notifyError("Cannot create a sudoku with an empty grid!");
            return;
        }

        const data = {
            title: "New sudoku",
            difficulty: SudokuDifficultyEnum.Values.unknown,
            grid: sudoku.grid,
        };

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + "api/sudokus/",
                {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(data),
                }
            );

            const responseData = await response.json();
            if (response.ok) {
                const createdSudoku = responseData as Sudoku;
                setSudoku(createdSudoku);
                return createdSudoku.id;
            } else {
                notifyError("Failed to create sudoku: " + JSON.stringify(responseData));
            }
        } catch (e: unknown) {
            const error = e as Error;
            notifyError(`Error: ${error.message}`);
        }
        return null;
    };

    const fetchSolution = async (sudokuId: string) => {
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/solution/`,
                {
                    method: "GET",
                    headers: headers,
                }
            );
            const responseData = await response.json();
            if (response.ok) {
                const sudokuSolution = responseData as SudokuSolution;
                setSudoku((prevSudoku) => {
                    if (!prevSudoku) return prevSudoku;
                    return { ...prevSudoku, solution: sudokuSolution };
                });
            } else {
                notifyError("Failed to fetch solution: " + JSON.stringify(responseData));
            }
        } catch (e: unknown) {
            const error = e as Error;
            notifyError(`Failed to fetch solution: ${error.message}`);
        }
    };

    const handleSolveSudoku = async (sudokuId: string) => {
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/solver/`,
                {
                    method: "POST",
                    headers: headers,
                }
            );
            const responseData = await response.json();
            if (response.ok) {
                setDisableButtons(true);
                const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/sudokus/${sudokuId}/status/`);

                newSocket.onopen = () => {
                    console.log(`WebSocket connected for Sudoku ${sudokuId}`);
                };

                newSocket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type === "status_update") {
                        const { sudoku_id, status } = data;
                        setSudoku((prevSudoku) => {
                            if (!prevSudoku) return prevSudoku;
                            return { ...prevSudoku, status: status };
                        });

                        if (status === SudokuStatusEnum.Values.completed) {
                            fetchSolution(sudoku_id);
                            newSocket.close();
                            setDisableButtons(false);
                            // Initialize player grid with the original sudoku
                            setPlayerGrid(sudoku.grid);
                            // Start the game
                            setMode("play");
                            setIsTimerRunning(true);
                        }
                    }
                };

                newSocket.onerror = (error) => {
                    console.error(`WebSocket error for Sudoku ${sudokuId}:`, error);
                    notifyError("WebSocket connection error");
                    setDisableButtons(false);
                };

                newSocket.onclose = () => {
                    console.log(`WebSocket closed for Sudoku ${sudokuId}`);
                };
            } else {
                notifyError("Failed to run task: " + JSON.stringify(responseData));
                setDisableButtons(false);
            }
        } catch (e: unknown) {
            const error = e as Error;
            notifyError(`An error occurred while running task: ${error.message}`);
            setDisableButtons(false);
        }
    };

    const handleStartPlaying = async () => {
        const sudokuId = await handleCreateSudoku();
        if (sudokuId) {
            handleSolveSudoku(sudokuId);
        }
    };

    const handleHint = () => {
        if (!sudoku.solution) return;

        // Find all empty cells
        const emptyCells = [];
        for (let i = 0; i < playerGrid.length; i++) {
            if (playerGrid[i] === '0') {
                emptyCells.push(i);
            }
        }

        if (emptyCells.length === 0) return;

        // Select a random empty cell
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellIndex = emptyCells[randomIndex];

        // Save to history but mark that this move was a hint
        setMoveHistory(prev => [...prev, { position: cellIndex, oldValue: playerGrid[cellIndex], isHint: true }]);

        // Fill it with the correct value from solution
        const newPlayerGrid =
            playerGrid.substring(0, cellIndex) +
            sudoku.solution.grid[cellIndex] +
            playerGrid.substring(cellIndex + 1);

        setPlayerGrid(newPlayerGrid);
        setHintsUsed(prev => prev + 1);

        // Check if the puzzle is now solved
        if (!newPlayerGrid.includes('0')) {
            setIsTimerRunning(false);
            setMode("solved");
            notifySuccess("Puzzle completed with hints!");
            setIsDialogOpen(true); // Open the completion dialog
        }
    };

    const handleGiveUp = () => {
        if (!sudoku.solution) return;
        setPlayerGrid(sudoku.solution.grid);
        setIsTimerRunning(false);
        setMode("solved");
        notifySuccess("Solution revealed!");
    };

    const handleCheckProgress = () => {
        if (!sudoku.solution) return;

        let correct = 0;
        let incorrect = 0;

        for (let i = 0; i < playerGrid.length; i++) {
            if (playerGrid[i] !== '0') {
                if (playerGrid[i] === sudoku.solution.grid[i]) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        }

        notifySuccess(`Progress: ${correct} correct, ${incorrect} incorrect numbers, ${hintsUsed} hints used.`);
    };

    const handleRestartPuzzle = () => {
        // Reset to original puzzle without clearing
        setPlayerGrid(sudoku.grid);
        setTimer(0);
        setIsTimerRunning(true);
        setHintsUsed(0);
        setMode("play");
        setMoveHistory([]); // Clear move history when restarting
    };

    return (
        <Box p={5}>
            <VStack gap={4}>
                {/* Game status information */}
                {mode !== "create" && (
                    <HStack width="100%" justifyContent="space-between" px={4}>
                        <Badge
                            colorPalette={isTimerRunning ? "green" : "gray"}
                            fontSize="md"
                            p={2}
                            borderRadius="md"
                        >
                            Time: {formatTime(timer)}
                        </Badge>

                        {hintsUsed > 0 && (
                            <Badge colorPalette="purple" fontSize="md" p={2} borderRadius="md">
                                Hints used: {hintsUsed}
                            </Badge>
                        )}

                        <Badge
                            colorPalette={mode === "solved" ? "blue" : "yellow"}
                            fontSize="md"
                            p={2}
                            borderRadius="md"
                        >
                            Status: {mode === "solved" ? "Completed" : "In Progress"}
                        </Badge>
                    </HStack>
                )}

                {/* Sudoku Grid */}
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
                                        grid: playerGrid, // Use player's current progress
                                    }}
                                    onCellChange={handleCellChange}
                                />
                            );
                        case "solved":
                            return (
                                <BaseSudokuGrid
                                    mode="display"
                                    sudoku={{
                                        ...sudoku,
                                        grid: playerGrid, // Show completed grid
                                    }}
                                    onCellChange={handleCellChange}
                                />
                            );
                    }
                })()}

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

                    {mode === "play" && (
                        <>
                            <Button
                                colorPalette="red"
                                variant="outline"
                                onClick={clearSudokuGrid}
                            >
                                New puzzle
                            </Button>
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
                                onClick={handleUndo}
                                disabled={moveHistory.length === 0 || !moveHistory.some(move => !move.isHint)}
                                title={moveHistory.length > 0 && !moveHistory.some(move => !move.isHint) ? "Cannot undo hints" : ""}
                            >
                                Undo
                            </Button>
                            <Button
                                colorPalette="purple"
                                variant="outline"
                                onClick={handleHint}
                            >
                                Hint
                            </Button>
                            <Button
                                colorPalette="blue"
                                variant="outline"
                                onClick={handleCheckProgress}
                            >
                                Check progress
                            </Button>
                            <Button
                                colorPalette="red"
                                variant="solid"
                                onClick={handleGiveUp}
                            >
                                Give up
                            </Button>
                        </>
                    )}

                    {mode === "solved" && (
                        <>
                            <Button
                                colorPalette="green"
                                variant="outline"
                                onClick={clearSudokuGrid}
                            >
                                New puzzle
                            </Button>
                        </>
                    )}
                </HStack>
            </VStack>

            {/* Completion Dialog */}
            <Dialog.Root open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Puzzle Completed!</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <VStack gap={4} align="stretch">
                                    <Text>Congratulations on completing the sudoku puzzle!</Text>
                                    <Text>
                                        <strong>Time:</strong> {formatTime(timer)}
                                    </Text>
                                    {hintsUsed > 0 && (
                                        <Text>
                                            <strong>Hints used:</strong> {hintsUsed}
                                        </Text>
                                    )}
                                </VStack>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Close
                                    </Button>
                                </Dialog.ActionTrigger>
                                <Button colorPalette="blue" onClick={() => {
                                    clearSudokuGrid();
                                    setIsDialogOpen(false);
                                }}>
                                    New Puzzle
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Box>
    );
};

export default SudokuPlayer;