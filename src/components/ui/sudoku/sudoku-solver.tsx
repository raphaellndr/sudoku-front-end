import { useState } from "react";
import { useSession } from "next-auth/react";

import { Box, Button, HStack, VStack } from "@chakra-ui/react";

import { BaseSudokuGrid } from "./base-sudoku-grid";
import { Sudoku, SudokuSolution } from "@/types/types";
import { SudokuDifficultyEnum, SudokuStatusEnum } from "@/types/enums";
import { notifyError } from "@/toasts/toast";

const defaultSudoku: Sudoku = {
    id: "",
    title: "",
    grid: "0".repeat(81),
    solution: null,
    status: SudokuStatusEnum.Values.created,
    difficulty: SudokuDifficultyEnum.Values.unknown,
} as Sudoku;

const SudokuSolver = () => {
    const { data: session } = useSession();
    const [sudoku, setSudoku] = useState<Sudoku>(defaultSudoku);
    const [mode, setMode] = useState<"create" | "display">("create");
    const [disableSolveButton, setDisableSolveButton] = useState(false);

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (session) {
        headers.Authorization = "Bearer " + session.accessToken;
    }

    const clearSudokuGrid = () => {
        setSudoku(defaultSudoku)
        setMode("create");
        setDisableSolveButton(false);
    }

    const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
        const position = rowIndex * 9 + colIndex;

        const newSudokuGrid =
            sudoku.grid.substring(0, position) +
            (value || '0') +
            sudoku.grid.substring(position + 1);

        setSudoku({ ...sudoku, grid: newSudokuGrid, })
    };

    const handleCreateSudoku = async () => {
        if (/^0+$/.test(sudoku.grid)) {
            console.error("Cannot create a sudoku with an empty grid!");
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
                const sudoku = responseData as Sudoku;
                setSudoku(sudoku);
                return sudoku.id;
            } else {
                console.error("Failed to create sudoku: ", responseData);
            }
        } catch (e: unknown) {
            const error = e as Error;
            console.error("Error:", error)
        }
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
            const responseData = await response.json()
            if (response.ok) {
                const sudokuSolution = responseData as SudokuSolution;
                setSudoku((prevSudoku) => {
                    if (!prevSudoku) return prevSudoku;
                    return { ...prevSudoku, solution: sudokuSolution }
                });
            } else {
                notifyError("Failed to abort task: " + responseData);
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
            )
            const responseData = await response.json()
            if (response.ok) {
                setMode("display");
                setDisableSolveButton(true)
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
                            return { ...prevSudoku, status: status }
                        });

                        if (status === SudokuStatusEnum.Values.completed) {
                            fetchSolution(sudoku_id);
                            newSocket.close();
                        }
                    }
                };

                newSocket.onerror = (error) => {
                    console.error(`WebSocket error for Sudoku ${sudokuId}:`, error);
                    notifyError("WebSocket connection error");
                };

                newSocket.onclose = () => {
                    console.log(`WebSocket closed for Sudoku ${sudokuId}`);
                };
            } else {
                notifyError("Failed to run task: " + responseData);
            }
        } catch (e: unknown) {
            const error = e as Error;
            console.error(`An error occurred while running task: ${error.message}`);
        }
    }

    const handleAbortButton = async () => {
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudoku.id}/solver/`,
                {
                    method: "DELETE",
                    headers: headers,
                }
            )
            if (!response.ok) {
                const errorData = await response.json()
                notifyError("Failed to abort task: " + errorData);
            }
        } catch (e: unknown) {
            const error = e as Error;
            notifyError(`An error occurred while aborting the task: ${error.message}`);
        }
    };

    return (
        <Box p={5}>
            <VStack>
                {(() => {
                    switch (mode) {
                        case "create":
                            return (
                                <BaseSudokuGrid
                                    mode="create"
                                    sudoku={sudoku}
                                    onCellChange={handleCellChange}
                                />
                            )
                        case "display":
                            return (
                                <BaseSudokuGrid
                                    mode="display"
                                    sudoku={sudoku}
                                    onCellChange={handleCellChange}
                                />
                            )
                    }
                })()}
                <HStack>
                    <Button
                        disabled={!/[1-9]/.test(sudoku.grid) || [SudokuStatusEnum.Values.running, SudokuStatusEnum.Values.pending].includes(sudoku.status as any)}
                        colorPalette="red"
                        variant="outline"
                        onClick={clearSudokuGrid}>
                        Clear grid
                    </Button>
                    <Button
                        disabled={![SudokuStatusEnum.Values.running, SudokuStatusEnum.Values.pending].includes(sudoku.status as any)}
                        colorPalette="red"
                        variant="outline"
                        onClick={() => handleAbortButton()}
                    >
                        Abort solving
                    </Button>
                    <Button
                        disabled={disableSolveButton}
                        colorPalette="blue"
                        variant="subtle"
                        loadingText="Solving sudoku..."
                        loading={sudoku.status === SudokuStatusEnum.Values.running}
                        onClick={async () => {
                            const sudokuId = await handleCreateSudoku();
                            if (sudokuId) {
                                handleSolveSudoku(sudokuId);
                            }
                        }}
                    >
                        Solve sudoku
                    </Button>
                </HStack>
            </VStack>
        </Box >
    );
};

export default SudokuSolver;