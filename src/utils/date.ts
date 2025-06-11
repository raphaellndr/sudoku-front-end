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

/**
 * Retrieves parameters for the previous period based on the specified time period.
 *
 * This function calculates the date parameters for the previous period, which can be
 * daily, weekly, monthly, yearly, or all-time. The parameters are useful for comparing
 * statistics or data over different time periods.
 *
 * @param {StatsPeriod} period - The time period for which to calculate the previous date parameters.
 * It can be one of the following: "daily", "weekly", "monthly", "yearly", or "allTime".
 * @returns {Object} - An object containing the date parameters for the previous period.
 * The structure of the object varies based on the period:
 * - For "daily", it returns an object with a `date` property in "YYYY-MM-DD" format.
 * - For "weekly", it returns an object with `week` and `year` properties.
 * - For "monthly", it returns an object with `month` and `year` properties.
 * - For "yearly" and "allTime", it returns an object with a `year` property.
 */
export const getPreviousDateParams = (
    period: StatsPeriod,
): PreviousDateParams | {} => {
    const now = new Date();

    switch (period) {
        case "daily": {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            return {
                date: yesterday.toISOString().split("T")[0] // YYYY-MM-DD format
            };
        }

        case "weekly": {
            const lastWeek = new Date(now);
            lastWeek.setDate(lastWeek.getDate() - 7);
            const year = lastWeek.getFullYear().toString();
            const week = getWeekNumber(lastWeek).toString();
            return { week, year };
        }

        case "monthly": {
            const lastMonth = new Date(now);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return {
                month: lastMonth.getMonth() + 1,
                year: lastMonth.getFullYear()
            };
        }

        case "yearly": {
            const lastYear = now.getFullYear() - 1;
            return { year: lastYear };
        }

        case "allTime": {
            const yearAgo = now.getFullYear() - 1;
            return { year: yearAgo };
        }

        default:
            return {};
    }
};
