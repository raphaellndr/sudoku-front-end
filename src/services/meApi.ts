import { notifyError } from "@/toasts/toast";

const ME_API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/me/`;

/**
 * Fetches the current user's data.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchCurrentUser = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(ME_API_BASE_URL, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching current user: ${error.message}`);
        return;
    }
};

/**
 * Partially updates the current user's data.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {any} data - The data to be updated for the current user.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const partialUpdateCurrentUser = async (headers: HeadersInit, data: any): Promise<Response | undefined> => {
    try {
        const response = await fetch(ME_API_BASE_URL, {
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
        notifyError(`Error partially updating current user: ${error.message}`);
        return;
    }
};

/**
 * Fully updates the current user's data.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {any} data - The data to update the current user with.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fullUpdateCurrentUser = async (headers: HeadersInit, data: any): Promise<Response | undefined> => {
    try {
        const response = await fetch(ME_API_BASE_URL, {
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
        notifyError(`Error fully updating current user: ${error.message}`);
        return;
    }
};

/**
 * Fetches the games data for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchCurrentUserGames = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${ME_API_BASE_URL}games/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching current user games: ${error.message}`);
        return;
    }
};

/**
 * Fetches the overall statistics for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchCurrentUserStats = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${ME_API_BASE_URL}stats/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching current user stats: ${error.message}`);
        return;
    }
};

/**
 * Fetches the daily statistics for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchCurrentUserDailyStats = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${ME_API_BASE_URL}stats/daily/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching current user daily stats: ${error.message}`);
        return;
    }
};

/**
 * Fetches the weekly statistics for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchCurrentUserWeeklyStats = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${ME_API_BASE_URL}stats/weekly/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching current user weekly stats: ${error.message}`);
        return;
    }
};

/**
 * Fetches the monthly statistics for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchCurrentUserMonthlyStats = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${ME_API_BASE_URL}stats/monthly/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching current user monthly stats: ${error.message}`);
        return;
    }
};

/**
 * Fetches the yearly statistics for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const fetchCurrentUserYearlyStats = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${ME_API_BASE_URL}stats/yearly/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error fetching current user yearly stats: ${error.message}`);
        return;
    }
};

/**
 * Refreshes the current user's statistics.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response | undefined>} - A promise that resolves to the response or undefined in case of an error.
 */
export const refreshCurrentUserStats = async (headers: HeadersInit): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${ME_API_BASE_URL}stats/refresh/`, {
            method: "POST",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (e: unknown) {
        const error = e as Error;
        notifyError(`Error refreshing user stats: ${error.message}`);
        return;
    }
};
