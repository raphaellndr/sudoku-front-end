import { Box, Grid, Text } from "@chakra-ui/react";

interface SudokuGridProps {
    sudokuGrid: string;
    solution?: string;
};

const SudokuGrid: React.FC<SudokuGridProps> = ({ sudokuGrid, solution }) => {
    return (
        <Grid
            templateColumns="repeat(9, 1fr)"
            border="2px solid black"
            width="fit-content"
        >
            {Array.from({ length: 81 }).map((_, index) => {
                const rowIndex = Math.floor(index / 9);
                const colIndex = index % 9;
                const originalValue = sudokuGrid[index];
                const solutionValue = solution ? solution[index] : null;

                return (
                    <Box
                        key={index}
                        width="40px"
                        height="40px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        border="1px solid lightgray"
                        borderRight={(colIndex + 1) % 3 === 0 ? "2px solid black" : ""}
                        borderBottom={(rowIndex + 1) % 3 === 0 ? "2px solid black" : ""}
                        borderTop={rowIndex === 0 ? "1px solid black" : ""}
                        borderLeft={colIndex === 0 ? "1px solid black" : ""}
                        fontSize="xl"
                    >
                        {solutionValue ? (
                            <Text
                                fontWeight={originalValue !== "0" ? "bold" : "normal"}
                                color={originalValue !== "0" ? "black" : "gray"}
                            >
                                {solutionValue}
                            </Text>
                        ) : (
                            originalValue !== "0" && (
                                <Text fontWeight="bold">
                                    {originalValue}
                                </Text>
                            )
                        )}
                    </Box>
                );
            })}
        </Grid>
    );
};

export default SudokuGrid;