import { Input } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { BaseSudokuGrid } from "./base-sudoku-grid";
import { useColorModeValue } from "../../color-mode";

interface SudokuCreatorGridProps {
    sudoku: Sudoku;
    onCellChange: (position:[number, number], value: string) => void;
}

export const SudokuCreatorGrid: React.FC<SudokuCreatorGridProps> = ({
    sudoku, onCellChange,
}) => {
    const filledValueColor = useColorModeValue("gray.600", "gray.400");

    // Handle input validation to only allow numbers 1-9
    const handleInputChange = (position:[number, number], value: string) => {
        // Only allow numbers 1-9 or empty string
        if (value === "" || /^[1-9]$/.test(value)) {
            onCellChange(position, value);
        }
    };

    const renderCell = (position:[number, number], index: number) => {
        const cellValue = sudoku.grid[index]?.toString() || "0";

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
                fontWeight="normal"
                border="none"
                bg="transparent"
                zIndex="1"
                color={filledValueColor}
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
