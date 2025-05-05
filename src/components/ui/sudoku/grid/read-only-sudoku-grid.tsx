import { Text } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { BaseSudokuGrid } from "./base-sudoku-grid";
import { useColorModeValue } from "../../color-mode";

interface ReadOnlySudokuGridProps {
    sudoku: Sudoku;
};

export const ReadOnlySudokuGrid: React.FC<ReadOnlySudokuGridProps> = ({
    sudoku,
}) => {
    const textColor = useColorModeValue("black", "white");

    const renderCell = (position: [number, number], index: number) => {
        const originalValue = sudoku.grid[index];
        const solutionValue = sudoku.solution?.grid[index];

        return (
            <Text
                fontWeight={originalValue !== "0" ? "bold" : "normal"}
                color={textColor}
                fontSize="lg"
            >
                {originalValue !== "0" ? originalValue : solutionValue}
            </Text>
        );
    };

    return (
        <BaseSudokuGrid
            sudoku={sudoku}
            renderCell={renderCell}
        />
    );
};
