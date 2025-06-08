const BASE_SCORE = 1000;

/**
 * Calculates the final score based on the number of hints used, checks used,
 * deletions made, and time taken (in seconds) to complete a puzzle.
 *
 * @param {number} hintsUsed - The number of hints used.
 * @param {number} checksUsed - The number of checks used.
 * @param {number} deletions - The number of deletions made.
 * @param {number} timeTaken - The time taken to complete the puzzle, in seconds.
 * @returns {number} - The calculated score, which is guaranteed to be non-negative.
 */
export const calculateScore = (
    hintsUsed: number,
    checksUsed: number,
    deletions: number,
    timeTaken: number,
): number => {
    const hintsPenalty = hintsUsed * 100;
    const checksPenalty = checksUsed * 50;
    const deletionsPenalty = deletions * 5;
    const timePenalty = Math.floor(timeTaken / 60) * 15;

    return Math.max(
        BASE_SCORE - hintsPenalty - checksPenalty - deletionsPenalty - timePenalty,
        0
    );
};
