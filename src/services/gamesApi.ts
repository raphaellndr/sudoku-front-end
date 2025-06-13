import { notifyError } from "@/toasts/toast";
import { GameRecord } from "@/types/games";

const GAMES_API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/games/`;

/**
 * Fetches the games from the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchGames = async (
    headers: HeadersInit,
): Promise<Response> => {
    try {
        const response = await fetch(GAMES_API_BASE_URL, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error fetching games: ${errorMessage}`);
        throw error;
    }
};

/**
 * Creates a new game in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {GameRecord} data - The data for the new game.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const createGame = async (
    headers: HeadersInit,
    data: GameRecord,
): Promise<Response> => {
    try {
        const response = await fetch(GAMES_API_BASE_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error creating game: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches a specific game by its ID from the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to fetch.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchGameById = async (
    headers: HeadersInit,
    gameId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error fetching game by ID: ${errorMessage}`);
        throw error;
    }
};

/**
 * Partially updates a specific game by its ID in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to update.
 * @param {any} data - The data to be updated for the game.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const partialUpdateGameById = async (
    headers: HeadersInit,
    gameId: string,
    data: any,
): Promise<Response> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error partially updating game by ID: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fully updates a specific game by its ID in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to fully update.
 * @param {GameRecord} data - The data to update the game with.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fullUpdateGameById = async (
    headers: HeadersInit,
    gameId: string,
    data: GameRecord,
): Promise<Response> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error fully updating game by ID: ${errorMessage}`);
        throw error;
    }
};

/**
 * Deletes a specific game by its ID from the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to delete.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const deleteGameById = async (
    headers: HeadersInit,
    gameId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/`, {
            method: "DELETE",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error deleting game by ID: ${errorMessage}`);
        throw error;
    }
};

/**
 * Marks as abandoned a specific game by its ID in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to abandon.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const abandonGameById = async (
    headers: HeadersInit,
    gameId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/abandon/`, {
            method: "POST",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error marking the game as abandoned: ${errorMessage}`);
        throw error;
    }
};

/**
 * Marks as completed a specific game by its ID in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to complete.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const completeGameById = async (
    headers: HeadersInit,
    gameId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/complete/`, {
            method: "POST",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error marking the game as completed: ${errorMessage}`);
        throw error;
    }
};

/**
 * Marks as stopped a specific game by its ID in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to stop.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const stopGameById = async (
    headers: HeadersInit,
    gameId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/stop/`, {
            method: "POST",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error marking the game as stopped: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the best scores from the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchBestScores = async (
    headers: HeadersInit,
): Promise<Response> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}best_scores/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error fetching the best scores: ${errorMessage}`);
        throw error;
    }
};

/**
 * Bulk deletes games by their IDs in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string[]} gameIds - An array of game IDs to delete.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const bulkDeleteGames = async (
    headers: HeadersInit,
    gameIds: string[],
): Promise<Response> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}bulk_delete/`, {
            method: "POST",
            headers,
            body: JSON.stringify({ game_ids: gameIds }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error bulk deleting games: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches recent games from the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {number} [limit=10] - The maximum number of recent games to fetch.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchRecentGames = async (
    headers: HeadersInit,
    limit: number = 10,
): Promise<Response> => {
    try {
        if (limit <= 0) {
            throw new Error("Limit must be a positive integer.");
        }

        const url = new URL(`${GAMES_API_BASE_URL}recent/`);
        url.searchParams.append("limit", limit.toString());

        const response = await fetch(url.toString(), {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notifyError(`Error fetching recent games: ${errorMessage}`);
        throw error;
    }
};
