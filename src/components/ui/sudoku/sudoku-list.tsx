import React, { useState, useCallback, useEffect } from "react";

import { VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import SudokuItem from "./sudoku-item";
import { Sudoku, SudokuSolution } from "@/types/types";
import { notifyError, notifySuccess } from "@/toasts/toast";
import { SudokuStatusEnum } from "@/types/enums";

interface SudokuListProps {
    sudokus: Sudoku[];
    setSudokus: React.Dispatch<React.SetStateAction<Sudoku[]>>;
};

const SudokuList: React.FC<SudokuListProps> = ({ sudokus, setSudokus }) => {
    const { data: session } = useSession();
    const [solutions, setSolutions] = useState<{ [key: string]: string }>({});
    const [statuses, setStatuses] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (session) {
            const fetchSudokus = async () => {
                if (session) {
                    try {
                        const response = await fetch(
                            process.env.NEXT_PUBLIC_BACKEND_URL + "api/sudoku/sudokus/",
                            {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + session.accessToken,
                                },
                            }
                        );
                        if (response.ok) {
                            const responseData = await response.json();
                            const sudokus: Sudoku[] = responseData["results"]
                            const grids: string[] = sudokus.map((sudoku: Sudoku) => sudoku.grid);
                            setSudokus(sudokus);
                        } else {
                            notifyError("Failed to fetch Sudoku grids");
                        }
                    } catch (e: unknown) {
                        const error = e as Error;
                        notifyError(`An error occurred while fetching Sudoku grids: ${error.message}`);
                    }
                }
            };
            fetchSudokus();
        };
    }, [session]);

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
                    const sudokuSolution = responseData as SudokuSolution;
                    setSudokus((prevSudokus) =>
                        prevSudokus.map((sudoku) =>
                            sudoku.id === sudokuId ? { ...sudoku, solution: sudokuSolution } : sudoku
                        )
                    );
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

    const handleAbortButton = async (sudokuId: string) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudoku/sudokus/${sudokuId}/solution/`,
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

    const handleSolveButton = async (sudokuId: string) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudoku/sudokus/${sudokuId}/solution/`,
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
                    
                    const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/sudokus/${sudokuId}/status/`);

                    newSocket.onopen = () => {
                        console.log(`WebSocket connected for Sudoku ${sudokuId}`);
                    };

                    newSocket.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        if (data.type === "status_update") {
                            const { sudoku_id, status } = data;
                            setStatuses((prev) => ({ ...prev, [sudoku_id]: status }));

                            if (status === SudokuStatusEnum.Values.completed) {
                                fetchSolution(sudoku_id);
                                newSocket.close();
                            }
                        }
                    };

                    newSocket.onerror = (error) => {
                        console.error(`WebSocket error for Sudoku ${sudoku.id}:`, error);
                        notifyError("WebSocket connection error");
                    };

                    newSocket.onclose = () => {
                        console.log(`WebSocket closed for Sudoku ${sudoku.id}`);
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

    return (
        <VStack p={5} width="full">
            {sudokus.map((sudoku) => (
            <SudokuItem
                key={sudoku.id}
                sudoku={sudoku}
                onSolve={handleSolveButton}
                onAbort={handleAbortButton}
                status={statuses[sudoku.id]}
                solution={solutions[sudoku.id]}
            />
            ))}
        </VStack>
    );
};

export default SudokuList;