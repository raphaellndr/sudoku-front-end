import React, { useState } from "react";
import { Box, SimpleGrid, Input, VStack, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

enum Difficulty {
    Unknown = "UNKNOWN",
    Easy = "EASY",
    Medium = "MEDIUM",
    Hard = "HARD",
}

const SudokuGrid = () => {
    const { data: session, status } = useSession();
    const [sudokuGrid, setSudokuGrid] = useState<number[][]>(Array(9).fill(Array(9).fill(0)));

    const handleChange = (rowIndex: number, colIndex: number, value: string) => {
        const newSudokuGrid = sudokuGrid.map((row, rIndex) =>
            row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? parseInt(value) || 0 : cell))
        );
        setSudokuGrid(newSudokuGrid);
    };

    const gridToString = () => {
        return sudokuGrid.map(row => row.join("")).join("");
    };

    const handleCreateSudoku = async () => {
        if (session) {
            console.log("Session:", session);
            const data = {
                // user: session.user,
                title: "New Sudoku", // Default title for now
                difficulty: Difficulty.Unknown, // Default difficulty for now
                grid: gridToString(),
            };
            console.log("Creating new sudoku:", data);
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
            const responseData = await response.json();
            console.log("Created sudoku:", responseData);
        } else {
            return;
        }
    }

    return (
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
                <Button onClick={handleCreateSudoku}>Create sudoku</Button>
            </VStack>
        </Box>
    );
};

export default SudokuGrid;
