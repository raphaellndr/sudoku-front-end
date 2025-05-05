import { Sudoku, SudokuSolution } from "@/types/types";
import { SudokuDifficultyEnum } from "@/types/enums";
import { notifyError } from "@/toasts/toast";

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
    title = "New sudoku",
    difficulty = SudokuDifficultyEnum.Values.unknown
): Promise<Response | undefined> => {
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
        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error: ${error.message}`);
        return;
    }
};

/**
 * Fetches a solution for a sudoku puzzle
 */
export const fetchSolution = async (
    sudokuId: string,
    headers: HeadersInit,
    setSudoku: (updater: (prevSudoku: Sudoku) => Sudoku) => void
): Promise<void> => {
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
): Promise<Response | undefined> => {
    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus/${sudokuId}/solver/`,
            {
                method: "DELETE",
                headers,
            }
        );
        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`An error occurred while aborting the task: ${error.message}`);
        return;
    }
};
