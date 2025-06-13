import { notifyError } from "@/toasts/toast";
import { SudokuDifficultyEnum } from "@/enums/sudoku";
import { SudokuDifficulty } from "@/types/sudoku";

const SUDOKUS_API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/sudokus/`;

/**
 * Creates a new Sudoku puzzle in the backend.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} grid - The grid representation of the Sudoku puzzle.
 * @param {string} [title="New sudoku"] - The title of the Sudoku puzzle.
 * @param {SudokuDifficulty} [difficulty=SudokuDifficultyEnum.Values.unknown] - The difficulty level of
 * the Sudoku puzzle.
 * @returns {Promise<Response>} - A promise that resolves to the API response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const createSudoku = async (
    headers: HeadersInit,
    grid: string,
    title: string = "New sudoku",
    difficulty: SudokuDifficulty = SudokuDifficultyEnum.Values.unknown,
): Promise<Response> => {
    const data = {
        title,
        difficulty,
        grid,
    };

    try {
        const response = await fetch(SUDOKUS_API_BASE_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error creating Sudoku: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the solution for a specified Sudoku puzzle from the backend.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} sudokuId - The ID of the Sudoku puzzle for which to fetch the solution.
 * @returns {Promise<Response>} - A promise that resolves to the API response containing the solution.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchSudokuSolution = async (
    headers: HeadersInit,
    sudokuId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${SUDOKUS_API_BASE_URL}${sudokuId}/solution/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Failed to fetch solution: ${errorMessage}`);
        throw error;
    }
};

/**
 * Initiates the solving process for a specified Sudoku puzzle in the backend.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} sudokuId - The ID of the Sudoku puzzle to solve.
 * @returns {Promise<Response>} - A promise that resolves to the API response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const solveSudoku = async (
    headers: HeadersInit,
    sudokuId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${SUDOKUS_API_BASE_URL}${sudokuId}/solver/`, {
            method: "POST",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`An error occurred while running the solver task: ${errorMessage}`);
        throw error;
    }
};

/**
 * Aborts the solving process for a specified Sudoku puzzle in the backend.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} sudokuId - The ID of the Sudoku puzzle for which to abort solving.
 * @returns {Promise<Response>} - A promise that resolves to the API response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const abortSolving = async (
    headers: HeadersInit,
    sudokuId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${SUDOKUS_API_BASE_URL}${sudokuId}/solver/`, {
            method: "DELETE",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`An error occurred while aborting the solver task: ${errorMessage}`);
        throw error;
    }
};
