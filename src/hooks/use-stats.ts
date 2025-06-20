import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import {
    fetchCurrentUserMonthlyStats,
    fetchCurrentUserStats,
    fetchCurrentUserDailyStats,
    fetchCurrentUserWeeklyStats,
    fetchCurrentUserYearlyStats
} from "@/services/meApi";
import { createHeaders } from "@/utils/apiUtils";
import { getWeekNumber } from "@/utils/date";
import { PeriodStats, StatsData, StatsPeriod, UserStats } from "@/types/stats";
import { PreviousDateParams } from "@/types/dates";

const getPreviousDateParams = (period: StatsPeriod): PreviousDateParams | {} => {
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

export const useStats = () => {
    const { data: session } = useSession();
    const headers = createHeaders(session);

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>("monthly");
    const [statsData, setStatsData] = useState<StatsData>({
        daily: { current: null, previous: null, isLoading: false },
        weekly: { current: null, previous: null, isLoading: false },
        monthly: { current: null, previous: null, isLoading: false },
        yearly: { current: null, previous: null, isLoading: false },
        allTime: { current: null, previous: null, isLoading: false }
    });

    const updateStatsForPeriod = (period: StatsPeriod, data: Partial<PeriodStats>): void => {
        setStatsData(prev => ({
            ...prev,
            [period]: {
                ...prev[period],
                ...data
            }
        }));
    };

    const loadStatsForPeriod = async (period: StatsPeriod): Promise<void> => {
        if (!session?.accessToken) {
            console.log("No session or access token available");
            return;
        }

        updateStatsForPeriod(period, { isLoading: true });

        try {
            let currentStatsPromise: Promise<Response>;
            let previousStatsPromise: Promise<Response> | null = null;

            const previousParams = getPreviousDateParams(period);

            switch (period) {
                case "daily":
                    if ("date" in previousParams) {
                        currentStatsPromise = fetchCurrentUserDailyStats(headers);
                        previousStatsPromise = fetchCurrentUserDailyStats(headers, previousParams.date);
                    } else {
                        throw new Error("Invalid parameters for daily stats");
                    }
                    break;

                case "weekly":
                    if ("week" in previousParams && "year" in previousParams) {
                        currentStatsPromise = fetchCurrentUserWeeklyStats(headers);
                        previousStatsPromise = fetchCurrentUserWeeklyStats(
                            headers,
                            previousParams.week,
                            previousParams.year
                        );
                    } else {
                        throw new Error("Invalid parameters for weekly stats");
                    }
                    break;

                case "monthly":
                    if ("month" in previousParams && "year" in previousParams) {
                        currentStatsPromise = fetchCurrentUserMonthlyStats(headers);
                        previousStatsPromise = fetchCurrentUserMonthlyStats(
                            headers,
                            previousParams.month,
                            previousParams.year
                        );
                    } else {
                        throw new Error("Invalid parameters for monthly stats");
                    }
                    break;

                case "yearly":
                    if ("year" in previousParams) {
                        currentStatsPromise = fetchCurrentUserYearlyStats(headers);
                        previousStatsPromise = fetchCurrentUserYearlyStats(headers, previousParams.year);
                    } else {
                        throw new Error("Invalid parameters for yearly stats");
                    }
                    break;

                case "allTime":
                    currentStatsPromise = fetchCurrentUserStats(headers);
                    break;

                default:
                    throw new Error(`Unknown period: ${period}`);
            }

            const [currentResponse, previousResponse] = await Promise.all([
                currentStatsPromise,
                previousStatsPromise ? previousStatsPromise : Promise.resolve(new Response(JSON.stringify(null)))
            ]);

            const [currentStats, previousStats] = await Promise.all([
                currentResponse.json() as Promise<UserStats>,
                previousResponse.json().catch(() => null) as Promise<UserStats | null>
            ]);

            updateStatsForPeriod(period, {
                current: currentStats,
                previous: previousStats,
                isLoading: false
            });

        } catch (error) {
            console.error(`Failed to load ${period} stats:`, error);
            updateStatsForPeriod(period, { isLoading: false });
        }
    };

    // Handle period change
    const handlePeriodChange = (period: string): void => {
        const typedPeriod = period as StatsPeriod;
        setSelectedPeriod(typedPeriod);

        // Load data for this period if not already loaded
        if (!statsData[typedPeriod].current && !statsData[typedPeriod].isLoading) {
            loadStatsForPeriod(typedPeriod);
        }
    };

    // Handle refresh for current period
    const handleRefresh = async (): Promise<void> => {
        setIsRefreshing(true);

        try {
            await loadStatsForPeriod(selectedPeriod);
            console.log(`${selectedPeriod} stats refreshed`);
        } catch (error) {
            console.error(`Failed to refresh ${selectedPeriod} stats:`, error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Load initial data (monthly by default)
    useEffect(() => {
        if (session?.accessToken) {
            loadStatsForPeriod("monthly");
        }
    }, [session?.accessToken]);

    return {
        statsData,
        selectedPeriod,
        isRefreshing,
        handlePeriodChange,
        handleRefresh
    };
};
