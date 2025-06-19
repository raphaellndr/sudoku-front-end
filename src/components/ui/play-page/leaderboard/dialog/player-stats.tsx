import { VStack, HStack, Text, Separator, FormatNumber } from "@chakra-ui/react";

import { formatTime } from "@/utils/time";
import { Leaderboard } from "@/types/stats";

import StatCard from "./stat-card";

interface PlayerStatsProps {
    data: Leaderboard;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ data }) => {
    const statsRows = [
        { label: "Games Played", value: data.total_games },
        { label: "Games Won", value: data.won_games },
        { label: "Win Rate", value: <FormatNumber value={data.win_rate} style="percent" /> },
        { label: "Best Time", value: formatTime(data.best_time_seconds) },
        { label: "Average Score", value: data.average_score || 0 },
    ];

    return (
        <VStack gap={6} align="stretch">
            <HStack justify="space-around">
                <StatCard 
                    value={data.total_score} 
                    label="Total Score" 
                    color="blue.600" 
                />
                <StatCard 
                    value={data.best_score} 
                    label="Best Score" 
                    color="green.600" 
                />
            </HStack>

            <Separator />

            <VStack gap={4} align="stretch">
                {statsRows.map(({ label, value }) => (
                    <HStack key={label} justify="space-between">
                        <Text>{label}</Text>
                        <Text fontWeight="medium">{value}</Text>
                    </HStack>
                ))}
            </VStack>
        </VStack>
    );
};

export default PlayerStats;
