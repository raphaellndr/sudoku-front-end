import { useEffect } from "react";

import { Box, SimpleGrid, Text, VStack } from "@chakra-ui/react";

import { Sudoku } from "@/types/types";

interface SudokuGridProps {
    sudokuGrid: string;
};

const DisplaySudokuGrid: React.FC<SudokuGridProps> = ({ sudokuGrid }) => {
    return (
        <Box p={5}>
            <SimpleGrid columns={9}>
                {Array.from({ length: 9 }).map((_, rowIndex) =>
                    Array.from({ length: 9 }).map((_, colIndex) => {
                        const cellIndex = rowIndex * 9 + colIndex;
                        const cellValue = sudokuGrid[cellIndex];
                        return (
                            <Box
                                key={`${rowIndex}-${colIndex}`}
                                width="35px"
                                height="35px"
                                borderWidth="1px"
                                alignContent="center"
                            >
                                <Text key={`${rowIndex}-${colIndex}`} textAlign="center">{cellValue || ''}</Text>
                            </Box>
                        )
                    })
                )}
            </SimpleGrid>
        </Box>
    );
};

interface SudokuListProps {
    sudokus: Sudoku[];
    onFetchSudokus: () => Promise<void>;
};

const SudokuList: React.FC<SudokuListProps> = ({ sudokus, onFetchSudokus }) => {
    useEffect(() => {
        onFetchSudokus();
      }, []);

    return (
        <>
            <VStack p={5}>
                {sudokus.map((sudoku, index) => (
                    <Box key={index}>
                        <Text mb={2}>Sudoku {sudoku.id} - {sudoku.difficulty}</Text>
                        <DisplaySudokuGrid sudokuGrid={sudoku.grid} />
                    </Box>
                ))}
            </VStack>
        </>
    );
};

export default SudokuList;