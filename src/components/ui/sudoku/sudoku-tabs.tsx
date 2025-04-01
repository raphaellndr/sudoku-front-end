import React, { useEffect } from "react";

import { Flex, For, Tabs, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { LuInfinity } from "react-icons/lu";

import SudokuItem from "./sudoku-item";
import { Sudoku, SudokuSolution } from "@/types/types";
import { notifyError, notifySuccess } from "@/toasts/toast";
import { SudokuDifficultyEnum, SudokuStatusEnum } from "@/types/enums";

interface SudokuTabsProps {
    sudokus: Sudoku[];
    setSudokus: React.Dispatch<React.SetStateAction<Sudoku[]>>;
};

const SudokuTabs: React.FC<SudokuTabsProps> = ({ sudokus, setSudokus }) => {
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
    };

    const getSudokusByDifficulty = (difficulty: string | null) => {
        if (!difficulty) return sudokus;
        return sudokus.filter(sudoku => sudoku.difficulty === difficulty);
    };

    const renderSudokuItems = (filteredSudokus: Sudoku[], difficulty: string | null) => {
        return (
            <For
                each={filteredSudokus}
                fallback={
                    <VStack textAlign="center">
                        {`No ${difficulty || ""} sudoku created yet!`}
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
        )
    };

    return (
        <Tabs.Root defaultValue="all" variant="plain">
            {/* Define tabs names */}
            <Flex justify="center" align="center" p={4}>
                <Tabs.List bg="gray.100" rounded="l3" p="1" justifyContent="center" borderRadius="md">
                    <Tabs.Trigger value="all" key="trigger-all"><LuInfinity />All</Tabs.Trigger>
                    {SudokuDifficultyEnum.options.map((option) =>
                        <Tabs.Trigger value={option} key={`trigger-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Tabs.Trigger>
                    )}
                    <Tabs.Indicator rounded="l2" />
                </Tabs.List>
            </Flex>
            {/* Define tabs */}
            <Tabs.Content value="all">
                {renderSudokuItems(getSudokusByDifficulty(null), null)}
            </Tabs.Content>
            {SudokuDifficultyEnum.options.map((option) =>
                <Tabs.Content value={option} key={`content-${option}`}>
                    {renderSudokuItems(getSudokusByDifficulty(option), option)}
                </Tabs.Content>
            )}
        </Tabs.Root>
    );
};

export default SudokuTabs;