import { notifyError } from "@/toasts/toast";

const USERS_API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/`;

/**
 * Fetches the games for a specific user identified by UUID.
 *
 * @param {string} userId - The UUID of the user.
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchUserGames = async (userId: string, headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/games/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching user games: ${error.message}`);
        return;
    }
};

/**
 * Fetches the overall statistics for a specific user identified by UUID.
 *
 * @param {string} userId - The UUID of the user.
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchUserStats = async (userId: string, headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/stats/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching user stats: ${error.message}`);
        return;
    }
};

/**
 * Fetches the daily statistics for a specific user identified by UUID.
 *
 * @param {string} userId - The UUID of the user.
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchUserDailyStats = async (userId: string, headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/stats/daily/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching user daily stats: ${error.message}`);
        return;
    }
};

/**
 * Fetches the monthly statistics for a specific user identified by UUID.
 *
 * @param {string} userId - The UUID of the user.
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchUserMonthlyStats = async (userId: string, headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/stats/monthly/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching user monthly stats: ${error.message}`);
        return;
    }
};

/**
 * Fetches the weekly statistics for a specific user identified by UUID.
 *
 * @param {string} userId - The UUID of the user.
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchUserWeeklyStats = async (userId: string, headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/stats/weekly/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching user weekly stats: ${error.message}`);
        return;
    }
};

/**
 * Fetches the yearly statistics for a specific user identified by UUID.
 *
 * @param {string} userId - The UUID of the user.
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchUserYearlyStats = async (userId: string, headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}${userId}/stats/yearly/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching user yearly stats: ${error.message}`);
        return;
    }
};

/**
 * Fetches the leaderboard data.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchLeaderboard = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${USERS_API_BASE_URL}stats/leaderboard/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching leaderboard: ${error.message}`);
        return;
    }
};
