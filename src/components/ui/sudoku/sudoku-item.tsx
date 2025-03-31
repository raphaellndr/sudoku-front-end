import { memo } from "react";

import { Badge, Box, Button, HStack, Text, VStack } from "@chakra-ui/react";

import SudokuSolutionDisplay from "./sudoku-solution-display";
import { Sudoku, SudokuStatus } from "@/types/types";
import { SudokuStatusEnum } from "@/types/enums";

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
    onDeleteSolution: (sudokuId: string) => Promise<void>;
    onDeleteSudoku: (sudokuId: string) => Promise<void>;
    status: SudokuStatus;
}

const SudokuItem: React.FC<SudokuItemProps> = memo(({ sudoku, onSolve, onAbort, onDeleteSolution, onDeleteSudoku, status }) => {
    return (
        <Box p={4}>
            <VStack align="center">
                <Text fontWeight="bold">
                    {sudoku.title} - {sudoku.difficulty}
                </Text>
                <Badge colorPalette={getStatusColor(status)}>
                    {status || SudokuStatusEnum.Values.created}
                </Badge>
                <SudokuSolutionDisplay sudoku={sudoku} />
                <HStack>
                    <Button
                        disabled={[SudokuStatusEnum.Values.running, SudokuStatusEnum.Values.pending].includes(status as any)}
                        colorPalette="red"
                        variant="subtle"
                        onClick={() => onDeleteSudoku(sudoku.id)}
                    >
                        Delete sudoku
                    </Button>
                    <Button
                        disabled={sudoku.solution ? false : true}
                        colorPalette="red"
                        variant="outline"
                        onClick={() => onDeleteSolution(sudoku.id)}
                    >
                        Delete solution
                    </Button>
                    <Button
                        disabled={![SudokuStatusEnum.Values.running, SudokuStatusEnum.Values.pending].includes(status as any)}
                        colorPalette="red"
                        variant="outline"
                        onClick={() => onAbort(sudoku.id)}
                    >
                        Abort solving
                    </Button>
                    <Button
                        disabled={![SudokuStatusEnum.Values.created, SudokuStatusEnum.Values.aborted, SudokuStatusEnum.Values.failed].includes(status as any)}
                        loadingText="Solving sudoku..."
                        colorPalette="green"
                        variant="subtle"
                        onClick={() => onSolve(sudoku.id)}
                    >
                        Solve sudoku
                    </Button>
                </HStack>
            </VStack>
        </Box>
    )
});

export default SudokuItem;