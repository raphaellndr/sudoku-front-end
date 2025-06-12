import { notifyError } from "@/toasts/toast";

const USERS_API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/`;

/**
 * Fetches the games for a specific user identified by UUID.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchUserGames = async (
    headers: HeadersInit,
    userId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/games/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching user games: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches a specific user identified by their UUID.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchUser = async (
    headers: HeadersInit,
    userId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching user games: ${errorMessage}`);
        throw error;
    }
}

/**
 * Fetches the overall statistics for a specific user identified by UUID.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchUserStats = async (
    headers: HeadersInit,
    userId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/stats/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching user stats: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the daily statistics for a specific user identified by UUID.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchUserDailyStats = async (
    headers: HeadersInit,
    userId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/stats/daily/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching user daily stats: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the monthly statistics for a specific user identified by UUID.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchUserMonthlyStats = async (
    headers: HeadersInit,
    userId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/stats/monthly/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching user monthly stats: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the weekly statistics for a specific user identified by UUID.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchUserWeeklyStats = async (
    headers: HeadersInit,
    userId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/stats/weekly/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching user weekly stats: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the yearly statistics for a specific user identified by UUID.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchUserYearlyStats = async (
    headers: HeadersInit,
    userId: string,
): Promise<Response> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/stats/yearly/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching user yearly stats: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the leaderboard data.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {number} limit - The number of players to fetch.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchLeaderboard = async (
    headers: HeadersInit,
    limit?: number,
): Promise<Response> => {
    try {
        const url = new URL(`${USERS_API_BASE_URL}stats/leaderboard/`);

        if (limit) {
            url.searchParams.append("limit", limit.toString());
        }

        const response = await fetch(url.toString(), {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching leaderboard: ${errorMessage}`);
        throw error;
    }
};
