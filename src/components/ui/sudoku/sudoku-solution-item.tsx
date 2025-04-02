import { memo } from "react";

import { useSession } from "next-auth/react";
import { Badge, Box, Button, HStack, Text, VStack } from "@chakra-ui/react";

import { Sudoku, SudokuSolution, SudokuStatus } from "@/types/types";
import { SudokuStatusEnum } from "@/types/enums";
import { BaseSudokuGrid } from "./base-sudoku-grid";
import { notifyError } from "@/toasts/toast";

const getStatusColor = (status?: string) => {
    switch (status) {
        case "completed": return "green";
        case "running": return "blue";
        case "pending": return "yellow";
        case "failed": return "red";
        case "invalid": return "red";
        case "aborted": return "orange";
        default: return "gray";
    }
};

interface SudokuSolutionItemProps {
    sudoku: Sudoku;
    setSudokus: React.Dispatch<React.SetStateAction<Sudoku[]>>;
    status: SudokuStatus;
}

const SudokuSolutionItem: React.FC<SudokuSolutionItemProps> = memo((
    { sudoku, setSudokus, status }
) => {
    const { data: session } = useSession();

    const fetchSolution = async (sudokuId: string) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/solution/`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + session.accessToken
                        },
                    }
                );
                const responseData = await response.json()
                if (response.ok) {
                    const sudokuSolution = responseData as SudokuSolution;
                    setSudokus((prevSudokus) =>
                        prevSudokus.map((sudoku) =>
                            sudoku.id === sudokuId ? { ...sudoku, solution: sudokuSolution } : sudoku
                        )
                    );
                } else {
                    notifyError("Failed to abort task: " + responseData);
                }
            } catch (e: unknown) {
                const error = e as Error;
                notifyError(`Failed to fetch solution: ${error.message}`);
            }
        }

    };

    const handleAbortButton = async (sudokuId: string) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/solver/`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + session.accessToken
                        },
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
        }
    };

    const handleSolveButton = async (sudokuId: string) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/solver/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + session.accessToken
                        },
                    }
                )
                const responseData = await response.json()
                if (response.ok) {
                    const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/sudokus/${sudokuId}/status/`);

                    newSocket.onopen = () => {
                        console.log(`WebSocket connected for Sudoku ${sudokuId}`);
                    };

                    newSocket.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        if (data.type === "status_update") {
                            const { sudoku_id, status } = data;
                            setSudokus((prevSudokus) =>
                                prevSudokus.map((sudoku) =>
                                    sudoku.id === sudoku_id ? { ...sudoku, status: status } : sudoku
                                )
                            );

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
                notifyError(`An error occurred while running task: ${error.message}`);
            }
        }
    };

    const handleDeleteSolution = async (sudokuId: string) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/solution/`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + session.accessToken
                        },
                    }
                )
                if (response.ok) {
                    setSudokus((prevSudokus) => prevSudokus.map((sudoku) =>
                        sudoku.id === sudokuId
                            ? { ...sudoku, solution: null, status: SudokuStatusEnum.Values.created }
                            : sudoku
                    ))
                } else {
                    const errorData = await response.json()
                    notifyError("Failed to delete solution: " + errorData);
                }
            } catch (e: unknown) {
                const error = e as Error;
                notifyError(`An error occurred while deleting solution: ${error.message}`);
            }
        }
    };

    const handleDeleteSudoku = async (sudokuId: string) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + session.accessToken
                        },
                    }
                )
                if (response.ok) {
                    setSudokus((prevSudokus) => prevSudokus.filter((sudoku) => sudoku.id !== sudokuId))
                } else {
                    const errorData = await response.json()
                    notifyError("Failed to delete Sudoku: " + errorData);
                }
            } catch (e: unknown) {
                const error = e as Error;
                notifyError(`An error occurred while deleting Sudoku: ${error.message}`);
            }
        }
    };

    return (
        <Box p={4}>
            <VStack>
                <Text fontWeight="bold">
                    {sudoku.title} - {sudoku.difficulty}
                </Text>
                <Badge colorPalette={getStatusColor(status)}>
                    {status || SudokuStatusEnum.Values.created}
                </Badge>
                <BaseSudokuGrid
                    mode="display"
                    grid={sudoku.grid}
                    solution={sudoku.solution}
                />
                <HStack>
                    <Button
                        disabled={[SudokuStatusEnum.Values.running, SudokuStatusEnum.Values.pending].includes(status as any)}
                        colorPalette="red"
                        variant="subtle"
                        onClick={() => handleDeleteSudoku(sudoku.id)}
                    >
                        Delete sudoku
                    </Button>
                    <Button
                        disabled={sudoku.solution ? false : true}
                        colorPalette="red"
                        variant="outline"
                        onClick={() => handleDeleteSolution(sudoku.id)}
                    >
                        Delete solution
                    </Button>
                    <Button
                        disabled={![SudokuStatusEnum.Values.running, SudokuStatusEnum.Values.pending].includes(status as any)}
                        colorPalette="red"
                        variant="outline"
                        onClick={() => handleAbortButton(sudoku.id)}
                    >
                        Abort solving
                    </Button>
                    <Button
                        disabled={![SudokuStatusEnum.Values.created, SudokuStatusEnum.Values.aborted, SudokuStatusEnum.Values.failed].includes(status as any)}
                        loadingText="Solving sudoku..."
                        colorPalette="green"
                        variant="subtle"
                        onClick={() => handleSolveButton(sudoku.id)}
                    >
                        Solve sudoku
                    </Button>
                </HStack>
            </VStack>
        </Box>
    )
});

export default SudokuSolutionItem;