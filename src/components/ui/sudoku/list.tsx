/** Component to fetch and display sudokus */

"use client";

import { useEffect, useState } from "react";
import SudokuItem from "./item";

const SudokuList = () => {
    const [sudokus, setSudokus] = useState<number[][][]>([]);

    useEffect(() => {
        const fetchSudokus = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/sudoku/');
                const data = await response.json();
                setSudokus(data);
            } catch (error) {
                console.error('Error while fetching sudokus', error);
            }
        };

        fetchSudokus();
        console.log("Fetched sudokus: ", sudokus);
    }, []);

    return (
        <div className="sudoku-container">
            {sudokus.length > 0 ? (
                sudokus.map((sudoku, index) => (
                    <SudokuItem key={index} sudoku={sudoku} />
                ))
            ) : (
                <div>Aucun sudoku disponible.</div>
            )}
        </div>
    );
};

export default SudokuList;
