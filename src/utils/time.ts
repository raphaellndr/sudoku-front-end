/**
 * Formats a time duration given in seconds into a string with minutes and seconds.
 *
 * @param {number} seconds - The time duration in seconds to be formatted.
 * @param {Object} [options] - Optional formatting options.
 * @param {boolean} [options.withUnits=true] - Whether to include "m" and "s" units.
 * @param {boolean} [options.padZeros=false] - Whether to pad numbers with leading zeros.
 * @returns {string} A string representing the formatted time.
 *
 * @example
 * // returns "5m 30s"
 * formatTime(330, { withUnits: true, padZeros: false });
 *
 * @example
 * // returns "05:30"
 * formatTime(330);
 *
 * @example
 * // returns "0m 45s"
 * formatTime(45, { withUnits: true, padZeros: false });
 *
 * @example
 * // returns "0:45"
 * formatTime(45);
 */
export const formatTime = (
    seconds: number,
    options: { withUnits?: boolean; padZeros?: boolean } = {}
): string => {
    const { withUnits = false, padZeros = true } = options;

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const formatNumber = (num: number): string => {
        return padZeros ? num.toString().padStart(2, "0") : num.toString();
    };

    if (withUnits) {
        return `${formatNumber(mins)}m ${formatNumber(secs)}s`;
    } else {
        return `${formatNumber(mins)}:${formatNumber(secs)}`;
    }
};
