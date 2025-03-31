import { BaseSudokuGrid } from "./base-sudoku-grid";

interface SudokuGridCreatorProps {
    grid: number[][];
    setGrid: React.Dispatch<React.SetStateAction<number[][]>>;
}

const SudokuGridCreator: React.FC<SudokuGridCreatorProps> = ({ grid, setGrid }) => {
    const handleChange = (rowIndex: number, colIndex: number, value: string) => {
        const newSudokuGrid = grid.map((row, rIndex) =>
            row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? parseInt(value) || 0 : cell))
        );
        setGrid(newSudokuGrid);
    };

    return (
        <BaseSudokuGrid
            mode="create"
            grid={grid}
            onCellChange={handleChange}
        />
    );
};

export default SudokuGridCreator;