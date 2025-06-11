import { useEffect, useState } from "react";

import {
    Accordion,
    Card,
    Flex,
    Heading,
    Spinner,
    Tabs,
} from "@chakra-ui/react";
import { LuRefreshCw, LuCalendarDays, LuCalendar, LuTrendingUp, LuClock } from "react-icons/lu";
import { useSession } from "next-auth/react";
import { IoBarChartOutline } from "react-icons/io5";

import {
    fetchCurrentUserMonthlyStats,
    fetchCurrentUserStats,
    fetchCurrentUserDailyStats,
    fetchCurrentUserWeeklyStats,
    fetchCurrentUserYearlyStats
} from "@/services/meApi";
import { createHeaders } from "@/utils/apiUtils";
import { StatsPeriod, UserStats } from "@/types/types";


import StatsGrid from "./stats-grid";
import TooltipIconButton from "../../tooltip-icon-button";

interface PeriodStats {
    data: UserStats | null;
    isLoading: boolean;
}

interface StatsData {
    daily: PeriodStats;
    weekly: PeriodStats;
    monthly: PeriodStats;
    yearly: PeriodStats;
    allTime: PeriodStats;
}

const StatsBody: React.FC = () => {
    const { data: session, status } = useSession();
    const headers = createHeaders(session);

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>("monthly");

    // Stats data for different periods
    const [statsData, setStatsData] = useState<StatsData>({
        daily: { data: null, isLoading: false },
        weekly: { data: null, isLoading: false },
        monthly: { data: null, isLoading: false },
        yearly: { data: null, isLoading: false },
        allTime: { data: null, isLoading: false }
    });

    // Helper function to update stats for a specific period
    const updateStatsForPeriod = (period: StatsPeriod, data: Partial<PeriodStats>): void => {
        setStatsData(prev => ({
            ...prev,
            [period]: {
                ...prev[period],
                ...data
            }
        }));
    };

    // Load stats for a specific period
    const loadStatsForPeriod = async (period: StatsPeriod): Promise<void> => {
        if (!session?.accessToken) {
            console.log("No session or access token available");
            return;
        }

        updateStatsForPeriod(period, { isLoading: true });

        try {
            let statsResponse: Response;

            switch (period) {
                case "daily":
                    statsResponse = await fetchCurrentUserDailyStats(headers);
                    break;

                case "weekly":
                    statsResponse = await fetchCurrentUserWeeklyStats(headers);
                    break;

                case "monthly":
                    statsResponse = await fetchCurrentUserMonthlyStats(headers);
                    break;

                case "yearly":
                    statsResponse = await fetchCurrentUserYearlyStats(headers);
                    break;

                case "allTime":
                    statsResponse = await fetchCurrentUserStats(headers);
                    break;

                default:
                    throw new Error(`Unknown period: ${period}`);
            }

            const stats = await statsResponse.json() as UserStats;

            updateStatsForPeriod(period, {
                data: stats,
                isLoading: false
            });

        } catch (error) {
            console.error(`Failed to load ${period} stats:`, error);
            updateStatsForPeriod(period, { isLoading: false });
        }
    };

    // Load initial data (monthly by default)
    useEffect(() => {
        if (session?.accessToken) {
            loadStatsForPeriod("monthly");
        }
    }, [session?.accessToken]);

    // Handle period change
    const handlePeriodChange = (period: string): void => {
        const typedPeriod = period as StatsPeriod;
        setSelectedPeriod(typedPeriod);

        // Load data for this period if not already loaded
        if (!statsData[typedPeriod].data && !statsData[typedPeriod].isLoading) {
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
                            Your Game Statistics
                        </Heading>
                        <TooltipIconButton
                            leftIcon={isRefreshing ? (
                                <Spinner size="sm" />
                            ) : (
                                <LuRefreshCw />
                            )}
                            tooltipText={isRefreshing ? "Stats are being refreshed" : "Refresh stats"}
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        />
                    </Flex>
                </Card.Header>
                <Card.Body>
                    <Tabs.Root
                        defaultValue="monthly"
                        value={selectedPeriod}
                        onValueChange={(d) => handlePeriodChange(d.value)}
                    >
                        <Tabs.List>
                            <Tabs.Trigger value="daily">
                                <LuClock />
                                Today
                            </Tabs.Trigger>
                            <Tabs.Trigger value="weekly">
                                <LuCalendarDays />
                                This Week
                            </Tabs.Trigger>
                            <Tabs.Trigger value="monthly">
                                <LuCalendar />
                                This Month
                            </Tabs.Trigger>
                            <Tabs.Trigger value="yearly">
                                <LuTrendingUp />
                                This Year
                            </Tabs.Trigger>
                            <Tabs.Trigger value="allTime">
                                <IoBarChartOutline />
                                All Time
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="daily">
                            <StatsGrid
                                stats={statsData.daily.data}
                                isLoading={statsData.daily.isLoading}
                            />
                        </Tabs.Content>

                        <Tabs.Content value="weekly">
                            <StatsGrid
                                stats={statsData.weekly.data}
                                isLoading={statsData.weekly.isLoading}
                            />
                        </Tabs.Content>

                        <Tabs.Content value="monthly">
                            <StatsGrid
                                stats={statsData.monthly.data}
                                isLoading={statsData.monthly.isLoading}
                            />
                        </Tabs.Content>

                        <Tabs.Content value="yearly">
                            <StatsGrid
                                stats={statsData.yearly.data}
                                isLoading={statsData.yearly.isLoading}
                            />
                        </Tabs.Content>

                        <Tabs.Content value="allTime">
                            <StatsGrid
                                stats={statsData.allTime.data}
                                isLoading={statsData.allTime.isLoading}
                            />
                        </Tabs.Content>
                    </Tabs.Root>
                </Card.Body>
            </Card.Root>
        </Accordion.ItemBody>
    );
};

export default StatsBody;
