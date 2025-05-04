import { Text } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { BaseSudokuGrid } from "./base-sudoku-grid";
import { useColorModeValue } from "../../color-mode";

interface ReadOnlySudokuGridProps {
    sudoku: Sudoku;
    showSolution?: boolean;
}

export const ReadOnlySudokuGrid: React.FC<ReadOnlySudokuGridProps> = ({
    sudoku,
    showSolution = false,
}) => {
    const originalValueColor = useColorModeValue("black", "white");

    const renderCell = (rowIndex: number, colIndex: number, index: number) => {
        const cellValue = sudoku.grid[index]?.toString() || "0";
        const solutionValue = sudoku.solution ? sudoku.solution.grid[index] : null;
        const displayValue = showSolution && solutionValue ? solutionValue : cellValue;

        // Only render if there's a value to display
        if (displayValue !== "0") {
            return (
                <Text
                    fontWeight="bold"
                    color={originalValueColor}
                    fontSize="lg"
                >
                    {displayValue}
                </Text>
            );
        }

        return null;
    };

    return (
        <BaseSudokuGrid
            sudoku={sudoku}
            renderCell={renderCell}
        />
    );
};
