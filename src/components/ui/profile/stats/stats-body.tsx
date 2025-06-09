import { useEffect, useState } from "react";

import {
    Accordion,
    SimpleGrid,
    Card,
    Flex,
    Heading,
    Spinner,
} from "@chakra-ui/react";
import { LuRefreshCw } from "react-icons/lu";
import { useSession } from "next-auth/react";

import { fetchCurrentUserMonthlyStats, fetchCurrentUserStats } from "@/services/meApi";
import { createHeaders } from "@/utils/apiUtils";
import { UserStats } from "@/types/types";

import GamesWon from "./games-won";
import WinRate from "./win-rate";
import GamesPlayed from "./games-played";
import TotalScore from "./total-score";
import AverageScore from "./average-score";
import TooltipIconButton from "../../tooltip-icon-button";
import AverageTime from "./average-time";
import { useStatsEvolution } from "./use-stats-evolution";

const StatsBody = () => {
    const { data: session, status } = useSession();
    const headers = createHeaders(session);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [currentMonthUserStats, setCurrentMonthUserStats] = useState<UserStats | null>(null);
    const [previousMonthUserStats, setPreviousMonthUserStats] = useState<UserStats | null>(null);

    // Use the evolution hook
    const statsEvolution = useStatsEvolution(currentMonthUserStats, previousMonthUserStats);

    useEffect(() => {
        console.log("statsEvolution:", statsEvolution)
        console.log("currentMonthUserStats:", currentMonthUserStats)
        console.log("previousMonthUserStats:", previousMonthUserStats)
    }, [statsEvolution]);

    useEffect(() => {
        const loadAllStats = async () => {
            if (!session?.accessToken) {
                console.log("No session or access token available");
                return;
            }

            try {
                // Load all-time stats
                const userStatsResponse = await fetchCurrentUserStats(headers);
                const allTimeStats = await userStatsResponse.json() as UserStats;
                setUserStats(allTimeStats);

                // Load current month stats
                const currentMonthResponse = await fetchCurrentUserMonthlyStats(headers);
                const currentMonthStats = await currentMonthResponse.json() as UserStats;
                setCurrentMonthUserStats(currentMonthStats);

                // Load previous month stats
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1;
                const currentYear = currentDate.getFullYear();

                const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
                const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

                const previousMonthResponse = await fetchCurrentUserMonthlyStats(
                    headers, previousMonth, previousYear
                );

                const previousMonthStats = await previousMonthResponse.json() as UserStats;
                setPreviousMonthUserStats(previousMonthStats);


            } catch (error) {
                console.error("Failed to load user stats:", error);
            }
        };

        loadAllStats();
    }, [session?.accessToken]);

    const handleRefresh = async () => {
        setIsRefreshing(true);

        try {
            if (!session?.accessToken) {
                return;
            }

            const [userStatsResponse, currentMonthResponse] = await Promise.all([
                fetchCurrentUserStats(headers),
                fetchCurrentUserMonthlyStats(headers)
            ]);

            const allTimeStats = await userStatsResponse.json() as UserStats;
            const currentMonthStats = await currentMonthResponse.json() as UserStats;

            setUserStats(allTimeStats);
            setCurrentMonthUserStats(currentMonthStats);

            console.log("Stats refreshed");
        } catch (error) {
            console.error("Failed to refresh stats:", error);
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
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                        <TotalScore
                            value={userStats ? userStats.total_score : 0}
                            evolution={statsEvolution?.total_score}
                            evolutionPercentage={statsEvolution?.percentageChanges.total_score}
                        />
                        <AverageScore
                            value={userStats ? userStats.average_score : 0.0}
                            evolution={statsEvolution?.average_score}
                            evolutionPercentage={statsEvolution?.percentageChanges.average_score}
                        />
                        <GamesPlayed
                            value={userStats ? userStats.total_games : 0}
                            evolution={statsEvolution?.total_games}
                            evolutionPercentage={statsEvolution?.percentageChanges.total_games}
                        />
                        <WinRate
                            value={userStats ? userStats.win_rate : 0.0}
                            evolution={statsEvolution?.win_rate}
                            evolutionPercentage={statsEvolution?.percentageChanges.win_rate}
                        />
                        <GamesWon
                            value={userStats ? userStats.won_games : 0}
                            evolution={statsEvolution?.won_games}
                            evolutionPercentage={statsEvolution?.percentageChanges.won_games}
                        />
                        <AverageTime
                            value={userStats ? userStats.average_time_seconds : 0.0}
                            evolution={statsEvolution?.average_time_seconds}
                            evolutionPercentage={statsEvolution?.percentageChanges.average_time_seconds}
                        />
                    </SimpleGrid>
                </Card.Body>
            </Card.Root>
        </Accordion.ItemBody>
    );
};

export default StatsBody;
