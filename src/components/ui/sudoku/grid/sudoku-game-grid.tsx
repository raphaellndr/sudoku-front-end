import { Input, Text, Box, Flex } from "@chakra-ui/react";

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
    onCellVerify?: (position: [number, number]) => void;
    isPaused: boolean;
};

export const SudokuGameGrid: React.FC<SudokuGameGridProps> = ({
    sudoku,
    grid,
    setGrid,
    isCheckModeActive,
    setIsCheckModeActive,
    onCellChange,
    onCellVerify,
    isPaused,
}) => {
    // Color Values
    const valueColor = useColorModeValue("black", "white");
    const incorrectValueColor = useColorModeValue("red.600", "red.400");
    const correctValueColor = useColorModeValue("green.600", "green.400");
    const blurryEmptyCellBg = useColorModeValue("gray.400", "gray.700");
    const overlayBg = useColorModeValue("rgba(255, 255, 255, 0.85)", "rgba(32, 32, 32, 0.85)");
    const pauseBoxBg = useColorModeValue("white", "gray.800");

    // Event Handlers
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
        }
    };

    // Cell Rendering Logic
    const renderCell = (position: [number, number], index: number) => {
        // Get cell data
        const isOriginal = sudoku.grid[index] !== "0";
        const cell = grid.find(cell =>
            cell.position[0] === position[0] && cell.position[1] === position[1]
        );
        const cellValue = cell?.value || "0";
        const isHint = cell?.isHint || false;
        const isVerified = cell?.isVerified;
        const solutionValue = sudoku.solution?.grid[index];
        const isPlayerEntered = !isOriginal && !isHint && cellValue !== "0" && cellValue !== "";
        const isEmpty = cellValue === "0" || cellValue === "";
        const isCorrect = cellValue === solutionValue;

        // Determine cell styling
        let cellColor = valueColor;
        if (isVerified) {
            cellColor = isCorrect ? correctValueColor : incorrectValueColor;
        }

        const isBlurryCell = isCheckModeActive && (isEmpty || isOriginal || isHint || (isVerified && isCorrect));
        let blurryFilter = isBlurryCell ? "blur(1px)" : "none";

        // Cell click handler
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

                // Notify parent that a verification was performed
                if (onCellVerify) {
                    onCellVerify(position);
                }

                // Automatically exit check mode after verifying
                setIsCheckModeActive(false);
            }
        };

        // Render static cell (original, hint, or verified correct)
        if (isOriginal || isHint || (isVerified && isCorrect)) {
            return (
                <Text
                    fontWeight="bold"
                    color={(isHint || (isVerified && isCorrect)) ? correctValueColor : valueColor}
                    fontSize="lg"
                    bg={isBlurryCell ? blurryEmptyCellBg : "transparent"}
                    css={{
                        filter: isPaused ? "blur(5px)" : blurryFilter,
                    }}
                >
                    {cellValue}
                </Text>
            );
        }

        // Render editable input cell
        return (
            <Input
                disabled={isCheckModeActive && isEmpty}
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

    // Render the grid (and an overlay when the game is paused)
    return (
        <Box position="relative" borderRadius="md">
            <BaseSudokuGrid
                sudoku={sudoku}
                renderCell={renderCell}
            />

            {/* Pause Overlay */}
            {isPaused && (
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    bg={overlayBg}
                    zIndex="10"
                    justifyContent="center"
                    alignItems="center"
                    transition="opacity 0.3s ease-in-out"
                    borderRadius="md"
                >
                    <Box
                        bg={pauseBoxBg}
                        borderRadius="md"
                        boxShadow="lg"
                        px="6"
                        py="4"
                        transition="transform 0.5s ease-in-out"
                    >
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            userSelect="none"
                        >
                            GAME PAUSED
                        </Text>
                    </Box>
                </Flex>
            )}
        </Box>
    );
};
