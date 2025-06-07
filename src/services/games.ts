import { notifyError } from "@/toasts/toast";

const GAMES_API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/games/`;

/**
 * Fetches the games from the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchGames = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(GAMES_API_BASE_URL, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching games: ${error.message}`);
        return;
    }
};

/**
 * Creates a new game in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {any} data - The data for the new game.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const createGame = async (headers: HeadersInit, data: any): Promise<Response | undefined> => {
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
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error creating game: ${error.message}`);
        return;
    }
};

/**
 * Fetches a specific game by its ID from the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to fetch.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchGameById = async (headers: HeadersInit, gameId: string): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching game by ID: ${error.message}`);
        return;
    }
};

/**
 * Partially updates a specific game by its ID in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to update.
 * @param {any} data - The data to be updated for the game.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const partialUpdateGameById = async (headers: HeadersInit, gameId: string, data: any): Promise<Response | undefined> => {
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
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error partially updating game by ID: ${error.message}`);
        return;
    }
};

/**
 * Fully updates a specific game by its ID in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to fully update.
 * @param {any} data - The data to update the game with.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fullUpdateGameById = async (headers: HeadersInit, gameId: string, data: any): Promise<Response | undefined> => {
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
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fully updating game by ID: ${error.message}`);
        return;
    }
};

/**
 * Deletes a specific game by its ID from the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to delete.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const deleteGameById = async (headers: HeadersInit, gameId: string): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/`, {
            method: "DELETE",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error deleting game by ID: ${error.message}`);
        return;
    }
};

/**
 * Marks as abandoned a specific game by its ID in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to abandon.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const abandonGameById = async (headers: HeadersInit, gameId: string): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/abandon/`, {
            method: "POST",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error marking the game as abandoned: ${error.message}`);
        return;
    }
};

/**
 * Marks as completed a specific game by its ID in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to complete.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const completeGameById = async (headers: HeadersInit, gameId: string): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/complete/`, {
            method: "POST",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error marking the game as completed: ${error.message}`);
        return;
    }
};

/**
 * Marks as stopped a specific game by its ID in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} gameId - The ID of the game to stop.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const stopGameById = async (headers: HeadersInit, gameId: string): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}${gameId}/stop/`, {
            method: "POST",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error marking the game as stopped: ${error.message}`);
        return;
    }
};

/**
 * Fetches the best scores from the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchBestScores = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${GAMES_API_BASE_URL}best_scores/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching the best scores: ${error.message}`);
        return;
    }
};

/**
 * Bulk deletes games by their IDs in the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string[]} gameIds - An array of game IDs to delete.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const bulkDeleteGames = async (headers: HeadersInit, gameIds: string[]): Promise<Response | undefined> => {
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
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error bulk deleting games: ${error.message}`);
        return;
    }
};

/**
 * Fetches recent games from the backend API.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {number} [limit=10] - The maximum number of recent games to fetch.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchRecentGames = async (headers: HeadersInit, limit: number = 10): Promise<Response | undefined> => {
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
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching recent games: ${error.message}`);
        return;
    }
};
