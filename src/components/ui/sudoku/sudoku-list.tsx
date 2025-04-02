import { For, VStack } from "@chakra-ui/react";

import SudokuSolutionItem from "./sudoku-solution-item";
import { Sudoku, SudokuDifficulty } from "@/types/types";


interface SudokuListProps {
    sudokus: Sudoku[];
    difficulty: SudokuDifficulty | null;
    setSudokus: React.Dispatch<React.SetStateAction<Sudoku[]>>
}

const SudokuList: React.FC<SudokuListProps> = ({ sudokus, difficulty, setSudokus }) => {
    return (
        <>
            <For
                each={sudokus}
                fallback={
                    <VStack textAlign="center">
                        {`No ${difficulty || ""} sudoku created yet!`}
                    </VStack>}
            >
                {(sudoku, _) => <SudokuSolutionItem
                    key={sudoku.id}
                    sudoku={sudoku}
                    setSudokus={setSudokus}
                    status={sudoku.status}
                />}
            </For>
        </>
    )
};

export default SudokuList;