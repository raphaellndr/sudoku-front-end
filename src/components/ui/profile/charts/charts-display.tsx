import { Flex } from "@chakra-ui/react";

import { ChartDataPoint, ChartsPeriod } from "@/types/charts";

import ChartCard from "./chart-card";
import { useColorModeValue } from "../../color-mode";

const ChartsDisplay = ({ data, period }: { data: ChartDataPoint[], period: ChartsPeriod }) => {
    // Games colors
    const gamesPlayedColor = useColorModeValue("black", "white");
    const winsColor = useColorModeValue("green", "green.400");
    const lossesColor = useColorModeValue("red", "red.400");

    // Score colors
    const scoreColor = useColorModeValue("black", "white");
    const averageScoreColor = useColorModeValue("teal.500", "teal.200");

    return (
        <Flex direction="column" gap={6}>
            <ChartCard
                data={data}
                series={[
                    { name: "games_played", label: "games played", color: gamesPlayedColor },
                    { name: "wins", color: winsColor },
                    { name: "losses", color: lossesColor }
                ]}
                period={period}
                heading="Games Played, Wins & Losses"
            />

            <ChartCard
                data={data}
                series={[
                    { name: "score", color: scoreColor },
                    { name: "average_score", label: "average score", color: averageScoreColor }
                ]}
                period={period}
                heading="Score"
            />
        </Flex>
    );
};

export default ChartsDisplay;
