import { Input, Text } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { BaseSudokuGrid } from "./base-sudoku-grid";
import { Cell } from "../play-mode/sudoku-player";
import { useColorModeValue } from "../../color-mode";

interface SudokuGameGridProps {
    sudoku: Sudoku;
    grid: Cell[];
    onCellChange: (position: [number, number], value: string) => void;
}

export const SudokuGameGrid: React.FC<SudokuGameGridProps> = ({
    sudoku,
    grid,
    onCellChange,
}) => {
    const originalValueColor = useColorModeValue("black", "white");
    const errorValueColor = useColorModeValue("red.600", "red.400");
    const hintValueColor = useColorModeValue("green.600", "green.400");

    // Handle input validation to only allow numbers 1-9
    const handleInputChange = (position: [number, number], value: string) => {
        // Only allow numbers 1-9 or empty string
        if (value === "" || /^[1-9]$/.test(value)) {
            onCellChange(position, value);
        }
    };

    const renderCell = (position: [number, number], index: number) => {
        const cell = grid.find(cell =>
            cell.position[0] === position[0] && cell.position[1] === position[1]
        )
        const cellValue = cell?.value || "0";
        const isHint = cell?.isHint || false;
        const isOriginal = sudoku.grid[index] !== "0";
        const solutionValue = sudoku.solution?.grid[index];

        // Check if the value is incorrect
        const isIncorrect = cellValue !== "0" && solutionValue && cellValue !== solutionValue;

        // If it's an original cell or a hint, show a fixed value
        if (isOriginal || isHint) {
            return (
                <Text
                    fontWeight="bold"
                    color={isHint ? hintValueColor : originalValueColor}
                    fontSize="lg"
                >
                    {cellValue}
                </Text>
            );
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
                onChange={(e) => handleInputChange(position, e.target.value)}
                textAlign="center"
                fontSize="xl"
                fontWeight={isHint ? "bold" : "normal"}
                border="none"
                bg="transparent"
                color={originalValueColor}
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
