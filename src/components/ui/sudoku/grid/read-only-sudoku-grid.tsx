import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";
import { BaseSudokuGrid } from "./base-sudoku-grid";
import { useColorModeValue } from "../../color-mode";

interface ReadOnlySudokuGridProps {
    sudoku: Sudoku;
    isLoading: boolean;
};

export const ReadOnlySudokuGrid: React.FC<ReadOnlySudokuGridProps> = ({
    sudoku, isLoading,
}) => {
    // Color values
    const textColor = useColorModeValue("black", "white");
    const overlayBg = useColorModeValue("rgba(255, 255, 255, 0.85)", "rgba(32, 32, 32, 0.85)");

    // Cell rendering logic
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

    // Render the grid (and an overlay when the game is loading)
    return (
        <Box position="relative" borderRadius="md">
            <BaseSudokuGrid
                sudoku={sudoku}
                renderCell={renderCell}
            />

            {/* Loading overlay */}
            {isLoading && (
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
                    <Spinner />
                </Flex>
            )}
        </Box>
    );
};
