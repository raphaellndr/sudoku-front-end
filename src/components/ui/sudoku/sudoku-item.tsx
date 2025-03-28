import { Sudoku } from "@/types/types";
import { Badge, Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { memo } from "react";
import SudokuGrid from "./sudoku-grid";

const getStatusColor = (status?: string) => {
    switch (status) {
        case "completed": return "green";
        case "running": return "blue";
        case "pending": return "yellow";
        case "failed": return "red";
        case "invalid": return "red";
        case "aborted": return "orange";
        default: return "gray";
    }
};

interface SudokuItemProps {
    sudoku: Sudoku;
    onSolve: (sudokuId: string) => Promise<void>;
    onAbort: (sudokuId: string) => Promise<void>;
    status: string;
    solution: string;
}

const SudokuItem: React.FC<SudokuItemProps> = memo(({ sudoku, onSolve, onAbort, status, solution }) => {
    return (
        <Box borderWidth={1} borderRadius="md" p={4}>
            <VStack align="center">
                <Text fontWeight="bold">
                    Sudoku {sudoku.id} - {sudoku.difficulty}
                </Text>
                <Badge colorPalette={getStatusColor(status)}>
                    {status || "created"}
                </Badge>
                <SudokuGrid sudokuGrid={sudoku.grid} solution={solution} />
                <HStack>
                    <Button onClick={() => onAbort(sudoku.id)} colorScheme="red" variant="outline">
                        Abort solving
                    </Button>
                    <Button onClick={() => onSolve(sudoku.id)} loadingText="Solving sudoku..." colorScheme="green">
                        Solve sudoku
                    </Button>
                </HStack>
            </VStack>
        </Box>
    )
});

export default SudokuItem;