import { Flex, SimpleGrid, Spinner } from "@chakra-ui/react";

import { UserStats } from "@/types/types";
import AverageTime from "./average-time";
import GamesWon from "./games-won";
import WinRate from "./win-rate";
import GamesPlayed from "./games-played";
import AverageScore from "./average-score";
import TotalScore from "./total-score";

interface StatsGridProps {
    stats: UserStats | null;
    isLoading: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, isLoading }) => {
    if (isLoading) {
        return (
            <Flex justify="center" align="center" height="200px">
                <Spinner size="lg" color="blue.500" />
            </Flex>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <TotalScore
                value={stats ? stats.total_score : 0}
            />
            <AverageScore
                value={stats ? stats.average_score : 0.0}
            />
            <GamesPlayed
                value={stats ? stats.total_games : 0}
            />
            <WinRate
                value={stats ? stats.win_rate : 0.0}
            />
            <GamesWon
                value={stats ? stats.won_games : 0}
            />
            <AverageTime
                value={stats ? stats.average_time_seconds : 0.0}
            />
        </SimpleGrid>
    );
};

export default StatsGrid;
