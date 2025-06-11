import { PreviousDateParams, StatsPeriod } from "@/types/types";

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
