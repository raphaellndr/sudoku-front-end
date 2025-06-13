/**
 * Formats a time duration given in seconds into a string with minutes and seconds.
 *
 * @param {number} seconds - The time duration in seconds to be formatted.
 * @returns {string} A string representing the formatted time in "MM:SS" format.
 *
 * @example
 * // returns "05:30"
 * formatTime(330);
 *
 * @example
 * // returns "00:45"
 * formatTime(45);
 */
export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
