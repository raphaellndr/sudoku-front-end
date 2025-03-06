import React, { useState } from "react";

import { Box, VStack, Button, HStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import { SudokuDifficultyEnum } from "@/types/enums";
import DifficultySelect from "./difficulty-select";
import SudokuGrid from "./sudoku-grid";

const SudokuCreator = () => {
    const { data: session, status } = useSession();
    const [sudokuGrid, setSudokuGrid] = useState<number[][]>(Array(9).fill(Array(9).fill(0)));
    const [difficulty, setDifficulty] = useState(SudokuDifficultyEnum.options[0]);

    const notifySuccess = (message: string) => toast.success(message);
    const notifyError = (message: string) => toast.error(
        message,
        {
            position: "bottom-right",
        }
    );

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
                difficulty: difficulty,
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
                    <SudokuGrid grid={sudokuGrid} setGrid={setSudokuGrid} />
                    <HStack>
                        {/* Ignore setDifficulty type
                        // @ts-ignore */}
                        <DifficultySelect selectedDifficulty={difficulty} setSelectedDifficulty={setDifficulty} />
                        <Button onClick={handleResetSudoku}>Reset sudoku</Button>
                        <Button onClick={handleCreateSudoku}>Create sudoku</Button>
                    </HStack>
                </VStack>
            </Box>
        </>
    );
};

export default SudokuCreator;
