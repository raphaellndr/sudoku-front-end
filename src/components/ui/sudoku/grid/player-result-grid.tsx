import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

import { Cell, Sudoku } from "@/types/sudoku";

import { BaseSudokuGrid } from "./base-sudoku-grid";
import { useColorModeValue } from "../../color-mode";

interface PlayerResultGridProps {
    sudoku: Sudoku;
    grid: Cell[];
    isLoading: boolean;
    won: boolean;
}

const PlayerResultGrid: React.FC<PlayerResultGridProps> = ({
    sudoku,
    grid,
    isLoading,
    won,
}) => {
    const textColor = useColorModeValue("black", "white");
    const overlayBg = useColorModeValue("rgba(255, 255, 255, 0.85)", "rgba(32, 32, 32, 0.85)");

    const renderCell = (position: [number, number], index: number) => {
        const originalValue = sudoku.grid[index];
        const solutionValue = sudoku.solution?.grid[index];
        const playerValue = grid[index]?.value;

        // Original clues are always bold and normal color
        if (originalValue !== "0") {
            return (
                <Text
                    fontWeight="bold"
                    color={textColor}
                    fontSize="lg"
                >
                    {originalValue}
                </Text>
            );
        }

        // If player won, show solution in normal color
        if (won) {
            return (
                <Text
                    fontWeight="normal"
                    color={textColor}
                    fontSize="lg"
                >
                    {solutionValue}
                </Text>
            );
        }

        // If player lost, show their input and color wrong answers red
        const isCorrect = playerValue === solutionValue;
        const displayValue = playerValue && playerValue !== "0" ? playerValue : "";

        return (
            <Text
                fontWeight="normal"
                color={isCorrect ? textColor : "red.500"}
                fontSize="lg"
            >
                {displayValue}
            </Text>
        );
    };

    return (
        <Box position="relative" borderRadius="md">
            <BaseSudokuGrid
                sudoku={sudoku}
                renderCell={renderCell}
            />

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

export default PlayerResultGrid;
