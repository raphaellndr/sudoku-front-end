import React, { useState } from "react";
import { Box, SimpleGrid, Input, VStack, Button, HStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Difficulty } from "@/types/enums";

const SudokuGrid = () => {
    const { data: session, status } = useSession();
    const [sudokuGrid, setSudokuGrid] = useState<number[][]>(Array(9).fill(Array(9).fill(0)));

    const notifySuccess = (message: string) => toast.success(message);
    const notifyError = (message: string) => toast.error(
        message,
        {
            position: "bottom-right",
        }
    );

    const handleChange = (rowIndex: number, colIndex: number, value: string) => {
        const newSudokuGrid = sudokuGrid.map((row, rIndex) =>
            row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? parseInt(value) || 0 : cell))
        );
        setSudokuGrid(newSudokuGrid);
    };

    const gridToString = () => {
        return sudokuGrid.map(row => row.join("")).join("");
    };

    const handleResetSudoku = () => {
        setSudokuGrid(Array(9).fill(Array(9).fill(0)))
    }

    const handleCreateSudoku = async () => {
        if (session) {
            const data = {
                title: "New Sudoku", // Default title for now
                difficulty: Difficulty.Unknown, // Default difficulty for now
                grid: gridToString(),
            };
            try {
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + "sudoku/sudokus/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + session.accessToken
                        },
                        body: JSON.stringify(data),
                    }
                )
                if (response.ok) {
                    notifySuccess("Successfully created sudoku!");
                    handleResetSudoku();
                } else {
                    const errorData = await response.json();
                    notifyError("Failed to create sudoku: " + errorData);
                }
            } catch (e: unknown) {
                const error = e as Error;
                notifyError(`An error occurred while creating sudoku: ${error.message}`);
            }
        }
    }

    return (
        <>
            <Box p={5}>
                <VStack>
                    <h1>Sudoku Creator</h1>
                    <SimpleGrid columns={9}>
                        {sudokuGrid.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                                <Input
                                    key={`${rowIndex}-${colIndex}`}
                                    width="35px"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[1-9]"
                                    maxLength={1}
                                    value={cell !== 0 ? cell : ""}
                                    onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                                    textAlign="center"
                                />
                            ))
                        )}
                    </SimpleGrid>
                    <HStack>
                        <Button onClick={handleResetSudoku}>Reset sudoku</Button>
                        <Button onClick={handleCreateSudoku}>Create sudoku</Button>
                    </HStack>
                </VStack>
            </Box>
        </>
    );
};

export default SudokuGrid;
