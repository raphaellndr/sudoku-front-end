import { Flex, SimpleGrid, Spinner } from "@chakra-ui/react";

import { StatsPeriod, UserStats } from "@/types/stats";
import { useStatsEvolution } from "@/hooks/use-stats-evolution";

import AverageTime from "./average-time";
import GamesWon from "./games-won";
import WinRate from "./win-rate";
import GamesPlayed from "./games-played";
import AverageScore from "./average-score";
import TotalScore from "./total-score";

interface StatsGridProps {
    currentStats: UserStats | null;
    previousStats: UserStats | null;
    isLoading: boolean;
    period: StatsPeriod;
};

const StatsGrid: React.FC<StatsGridProps> = ({
    currentStats,
    previousStats,
    isLoading,
    period,
}) => {
    // Compute stats evolution only if previousStats isn't null
    let evolution = null
    if (previousStats) {
        evolution = useStatsEvolution(currentStats, previousStats);
    }

    if (isLoading) {
        return (
            <Flex justify="center" align="center" height="200px">
                <Spinner size="lg" color="blue.500" />
            </Flex>
        );
    }

    // Helper function to get comparison text
    const getComparisonText = (period: StatsPeriod): string => {
        switch (period) {
            case "daily": return "since yesterday";
            case "weekly": return "since last week";
            case "monthly": return "since last month";
            case "yearly": return "since last year";
            case "allTime": return "";
            default: return "since last period";
        }
    };

    const comparisonText = getComparisonText(period);

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <TotalScore
                value={currentStats ? currentStats.total_score : 0}
                evolution={evolution ? evolution.total_score : null}
                evolutionPercentage={evolution ? evolution.percentageChanges.total_score : null}
                helpText={comparisonText}
            />
            <AverageScore
                value={currentStats ? currentStats.average_score : 0.0}
                evolution={evolution ? evolution.average_score : null}
                evolutionPercentage={evolution ? evolution.percentageChanges.average_score : null}
                helpText={comparisonText}
            />
            <GamesPlayed
                value={currentStats ? currentStats.total_games : 0}
                evolution={evolution ? evolution.total_games : null}
                evolutionPercentage={evolution ? evolution.percentageChanges.total_games : null}
                helpText={comparisonText}
            />
            <WinRate
                value={currentStats ? currentStats.win_rate : 0.0}
                evolution={evolution ? evolution.win_rate : null}
                evolutionPercentage={evolution ? evolution.percentageChanges.win_rate : null}
                helpText={comparisonText}
            />
            <GamesWon
                value={currentStats ? currentStats.won_games : 0}
                evolution={evolution ? evolution.won_games : null}
                evolutionPercentage={evolution ? evolution.percentageChanges.won_games : null}
                helpText={comparisonText}
            />
            <AverageTime
                value={currentStats ? currentStats.average_time_seconds : 0.0}
                evolution={evolution ? evolution.average_time_seconds : null}
                evolutionPercentage={evolution ? evolution.percentageChanges.average_time_seconds : null}
                helpText={comparisonText}
            />
        </SimpleGrid>
    );
};

export default StatsGrid;
