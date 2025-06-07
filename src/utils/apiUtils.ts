/**
 * Creates and returns API headers with optional authentication.
 *
 * @param {Object} session - The session object containing user authentication details.
 * @returns {HeadersInit} - An object containing the headers to be used in API requests.
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
