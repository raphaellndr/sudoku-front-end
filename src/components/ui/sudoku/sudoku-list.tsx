import React, { useState, useCallback, useEffect } from "react";
import { Box, Button, Text, VStack, Badge, HStack } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { useSession } from "next-auth/react";
import { notifyError, notifySuccess } from "@/toasts/toast";

import SudokuGrid from "./sudoku-grid";
import { SudokuStatusEnum } from "@/types/enums";

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

interface SudokuListProps {
    sudokus: Sudoku[];
    onFetchSudokus: () => Promise<void>;
};

const SudokuList: React.FC<SudokuListProps> = ({ sudokus, onFetchSudokus }) => {
    const { data: session } = useSession();
    const [solutions, setSolutions] = useState<{ [key: string]: string }>({});
    const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
    const [sockets, setSockets] = useState<Record<string, WebSocket>>({});

    useEffect(() => {
        if (session) {
            onFetchSudokus();
        }
    }, [])

    useEffect(() => {
        if (session) {
            const newSockets: Record<string, WebSocket> = {};

            sudokus.forEach((sudoku) => {
                const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/sudokus/${sudoku.id}/status/`);

                newSocket.onopen = () => {
                    console.log(`WebSocket connected for Sudoku ${sudoku.id}`);
                };

                newSocket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type === "status_update") {
                        const { sudoku_id, status } = data;
                        setStatuses((prev) => ({ ...prev, [sudoku_id]: status }));
                        if (status === SudokuStatusEnum.Values.completed) {
                            fetchSolution(sudoku_id);
                        }
                    }
                };

                newSocket.onerror = (error) => {
                    console.error(`WebSocket error for Sudoku ${sudoku.id}:`, error);
                    notifyError("WebSocket connection error");
                };

                newSockets[sudoku.id] = newSocket;
            });

            setSockets(newSockets);

            return () => {
                Object.values(newSockets).forEach((socket) => socket.close());
            };
        }
    }, [sudokus]);

    const fetchSolution = useCallback(async (sudokuId: string) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudoku/sudokus/${sudokuId}/solution/`,
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
                    setSolutions(prev => ({ ...prev, [sudokuId]: responseData.grid }));
                } else {
                    notifyError("Failed to abort task: " + responseData);
                }
            } catch (e: unknown) {
                const error = e as Error;
                notifyError(`Failed to fetch solution: ${error.message}`);
            }
        }

    }, [session])

    const handleAbortButton = async (sudoku: Sudoku) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudoku/sudokus/${sudoku.id}/solution/`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + session.accessToken
                        },
                    }
                )
                const responseData = await response.json()
                if (response.ok) {
                    notifySuccess("Task aborted successfully!")
                } else {
                    notifyError("Failed to abort task: " + responseData);
                }
            } catch (e: unknown) {
                const error = e as Error;
                notifyError(`An error occurred while aborting the task: ${error.message}`);
            }
        }
    }

    const handleSolveButton = async (sudoku: Sudoku) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudoku/sudokus/${sudoku.id}/solution/`,
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
                    notifySuccess("Task run successfully!")
                } else {
                    notifyError("Failed to run task: " + responseData);
                }
            } catch (e: unknown) {
                const error = e as Error;
                notifyError(`An error occurred while running task: ${error.message}`);
            }
        }
    };

    return (
        <VStack p={5} width="full">
            {sudokus.map((sudoku) => (
                <Box key={sudoku.id} borderWidth={1} borderRadius="md" p={4}>
                    <VStack align="center">
                        <Text fontWeight="bold">
                            Sudoku {sudoku.id} - {sudoku.difficulty}
                        </Text>
                        <Badge colorPalette={getStatusColor(statuses[sudoku.id])}>
                            {statuses[sudoku.id] || "created"}
                        </Badge>
                        <SudokuGrid sudokuGrid={sudoku.grid} solution={solutions[sudoku.id]} />
                        <HStack>
                            <Button onClick={() => handleAbortButton(sudoku)} colorScheme="red" variant="outline">
                                Abort solving
                            </Button>
                            <Button onClick={() => handleSolveButton(sudoku)} loadingText="Solving sudoku..." colorScheme="green">
                                Solve sudoku
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            ))}
        </VStack>
    );
};

export default SudokuList;