import React, { useEffect } from "react";

import { For, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import SudokuItem from "./sudoku-item";
import { Sudoku, SudokuSolution } from "@/types/types";
import { notifyError, notifySuccess } from "@/toasts/toast";
import { SudokuStatusEnum } from "@/types/enums";
import { TfiFaceSad } from "react-icons/tfi";

interface SudokuListProps {
    sudokus: Sudoku[];
    setSudokus: React.Dispatch<React.SetStateAction<Sudoku[]>>;
};

const SudokuList: React.FC<SudokuListProps> = ({ sudokus, setSudokus }) => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            const fetchSudokus = async () => {
                if (session) {
                    try {
                        const response = await fetch(
                            process.env.NEXT_PUBLIC_BACKEND_URL + "api/sudokus/",
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
                            const fetchedSudokus: Sudoku[] = responseData["results"]
                            setSudokus(fetchedSudokus);
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

    }

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
                    notifySuccess("Task run successfully!")

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
                    notifySuccess("Solution deleted successfully!")
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
    }

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
                    notifySuccess("Sudoku deleted successfully!")
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
    }

    return (
        <VStack p={5} width="full">
            <For
                each={sudokus}
                fallback={
                    <VStack textAlign="center" fontWeight="medium">
                        <TfiFaceSad size="50px" />
                        No Sudokus created yet!
                    </VStack>}
            >
                {(sudoku, _) => <SudokuItem
                    key={sudoku.id}
                    sudoku={sudoku}
                    onSolve={handleSolveButton}
                    onAbort={handleAbortButton}
                    onDeleteSolution={handleDeleteSolution}
                    onDeleteSudoku={handleDeleteSudoku}
                    status={sudoku.status} />}
            </For>
        </VStack>
    );
};

export default SudokuList;