import { useState } from "react";

interface SudokuForm {
    onCreateSudoku: (sudoku: number[][]) => void;
}

const SudokuForm: React.FC<SudokuForm> = ({ onCreateSudoku }) => {
    const [sudoku, setSudoku] = useState<number[][]>(Array(9).fill(Array(9).fill(0)));

    const handleChange = (rowIndex: number, colIndex: number, value: string) => {
        const newSudoku = sudoku.map((row, rIndex) =>
            row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? parseInt(value) || 0 : cell))
        );
        setSudoku(newSudoku);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();  // Prevent the form from being submitted
        onCreateSudoku(sudoku);
    };

    return (
        <form onSubmit={handleSubmit} className="sudoku-form">
            <div className="sudoku-grid">
                {sudoku.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <input
                            key={`${rowIndex}-${colIndex}`}
                            type="number"
                            min="0"
                            max="9"
                            value={cell !== 0 ? cell : ''}
                            onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                            className="sudoku-input"
                        />
                    ))
                )}
            </div>
            <button type="submit" className="create-button">
                Create sudoku
            </button>
        </form>
    );
};

export default SudokuForm;
