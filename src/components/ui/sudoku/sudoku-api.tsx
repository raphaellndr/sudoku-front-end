import { Sudoku, SudokuSolution } from "@/types/types";
import { SudokuDifficultyEnum } from "@/types/enums";
import { notifyError } from "@/toasts/toast";
import React from "react";

/**
 * Creates API headers with optional authentication
 */
export const createHeaders = (session: any): HeadersInit => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (session) {
        headers.Authorization = "Bearer " + session.accessToken;
    }

    return headers;
};

/**
 * Creates a new sudoku in the backend
 */
export const createSudoku = async (
    grid: string,
    headers: HeadersInit,
    setSudoku: React.Dispatch<React.SetStateAction<Sudoku>>,
    title = "New sudoku",
    difficulty = SudokuDifficultyEnum.Values.unknown
): Promise<string | null> => {
    if (/^0+$/.test(grid)) {
        notifyError("Cannot create a sudoku with an empty grid!");
        return null;
    }

    const data = {
        title,
        difficulty,
        grid,
    };

    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + "api/sudokus/",
            {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            }
        );

        const responseData = await response.json();
        if (response.ok) {
            const createdSudoku = responseData as Sudoku;
            setSudoku(createdSudoku);
            return responseData.id;
        } else {
            notifyError("Failed to create sudoku: " + JSON.stringify(responseData));
        }
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error: ${error.message}`);
    }
    return null;
};

/**
 * Fetches a solution for a sudoku puzzle
 */
export const fetchSolution = async (
    sudokuId: string,
    headers: HeadersInit,
    setSudoku: (updater: (prevSudoku: Sudoku) => Sudoku) => void
): Promise<void> => {
    console.log("coucuuuuu")
    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/solution/`,
            {
                method: "GET",
                headers,
            }
        );
        const responseData = await response.json();
        if (response.ok) {
            const sudokuSolution = responseData as SudokuSolution;
            setSudoku((prevSudoku) => {
                if (!prevSudoku) return prevSudoku;
                return { ...prevSudoku, solution: sudokuSolution };
            });
        } else {
            notifyError("Failed to fetch solution: " + JSON.stringify(responseData));
        }
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Failed to fetch solution: ${error.message}`);
    }
};

/**
 * Initiates solving a sudoku puzzle
 */
export const solveSudoku = async (
    sudokuId: string,
    headers: HeadersInit
): Promise<Response | undefined> => {
    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/solver/`,
            {
                method: "POST",
                headers,
            }
        );
        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`An error occurred while running task: ${error.message}`);
        return;
    }
};

/**
 * Aborts solving a sudoku puzzle
 */
export const abortSolving = async (
    sudokuId: string,
    headers: HeadersInit
): Promise<boolean> => {
    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/solver/`,
            {
                method: "DELETE",
                headers,
            }
        );
        if (!response.ok) {
            const errorData = await response.json();
            notifyError("Failed to abort task: " + errorData);
            return false;
        }
        return true;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`An error occurred while aborting the task: ${error.message}`);
        return false;
    }
};