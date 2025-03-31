import { Sudoku } from "@/types/types";
import { BaseSudokuGrid } from "./base-sudoku-grid";

interface SudokuSolutionDisplayProps {
    sudoku: Sudoku;
}

const SudokuSolutionDisplay: React.FC<SudokuSolutionDisplayProps> = ({ sudoku }) => {
    return (
        <BaseSudokuGrid
            mode="display"
            grid={sudoku.grid}
            solution={sudoku.solution}
        />
    );
};

export default SudokuSolutionDisplay;