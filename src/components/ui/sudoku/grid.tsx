interface SudokuGridProps {
    sudoku: number[][];
}

export default function SudokuGrid({ sudoku }: SudokuGridProps) {
    return (
        <div className="sudoku-grid">
            {sudoku.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div key={`${rowIndex}-${colIndex}`}>
                        {cell !== 0 ? cell : ''}
                    </div>
                ))
            )}
        </div>
    );
}
