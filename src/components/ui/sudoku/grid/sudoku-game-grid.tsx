import { Input, Text } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { BaseSudokuGrid } from "./base-sudoku-grid";
import { useColorModeValue } from "../../color-mode";

interface SudokuGameGridProps {
    sudoku: Sudoku;
    originalGrid: string;
    onCellChange: (rowIndex: number, colIndex: number, value: string) => void;
    hintPositions?: number[];
}

export const SudokuGameGrid: React.FC<SudokuGameGridProps> = ({
    sudoku,
    originalGrid,
    onCellChange,
    hintPositions = [],
}) => {
    const originalValueColor = useColorModeValue("black", "white");
    const errorValueColor = useColorModeValue("red.600", "red.400");
    const hintValueColor = useColorModeValue("green.600", "green.400");

    // Handle input validation to only allow numbers 1-9
    const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
        // Only allow numbers 1-9 or empty string
        if (value === "" || /^[1-9]$/.test(value)) {
            onCellChange(rowIndex, colIndex, value);
        }
    };

    const renderCell = (rowIndex: number, colIndex: number, index: number) => {
        const cellValue = sudoku.grid[index].toString() || "0";
        const isOriginal = originalGrid[index] !== "0";
        const solutionValue = sudoku.solution?.grid[index];
        const isHint = hintPositions.includes(index);

        // Check if the value is incorrect
        const isIncorrect = cellValue !== "0" && solutionValue && cellValue !== solutionValue;

        // If it's an original cell, show a fixed value
        if (isOriginal) {
            return (
                <Text
                    fontWeight="bold"
                    color={originalValueColor}
                    fontSize="lg"
                >
                    {cellValue}
                </Text>
            );
        }

        // Determine the cell color
        let cellColor = originalValueColor;
        if (isIncorrect) {
            cellColor = errorValueColor;
        } else if (isHint) {
            cellColor = hintValueColor;
        }

        // Otherwise render an input for user to fill
        return (
            <Input
                width="40px"
                height="40px"
                type="text"
                inputMode="numeric"
                pattern="[1-9]"
                maxLength={1}
                value={cellValue !== "0" ? cellValue : ""}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                textAlign="center"
                fontSize="xl"
                fontWeight={isHint ? "bold" : "normal"}
                border="none"
                bg="transparent"
                color={cellColor}
                zIndex="1"
                onKeyDown={(e) => {
                    // Prevent non-numeric keys except for backspace, delete, tab, etc.
                    if (
                        !/^[1-9]$/.test(e.key) &&
                        !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)
                    ) {
                        e.preventDefault();
                    }
                }}
            />
        );
    };

    return (
        <BaseSudokuGrid
            sudoku={sudoku}
            renderCell={renderCell}
        />
    );
};
