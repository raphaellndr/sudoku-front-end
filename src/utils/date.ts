/**
 * Calculates the ISO week number for a given date.
 *
 * @param {Date} date - The input date for which to calculate the week number.
 * @returns {number} - The ISO week number of the given date.
 */
export const getWeekNumber = (
    date: Date,
): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

/**
 * Formats a date string into a human-readable format
 * 
 * @param dateString - ISO date string or null
 * @returns Formatted date string in "MMM D, HH:MM" format or "N/A" if input is null
 * 
 * @example
 * formatDate("2024-03-15T14:30:00Z") // Returns "Mar 15, 02:30 PM"
 * formatDate(null) // Returns "N/A"
 */
export const formatDate = (
    dateString: string | null
): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};
