import { Sudoku } from "@/types/sudoku";

import { SudokuCreatorGrid } from "../sudoku/grid/sudoku-creator-grid";
import DisplayGrid from "../sudoku/grid/display-grid";

interface SudokuGridContainerProps {
    mode: "create" | "display" | "solved";
    sudoku: Sudoku;
    isLoading: boolean;
    onCellChange: (position: [number, number], value: string) => void
}

const SudokuGridContainer = ({
    mode,
    sudoku,
    isLoading,
    onCellChange
}: SudokuGridContainerProps) => {
    if (mode === "create") {
        return <SudokuCreatorGrid sudoku={sudoku} onCellChange={onCellChange} />;
    }

    return <DisplayGrid sudoku={sudoku} isLoading={isLoading} />;
};

export default SudokuGridContainer;
