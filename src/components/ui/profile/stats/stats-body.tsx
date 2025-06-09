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

import { fetchCurrentUserStats } from "@/services/meApi";
import { createHeaders } from "@/utils/apiUtils";
import { UserStats } from "@/types/types";
import GamesWon from "./games-won";
import WinRate from "./win-rate";
import GamesPlayed from "./games-played";
import TotalScore from "./total-score";
import AverageScore from "./average-score";
import TooltipIconButton from "../../tooltip-icon-button";
import AverageTime from "./average-time";

const StatsBody = () => {
    const { data: session, status } = useSession();
    const headers = createHeaders(session);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [userStats, setUserStats] = useState<UserStats | null>(null);

    useEffect(() => {
        const loadUserStats = async () => {
            if (!session?.accessToken) {
                console.log("No session or access token available");
                return;
            }

            try {
                const userStatsResponse = await fetchCurrentUserStats(headers);
                const userStats = await userStatsResponse.json() as UserStats;
                setUserStats(userStats);
            } catch (error) {
                console.error("Failed to load user stats:", error);
            }
        };

        loadUserStats();
    }, []);

    useEffect(() => {
        console.log(userStats);
    }, [userStats]);

    const handleRefresh = async () => {
        setIsRefreshing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsRefreshing(false);
        console.log("Stats refreshed");
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
                        <GamesWon value={userStats ? userStats.won_games : 0} />
                        <WinRate value={userStats ? userStats.win_rate : 0.0} />
                        <GamesPlayed value={userStats ? userStats.total_games : 0} />
                        <TotalScore value={userStats ? userStats.total_score : 0} />
                        <AverageScore value={userStats ? userStats.average_score : 0.0} />
                        <AverageTime value={userStats ? userStats.average_time_seconds : 0.0} />
                    </SimpleGrid>
                </Card.Body>
            </Card.Root>
        </Accordion.ItemBody>
    );
};

export default StatsBody;
