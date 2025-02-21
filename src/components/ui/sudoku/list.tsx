/** Component to fetch and display sudokus */

"use client";

import { useEffect, useState } from "react";
import SudokuItem from "./item";
import SudokuForm from "./form";

interface Sudoku {
    id: number;
    sudoku: number[][];
}

const SudokuList: React.FC = () => {
    const [sudokus, setSudokus] = useState<Sudoku[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSudokus = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/sudoku/");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSudokus(data);
            } catch (error) {
                console.error("Error while fetching sudokus", error);
            }
        };

        fetchSudokus();
    }, []);

    const handleCreateSudoku = async (newSudoku: number[][]) => {
        try {
            const response = await fetch("http://localhost:8000/api/sudoku/sudokus/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sudoku: newSudoku }),
            })

            if (response.ok) {
                const createdSudoku = await response.json();
                setSudokus([...sudokus, createdSudoku]);
            } else {
                throw new Error(`Error while creating sudoku. status: ${response.status}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                setError(error.message);
            } else {
                console.error("An unkonwn error occurred while creating sudoku", error);
                setError("An unknown error occurred while created sudoku.");
            }
        }
    }

    return (
        <div className="sudoku-container">
            <SudokuForm onCreateSudoku={handleCreateSudoku} />
            {sudokus.length > 0 ? (
                sudokus.map((sudoku, index) => (
                    <SudokuItem key={sudoku.id} sudoku={sudoku.sudoku} />
                ))
            ) : (
                <div>No sudoku available.</div>
            )}
        </div>
    );
};

export default SudokuList;
