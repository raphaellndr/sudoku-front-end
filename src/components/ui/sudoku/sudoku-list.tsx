import { For, VStack } from "@chakra-ui/react";

import { Sudoku, SudokuDifficulty } from "@/types/types";
import SudokuItem from "./sudoku-item";

interface SudokuListProps {
    sudokus: Sudoku[];
    difficulty: SudokuDifficulty | null;
    onSolve: (sudokuId: string) => Promise<void>;
    onAbort: (sudokuId: string) => Promise<void>;
    onDeleteSolution: (sudokuId: string) => Promise<void>;
    onDeleteSudoku: (sudokuId: string) => Promise<void>;
}

const SudokuList: React.FC<SudokuListProps> = (
    { sudokus, difficulty, onSolve, onAbort, onDeleteSolution, onDeleteSudoku }
) => {
    return (
        <For
            each={sudokus}
            fallback={
                <VStack textAlign="center">
                    {`No ${difficulty || ""} sudoku created yet!`}
                </VStack>}
        >
            {(sudoku, _) => <SudokuItem
                key={sudoku.id}
                sudoku={sudoku}
                onSolve={onSolve}
                onAbort={onAbort}
                onDeleteSolution={onDeleteSolution}
                onDeleteSudoku={onDeleteSudoku}
                status={sudoku.status}
            />}
        </For>
    )
};

export default SudokuList;