import { useEffect } from "react";

import { Box, Button, SimpleGrid, Text, VStack } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { useSession } from "next-auth/react";
import { notifyError, notifySuccess } from "@/toasts/toast";

interface SudokuGridProps {
    sudokuGrid: string;
};

const DisplaySudokuGrid: React.FC<SudokuGridProps> = ({ sudokuGrid }) => {
    return (
        <Box p={5}>
            <SimpleGrid columns={9}>
                {Array.from({ length: 9 }).map((_, rowIndex) =>
                    Array.from({ length: 9 }).map((_, colIndex) => {
                        const cellIndex = rowIndex * 9 + colIndex;
                        const cellValue = sudokuGrid[cellIndex];
                        return (
                            <Box
                                key={`${rowIndex}-${colIndex}`}
                                width="35px"
                                height="35px"
                                borderWidth="1px"
                                alignContent="center"
                            >
                                <Text key={`${rowIndex}-${colIndex}`} textAlign="center">{cellValue || ''}</Text>
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
    const { data: session, status } = useSession();

    useEffect(() => {
        onFetchSudokus();
    }, []);

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
        <>
            <VStack p={5}>
                {sudokus.map((sudoku, index) => (
                    <Box key={index}>
                        <Text mb={2}>Sudoku {sudoku.id} - {sudoku.difficulty}</Text>
                        <DisplaySudokuGrid sudokuGrid={sudoku.grid} />
                        <Button onClick={() => handleAbortButton(sudoku)}>Abort solving</Button>
                        <Button onClick={() => handleSolveButton(sudoku)}>Solve sudoku</Button>
                    </Box>
                ))}
            </VStack>
        </>
    );
};

export default SudokuList;