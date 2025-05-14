import { Input, Text } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { BaseSudokuGrid } from "./base-sudoku-grid";
import { Cell } from "../play-mode/sudoku-player";
import { useColorModeValue } from "../../color-mode";

interface SudokuGameGridProps {
    sudoku: Sudoku;
    grid: Cell[];
    setGrid: React.Dispatch<React.SetStateAction<Cell[]>>;
    isCheckModeActive: boolean;
    setIsCheckModeActive: React.Dispatch<React.SetStateAction<boolean>>;
    onCellChange: (position: [number, number], value: string) => void;
    isPaused: boolean;
};

export const SudokuGameGrid: React.FC<SudokuGameGridProps> = ({
    sudoku,
    grid,
    setGrid,
    isCheckModeActive,
    setIsCheckModeActive,
    onCellChange,
    isPaused,
}) => {
    const valueColor = useColorModeValue("black", "white");
    const incorrectValueColor = useColorModeValue("red.600", "red.400");
    const correctValueColor = useColorModeValue("green.600", "green.400");
    const blurryEmptyCellBg = useColorModeValue("gray.100", "gray.700");

    // Handle input validation to only allow numbers 1-9
    const handleInputChange = (position: [number, number], value: string) => {
        // Only allow numbers 1-9 or empty string
        if (value === "" || /^[1-9]$/.test(value)) {
            onCellChange(position, value);

            // Reset verification status when the value changes
            setGrid(prev => {
                return prev.map(cell => {
                    if (cell.position[0] === position[0] && cell.position[1] === position[1]) {
                        return { ...cell, isVerified: false };
                    }
                    return cell;
                });
            });
        };
    };

    const renderCell = (position: [number, number], index: number) => {
        // Check if the cell is an original value or not
        const isOriginal = sudoku.grid[index] !== "0";

        // Get cell in the grid
        const cell = grid.find(cell =>
            cell.position[0] === position[0] && cell.position[1] === position[1]
        );

        // Get cell value default to "0"
        const cellValue = cell?.value || "0";

        // Check if the cell is a hint or not
        const isHint = cell?.isHint || false;

        // Check if this cell has been verified and is correct
        const isVerified = cell?.isVerified;

        // Get the solution value (if any)
        const solutionValue = sudoku.solution?.grid[index];

        // Determine if this is a player-entered value
        const isPlayerEntered = !isOriginal && !isHint && cellValue !== "0" && cellValue !== "";

        // Check if the cell is empty
        const isEmpty = cellValue === "0" || cellValue === "";

        // Check if the value is correct
        const isCorrect = cellValue === solutionValue;

        // Determine cell color
        let cellColor = valueColor;
        if (isVerified) {
            cellColor = isCorrect ? correctValueColor : incorrectValueColor;
        };

        const handleCellClick = () => {
            if (isCheckModeActive && isPlayerEntered) {
                // Mark this cell as verified
                setGrid(prev => {
                    return prev.map(cell => {
                        if (cell.position[0] === position[0] && cell.position[1] === position[1]) {
                            return { ...cell, isVerified: true };
                        }
                        return cell;
                    });
                });

                // Automatically exit check mode after verifying
                setIsCheckModeActive(false);
            };
        };

        // Style for blurry empty, hint and correct cells in check mode
        const isBlurryCell = isCheckModeActive && (isEmpty || isOriginal || isHint || (isVerified && isCorrect));

        let blurryFilter = "none";
        if (isPaused) {
            blurryFilter = "blur(5px)";
        } else if (isBlurryCell) {
            blurryFilter = "blur(1px)";
        };

        // If it's an original cell or a hint, show a fixed value
        if (isOriginal || isHint || (isVerified && isCorrect)) {
            return (
                <Text
                    fontWeight="bold"
                    color={(isHint || (isVerified && isCorrect)) ? correctValueColor : valueColor}
                    fontSize="lg"
                    css={{
                        filter: blurryFilter,
                        transition: "all 0.2s ease-in-out",
                    }}
                >
                    {cellValue}
                </Text>
            );
        };

        // Otherwise render an input for user to fill
        return (
            <Input
                disabled={(isCheckModeActive && isEmpty) || isPaused}
                width="40px"
                height="40px"
                type="text"
                inputMode="numeric"
                pattern="[1-9]"
                maxLength={1}
                value={cellValue !== "0" ? cellValue : ""}
                onChange={(e) => handleInputChange(position, e.target.value)}
                onClick={handleCellClick}
                textAlign="center"
                fontSize="xl"
                border="none"
                borderRadius="none"
                bg={isBlurryCell ? blurryEmptyCellBg : "transparent"}
                color={cellColor}
                css={{
                    caretColor: "black",
                    filter: isPaused ? "blur(5px)" : "none",
                    transition: "all 0.2s ease-in-out",
                }}
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
