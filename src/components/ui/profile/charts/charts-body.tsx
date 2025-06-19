import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import {
    Accordion,
    Card,
    Flex,
    Heading,
    Spinner,
    Tabs,
} from "@chakra-ui/react";
import { LuRefreshCw, LuCalendar, LuClock } from "react-icons/lu";

import { createHeaders } from "@/utils/apiUtils";
import { ChartsPeriod, UserStats } from "@/types/stats";
import {
    fetchCurrentUserDailyStats,
    fetchCurrentUserMonthlyStats,
} from "@/services/meApi";

import ChartsDisplay from "./charts-display";
import TooltipIconButton from "../../tooltip-icon-button";

export interface ChartDataPoint {
    period: string;
    games_played: number;
    wins: number;
    losses: number;
    score: number;
    average_score: number;
}

interface PeriodChartData {
    data: ChartDataPoint[] | null;
    isLoading: boolean;
}

interface ChartsData {
    daily: PeriodChartData;
    monthly: PeriodChartData;
}

const ChartsBody = () => {
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

    if (status === "loading") {
        return (
            <Flex justify="center" align="center" height="300px">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <Accordion.ItemBody>
            <Card.Root>
                <Card.Header>
                    <Flex justify="space-between" align="center">
                        <Heading size="lg" color="fg.emphasized">
                            Your Game Charts
                        </Heading>
                        <TooltipIconButton
                            leftIcon={isRefreshing ? (
                                <Spinner size="sm" />
                            ) : (
                                <LuRefreshCw />
                            )}
                            tooltipText={isRefreshing ? "Charts are being refreshed" : "Refresh charts"}
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        />
                    </Flex>
                </Card.Header>
                <Card.Body>
                    <Tabs.Root
                        defaultValue="daily"
                        value={selectedPeriod}
                        onValueChange={(d) => handlePeriodChange(d.value)}
                    >
                        <Tabs.List>
                            <Tabs.Trigger value="daily">
                                <LuClock />
                                Daily (30 days)
                            </Tabs.Trigger>
                            <Tabs.Trigger value="monthly">
                                <LuCalendar />
                                Monthly (12 months)
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="daily">
                            {chartsData.daily.isLoading ? (
                                <Flex justify="center" align="center" height="300px">
                                    <Spinner size="xl" color="blue.500" />
                                </Flex>
                            ) : chartsData.daily.data ? (
                                <ChartsDisplay data={chartsData.daily.data} period="daily" />
                            ) : (
                                <Flex justify="center" align="center" height="300px">
                                    <Heading size="md" color="fg.muted">
                                        No daily data available
                                    </Heading>
                                </Flex>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value="monthly">
                            {chartsData.monthly.isLoading ? (
                                <Flex justify="center" align="center" height="300px">
                                    <Spinner size="xl" color="blue.500" />
                                </Flex>
                            ) : chartsData.monthly.data ? (
                                <ChartsDisplay data={chartsData.monthly.data} period="monthly" />
                            ) : (
                                <Flex justify="center" align="center" height="300px">
                                    <Heading size="md" color="fg.muted">
                                        No monthly data available
                                    </Heading>
                                </Flex>
                            )}
                        </Tabs.Content>
                    </Tabs.Root>
                </Card.Body>
            </Card.Root>
        </Accordion.ItemBody>
    );
};

export default ChartsBody;
