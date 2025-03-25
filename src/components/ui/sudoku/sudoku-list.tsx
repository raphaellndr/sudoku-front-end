import React, { useState, useCallback, useEffect } from "react";
import { Box, Button, SimpleGrid, Text, VStack, Badge, HStack } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { useSession } from "next-auth/react";
import { notifyError, notifySuccess } from "@/toasts/toast";

interface SudokuGridProps {
    sudokuGrid: string;
    solution?: string;
};

const DisplaySudokuGrid: React.FC<SudokuGridProps> = ({ sudokuGrid, solution }) => {
    return (
        <Box p={5}>
            <SimpleGrid columns={9}>
                {Array.from({ length: 9 }).map((_, rowIndex) =>
                    Array.from({ length: 9 }).map((_, colIndex) => {
                        const cellIndex = rowIndex * 9 + colIndex;
                        const cellValue = solution ? solution[cellIndex] : sudokuGrid[cellIndex];
                        return (
                            <Box
                                key={`${rowIndex}-${colIndex}`}
                                width="35px"
                                height="35px"
                                borderWidth="1px"
                                alignContent="center"
                            >
                                <Text key={`${rowIndex}-${colIndex}`} textAlign="center">
                                    {cellValue || ""}
                                </Text>
                            </Box>
                        )
                    })
                )}
            </SimpleGrid>
        </Box>
    );
};

interface SudokuListProps {
    sudokus: Sudoku[];
    onFetchSudokus: () => Promise<void>;
};

const SudokuList: React.FC<SudokuListProps> = ({ sudokus, onFetchSudokus }) => {
    const { data: session } = useSession();
    const [solutions, setSolutions] = useState<{ [key: string]: string }>({});
    const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        onFetchSudokus();
    }, []);

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

    const handleFetchStatus = useCallback(async (sudoku: Sudoku) => {
        if (session) {
            setLoadingStates(prev => ({ ...prev, [`status-${sudoku.id}`]: true }));
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `sudoku/sudokus/${sudoku.id}/status/`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + session.accessToken
                        },
                    }
                );
                const responseData = await response.json();

                if (response.ok) {
                    notifySuccess("Status fetched successfully!")
                    setStatuses(prev => ({ ...prev, [sudoku.id]: responseData.status }));

                    // If status is completed, fetch solution
                    if (responseData.status === "completed") {
                        const solutionResponse = await fetch(
                            process.env.NEXT_PUBLIC_BACKEND_URL + `sudoku/sudokus/${sudoku.id}/solution/`,
                            {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + session.accessToken
                                },
                            }
                        );

                        if (solutionResponse.ok) {
                            const solutionData = await solutionResponse.json();
                            setSolutions(prev => ({ ...prev, [sudoku.id]: solutionData.grid }));
                        }
                    }
                } else {
                    notifyError("Failed to fetch status: " + responseData);
                }
            } catch (e: unknown) {
                const error = e as Error;
                notifyError(`An error occurred while fetching status: ${error.message}`);
            } finally {
                setLoadingStates(prev => ({ ...prev, [`status-${sudoku.id}`]: false }));
            }
        }
    }, [session]);

    const handleAbortButton = async (sudoku: Sudoku) => {
        if (session) {
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `sudoku/sudokus/${sudoku.id}/solution/`,
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
            setLoadingStates(prev => ({ ...prev, [`solve-${sudoku.id}`]: true }));
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + `sudoku/sudokus/${sudoku.id}/solution/`,
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
                    // Optionally refresh sudokus or update status
                    onFetchSudokus();
                } else {
                    notifyError("Failed to run task: " + responseData);
                }
            } catch (e: unknown) {
                const error = e as Error;
                notifyError(`An error occurred while running task: ${error.message}`);
            } finally {
                setLoadingStates(prev => ({ ...prev, [`solve-${sudoku.id}`]: false }));
            }
        }
    };

    return (
        <VStack p={5} width="full">
            {sudokus.map((sudoku) => (
                <Box key={sudoku.id} borderWidth={1} borderRadius="md" p={4}>
                    <VStack align="stretch">
                        <HStack justifyContent="space-between">
                            <Text fontWeight="bold">
                                Sudoku {sudoku.id} - {sudoku.difficulty}
                            </Text>
                            <Badge
                                colorPalette={getStatusColor(statuses[sudoku.id])}
                            >
                                {statuses[sudoku.id] || "created"}
                            </Badge>
                        </HStack>

                        <DisplaySudokuGrid
                            sudokuGrid={sudoku.grid}
                            solution={solutions[sudoku.id]}
                        />

                        <HStack>
                            <Button
                                onClick={() => handleAbortButton(sudoku)}
                                colorScheme="red"
                                variant="outline"
                            >
                                Abort solving
                            </Button>
                            <Button
                                onClick={() => handleSolveButton(sudoku)}
                                loading={loadingStates[`solve-${sudoku.id}`]}
                                loadingText="Solving sudoku..."
                                colorScheme="green"
                            >
                                Solve sudoku
                            </Button>
                            <Button
                                onClick={() => handleFetchStatus(sudoku)}
                                loading={loadingStates[`status-${sudoku.id}`]}
                                loadingText="Fetching status..."
                                colorScheme="blue"
                            >
                                Fetch Status
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            ))}
        </VStack>
    );
};

export default SudokuList;