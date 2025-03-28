import React, { useState } from "react";

import { Box, VStack, Button, HStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { SudokuDifficultyEnum } from "@/types/enums";
import DifficultySelect from "./difficulty-select";
import SudokuGridCreator from "./sudoku-grid-creator";
import { notifyError, notifySuccess } from "@/toasts/toast";
import { Sudoku } from "@/types/types";

interface SudokuCreatorProps {
    onSudokuCreated: React.Dispatch<React.SetStateAction<Sudoku[]>>;
}

const SudokuCreator: React.FC<SudokuCreatorProps> = ({ onSudokuCreated }) => {
    const { data: session, status } = useSession();
    const [sudokuGrid, setSudokuGrid] = useState<number[][]>(Array(9).fill(Array(9).fill(0)));
    const [difficulty, setDifficulty] = useState(SudokuDifficultyEnum.options[0]);

    const gridToString = () => {
        return sudokuGrid.map(row => row.join("")).join("");
    };

    const resetSudokuGrid = () => {
        setSudokuGrid(Array(9).fill(Array(9).fill(0)))
    }

    const handleCreateSudoku = async () => {
        if (session) {
            const stringGrid = gridToString();
            if (/^0+$/.test(stringGrid)) {
                notifyError("Cannot create a sudoku with an empty grid!");
            } else {
                const data = {
                    title: "New Sudoku", // Default title for now
                    difficulty: difficulty,
                    grid: stringGrid,
                };
                try {
                    const response = await fetch(
                        process.env.NEXT_PUBLIC_BACKEND_URL + "api/sudoku/sudokus/",
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
                    if (response.ok) {
                        notifySuccess("Successfully created sudoku!");
                        resetSudokuGrid();
                        const sudoku = responseData as Sudoku;
                        onSudokuCreated((prevSudokus) => [sudoku, ...prevSudokus]);
                    } else {
                        notifyError("Failed to create sudoku: " + responseData);
                    }
                } catch (e: unknown) {
                    const error = e as Error;
                    notifyError(`An error occurred while creating sudoku: ${error.message}`);
                }
            }

        }
    }

    return (
        <>
            <Box p={5}>
                <VStack>
                    <h1>Sudoku Creator</h1>
                    <SudokuGridCreator grid={sudokuGrid} setGrid={setSudokuGrid} />
                    <HStack>
                        {/* Ignore setDifficulty type
                        // @ts-ignore */}
                        <DifficultySelect selectedDifficulty={difficulty} setSelectedDifficulty={setDifficulty} />
                        <Button onClick={resetSudokuGrid}>Reset sudoku</Button>
                        <Button onClick={handleCreateSudoku}>Create sudoku</Button>
                    </HStack>
                </VStack>
            </Box>
        </>
    );
};

export default SudokuCreator;
