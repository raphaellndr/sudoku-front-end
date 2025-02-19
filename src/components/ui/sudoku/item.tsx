'use client';

import SudokuGrid from './grid';

interface SudokuItemProps {
    sudoku: number[][];
}

export default function SudokuItem({ sudoku }: SudokuItemProps) {
    const handleSolve = async () => {
        const response = await fetch('http://localhost:8000/api/sudoku/solve/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sudoku }),
        });
        const data = await response.json();
        if (data.solution) {
            // Mettre à jour l'affichage avec la solution
            console.log(data.solution);
        }
    };

    return (
        <div className="sudoku-item">
            <SudokuGrid sudoku={sudoku} />
            <button className="resolve-button" onClick={handleSolve}>
                Résoudre
            </button>
        </div>
    );
}
