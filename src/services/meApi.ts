import { notifyError } from "@/toasts/toast";

const ME_API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/me/`;

/**
 * Fetches the current user's data.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchCurrentUser = async (
    headers: HeadersInit,
): Promise<Response> => {
    try {
        const response = await fetch(ME_API_BASE_URL, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching current user: ${errorMessage}`);
        throw error;
    }
};

/**
 * Partially updates the current user's data.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {any} data - The data to be updated for the current user.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const partialUpdateCurrentUser = async (
    headers: HeadersInit,
    data: any,
): Promise<Response> => {
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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error partially updating current user: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fully updates the current user's data.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {any} data - The data to update the current user with.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fullUpdateCurrentUser = async (
    headers: HeadersInit,
    data: any,
): Promise<Response> => {
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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fully updating current user: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the games data for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchCurrentUserGames = async (
    headers: HeadersInit,
): Promise<Response> => {
    try {
        const response = await fetch(`${ME_API_BASE_URL}games/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching current user games: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the overall statistics for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchCurrentUserStats = async (
    headers: HeadersInit,
): Promise<Response> => {
    try {
        const response = await fetch(`${ME_API_BASE_URL}stats/`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error fetching current user stats: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the daily statistics for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {string} [date] - Optional date string in the format YYYY-MM-DD.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchCurrentUserDailyStats = async (
    headers: HeadersInit,
    date?: string,
): Promise<Response> => {
    try {
        const url = new URL(`${ME_API_BASE_URL}stats/daily/`);

        // Append the date parameter if it is provided
        if (date) {
            url.searchParams.append("date", date);
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
        notifyError(`Error fetching current user daily stats: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the weekly statistics for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {number} [week] - Optional week string.
 * @param {number} [year] - Optional year string.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchCurrentUserWeeklyStats = async (
    headers: HeadersInit,
    week?: number,
    year?: number,
): Promise<Response> => {
    try {
        const url = new URL(`${ME_API_BASE_URL}stats/weekly/`);

        // Append the week and year parameters if they are provided
        if (week && year) {
            url.searchParams.append("week", week.toString());
            url.searchParams.append("year", year.toString());
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
        notifyError(`Error fetching current user weekly stats: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the monthly statistics for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {number} [month] - Optional month for which to fetch statistics.
 * @param {number} [year] - Optional year for which to fetch statistics.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchCurrentUserMonthlyStats = async (
    headers: HeadersInit,
    month?: number,
    year?: number,
): Promise<Response> => {
    try {
        const url = new URL(`${ME_API_BASE_URL}stats/monthly/`);

        if (month !== undefined) {
            url.searchParams.append("month", month.toString());
        }
        if (year !== undefined) {
            url.searchParams.append("year", year.toString());
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
        notifyError(`Error fetching current user monthly stats: ${errorMessage}`);
        throw error;
    }
};

/**
 * Fetches the yearly statistics for the current user.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @param {number} year - Optional year for which to fetch statistics.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchCurrentUserYearlyStats = async (
    headers: HeadersInit,
    year?: number,
): Promise<Response> => {
    try {
        const url = new URL(`${ME_API_BASE_URL}stats/yearly/`);

        if (year) {
            url.searchParams.append("year", year.toString());
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
        notifyError(`Error fetching current user yearly stats: ${errorMessage}`);
        throw error;
    }
};

/**
 * Refreshes the current user's statistics.
 *
 * @param {HeadersInit} headers - The headers to be included in the API request.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const refreshCurrentUserStats = async (
    headers: HeadersInit,
): Promise<Response> => {
    try {
        const response = await fetch(`${ME_API_BASE_URL}stats/refresh/`, {
            method: "POST",
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        notifyError(`Error refreshing user stats: ${errorMessage}`);
        throw error;
    }
};
