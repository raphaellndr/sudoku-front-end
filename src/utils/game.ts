/**
 * Determines the appropriate color palette for a game status badge based on the game's status and outcome.
 *
 * @param {string} status - The current status of the game.
 * @param {boolean} won - Whether the game was won by the player.
 * @returns {string} A color scheme string suitable for Chakra UI Badge components.
 *
 * @example
 * // returns "green" (won games are always green)
 * getStatusColor("completed", true);
 *
 * @example
 * // returns "blue" (completed but not won)
 * getStatusColor("completed", false);
 *
 * @example
 * // returns "yellow" (game still in progress)
 * getStatusColor("in_progress", false);
 *
 * @example
 * // returns "orange" (game was abandoned)
 * getStatusColor("abandoned", false);
 *
 * @example
 * // returns "red" (game was stopped)
 * getStatusColor("stopped", false);
 *
 * @example
 * // returns "gray" (unknown or default status)
 * getStatusColor("unknown_status", false);
 */
export const getStatusColor = (status: string, won: boolean): string => {
    if (won) return "green";
    if (status === "completed") return "blue";
    if (status === "in_progress") return "yellow";
    if (status === "abandoned") return "orange";
    if (status === "stopped") return "red";
    return "gray";
};
