import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { createHeaders } from "@/utils/apiUtils";
import { UserStats } from "@/types/stats";
import {
    fetchCurrentUserDailyStats,
    fetchCurrentUserMonthlyStats,
} from "@/services/meApi";
import { ChartDataPoint, ChartsData, ChartsPeriod, PeriodChartData } from "@/types/charts";

const useCharts = () => {
    const { data: session, status } = useSession();
    const headers = createHeaders(session);

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [selectedPeriod, setSelectedPeriod] = useState<ChartsPeriod>("daily");

    const [chartsData, setChartsData] = useState<ChartsData>({
        daily: { data: null, isLoading: false },
        monthly: { data: null, isLoading: false },
    });

    const updateChartsForPeriod = (period: ChartsPeriod, data: Partial<PeriodChartData>): void => {
        setChartsData(prev => ({
            ...prev,
            [period]: {
                ...prev[period],
                ...data
            }
        }));
    };

    const loadChartsForPeriod = async (period: ChartsPeriod): Promise<void> => {
        if (!session?.accessToken) {
            console.log("No session or access token available");
            return;
        }

        updateChartsForPeriod(period, { isLoading: true });

        try {
            let chartData: ChartDataPoint[] = [];

            switch (period) {
                case "daily":
                    for (let i = 29; i >= 0; i--) {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD format

                        try {
                            const response = await fetchCurrentUserDailyStats(headers, dateString);
                            const data = await response.json() as UserStats;

                            chartData.push({
                                period: dateString,
                                games_played: data.total_games || 0,
                                wins: data.won_games || 0,
                                losses: data.lost_games || 0,
                                score: data.total_score || 0,
                                average_score: data.average_score || 0.0,
                            });
                        } catch (dayError) {
                            chartData.push({
                                period: dateString,
                                games_played: 0,
                                wins: 0,
                                losses: 0,
                                score: 0,
                                average_score: 0.0,
                            });
                        }
                    }
                    break;

                case "monthly":
                    for (let i = 11; i >= 0; i--) {
                        const date = new Date();
                        date.setMonth(date.getMonth() - i);
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1;

                        try {
                            const response = await fetchCurrentUserMonthlyStats(headers, month, year);
                            const data = await response.json() as UserStats;

                            const monthName = date.toLocaleString("default", { month: "short" });
                            chartData.push({
                                period: `${monthName} ${year}`,
                                games_played: data.total_games || 0,
                                wins: data.won_games || 0,
                                losses: data.lost_games || 0,
                                score: data.total_score || 0,
                                average_score: data.average_score || 0.0,
                            });
                        } catch (monthError) {
                            const monthName = date.toLocaleString("default", { month: "short" });
                            chartData.push({
                                period: `${monthName} ${year}`,
                                games_played: 0,
                                wins: 0,
                                losses: 0,
                                score: 0,
                                average_score: 0.0,
                            });
                        }
                    }
                    break;

                default:
                    throw new Error(`Unknown period: ${period}`);
            }

            updateChartsForPeriod(period, {
                data: chartData,
                isLoading: false
            });

        } catch (error) {
            console.error(`Failed to load ${period} charts:`, error);
            updateChartsForPeriod(period, { isLoading: false });
        }
    };

    // Load initial data (daily by default)
    useEffect(() => {
        if (session?.accessToken) {
            loadChartsForPeriod("daily");
        }
    }, [session?.accessToken]);

    // Handle period change
    const handlePeriodChange = (period: string): void => {
        const typedPeriod = period as ChartsPeriod;
        setSelectedPeriod(typedPeriod);

        // Load data for this period if not already loaded
        if (!chartsData[typedPeriod].data && !chartsData[typedPeriod].isLoading) {
            loadChartsForPeriod(typedPeriod);
        }
    };

    // Handle refresh for current period
    const handleRefresh = async (): Promise<void> => {
        setIsRefreshing(true);

        try {
            await loadChartsForPeriod(selectedPeriod);
            console.log(`${selectedPeriod} charts refreshed`);
        } catch (error) {
            console.error(`Failed to refresh ${selectedPeriod} charts:`, error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return {
        status,
        chartsData,
        selectedPeriod,
        isRefreshing,
        handlePeriodChange,
        handleRefresh,
        loadChartsForPeriod
    };
};

export default useCharts;
