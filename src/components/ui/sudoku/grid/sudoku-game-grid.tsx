import { Input, Text, Box, Flex, IconButton } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { BaseSudokuGrid } from "./base-sudoku-grid";
import { Cell } from "../../play-page/sudoku-player";
import { useColorModeValue } from "../../color-mode";
import { IoIosPlay } from "react-icons/io";

interface SudokuGameGridProps {
    sudoku: Sudoku;
    grid: Cell[];
    setGrid: React.Dispatch<React.SetStateAction<Cell[]>>;
    isCheckModeActive: boolean;
    setIsCheckModeActive: React.Dispatch<React.SetStateAction<boolean>>;
    onCellChange: (position: [number, number], value: string) => void;
    onCellVerify?: (position: [number, number]) => void;
    isPaused: boolean;
    setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
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
    setIsPaused,
}) => {
    // Color Values
    const valueColor = useColorModeValue("black", "white");
    const incorrectValueColor = useColorModeValue("red.600", "red.400");
    const correctValueColor = useColorModeValue("green.600", "green.400");
    const checkModeBg = useColorModeValue("rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.5)");
    const verifiableCellBg = useColorModeValue("blue.50", "blue.900");
    const verifiableCellBorder = useColorModeValue("blue.200", "blue.700");
    const overlayBg = useColorModeValue("rgba(255, 255, 255, 0.85)", "rgba(32, 32, 32, 0.85)");

    // Add a glow effect for verifiable cells
    const verifiableCellGlow = useColorModeValue(
        "0 2px 8px rgba(49, 130, 206, 0.15), 0 0 0 1px rgba(49, 130, 206, 0.2)",
        "0 2px 8px rgba(49, 130, 206, 0.2), 0 0 0 1px rgba(49, 130, 206, 0.3)"
    );

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
        const isCorrect = cellValue === solutionValue;

        // Determine if this cell is verifiable during check mode
        const isVerifiable = isCheckModeActive && isPlayerEntered && !isVerified;

        // Determine cell styling
        let cellColor = valueColor;
        if (isVerified) {
            cellColor = isCorrect ? correctValueColor : incorrectValueColor;
        }

        // Apply special styling for check mode
        const checkModeStyles = isCheckModeActive ? {
            opacity: isVerifiable ? 1 : 0.5,
            bg: isVerifiable ? verifiableCellBg : checkModeBg,
            borderWidth: isVerifiable ? "2px" : "0px",
            borderColor: isVerifiable ? verifiableCellBorder : "transparent",
            borderRadius: isVerifiable ? "md" : "none",
            transition: "opacity 0.2s ease-in-out, background 0.2s ease-in-out",
            cursor: isVerifiable ? "pointer" : "default",
            boxShadow: isVerifiable ? verifiableCellGlow : "none",
        } : {};

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
                    p="2"
                    textAlign="center"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="40px"
                    width="40px"
                    {...checkModeStyles}
                    css={{
                        filter: isPaused ? "blur(5px)" : "none",
                    }}
                >
                    {cellValue}
                </Text>
            );
        }

        // Render editable input cell
        return (
            <Input
                disabled={isCheckModeActive && !isVerifiable}
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
                color={cellColor}
                {...checkModeStyles}
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
                    <IconButton
                        size="2xl"
                        variant="ghost"
                        onClick={() => { setIsPaused(!isPaused) }}
                        _hover={{ bg: "transparent" }}
                    >
                        <IoIosPlay />
                    </IconButton>
                </Flex>
            )}
        </Box>
    );
};
