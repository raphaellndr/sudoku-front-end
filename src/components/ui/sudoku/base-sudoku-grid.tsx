import { Box, Grid, Text, Input } from "@chakra-ui/react";
import { useColorModeValue } from "../color-mode";
import { SudokuSolution } from "@/types/types";

interface BaseSudokuGridProps {
    mode: "create" | "display";
    grid: string | number[][];
    onCellChange?: (rowIndex: number, colIndex: number, value: string) => void;
    solution?: SudokuSolution | null
}

export const BaseSudokuGrid: React.FC<BaseSudokuGridProps> = ({
    mode,
    grid,
    onCellChange,
    solution
}) => {
    // Shared styling values
    const bgColor = useColorModeValue("gray.100", "gray.800");
    const borderColor = useColorModeValue("gray.300", "gray.600");
    const boxShadow = useColorModeValue("0 4px 12px rgba(0, 0, 0, 0.05)", "0 4px 12px rgba(0, 0, 0, 0.2)");
    const originalValueColor = useColorModeValue("black", "white");
    const filledValueColor = useColorModeValue("gray.600", "gray.400");
    const strongBorderColor = useColorModeValue("black", "white");


    // Normalize grid to a flat array for consistent handling
    const flatGrid = Array.isArray(grid) ? grid.flat().join("") : (grid);

    return (
        <Box
            borderRadius="xl"
            boxShadow={boxShadow}
            bg={bgColor}
            p={4}
        >
            <Grid
                templateColumns="repeat(9, 1fr)"
                width="fit-content"
                border={`1px solid ${strongBorderColor}`}
                borderRadius="md"
            >
                {Array.from({ length: 81 }).map((_, index) => {
                    const rowIndex = Math.floor(index / 9);
                    const colIndex = index % 9;

                    // Get the cell value based on grid format
                    const cellValue = flatGrid[index]?.toString() || "0";
                    const isOriginal = mode === "display" && cellValue !== "0";
                    const solutionValue = solution ? solution.grid[index] : null;

                    // Determine box background color
                    const isEvenBox = (Math.floor(rowIndex / 3) + Math.floor(colIndex / 3)) % 2 === 0;
                    const boxBgColor = isEvenBox
                        ? useColorModeValue("gray.100", "gray.700")
                        : useColorModeValue("white", "gray.800");

                    return (
                        <Box
                            key={index}
                            width="40px"
                            height="40px"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            bg={boxBgColor}
                            borderWidth="1px"
                            borderTopLeftRadius={colIndex === 0 && rowIndex == 0 ? "md" : ""}
                            borderTopRightRadius={colIndex === 8 && rowIndex == 0 ? "md" : ""}
                            borderBottomLeftRadius={colIndex === 0 && rowIndex == 8 ? "md" : ""}
                            borderBottomRightRadius={colIndex === 8 && rowIndex == 8 ? "md" : ""}
                            borderColor={borderColor}
                            _hover={{ bg: useColorModeValue("gray.200", "gray.900") }}
                            position="relative"
                        >
                            {mode === "create" ? (
                                <Input
                                    width="40px"
                                    height="40px"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[1-9]"
                                    maxLength={1}
                                    value={cellValue !== "0" ? cellValue : ""}
                                    onChange={(e) => onCellChange?.(rowIndex, colIndex, e.target.value)}
                                    textAlign="center"
                                    fontSize="xl"
                                    fontWeight="bold"
                                    border="none"
                                    bg="transparent"
                                />
                            ) : (
                                (solutionValue || cellValue !== "0") && (
                                    <Text
                                        fontWeight={isOriginal ? "bold" : "normal"}
                                        color={isOriginal ? originalValueColor : filledValueColor}
                                        fontSize="lg"
                                    >
                                        {solutionValue || (cellValue !== "0" ? cellValue : "")}
                                    </Text>
                                )
                            )}
                        </Box>
                    );
                })}
            </Grid>
        </Box>
    );
};