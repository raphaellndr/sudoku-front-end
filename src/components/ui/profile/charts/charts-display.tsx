import { Flex } from "@chakra-ui/react";

import { ChartsPeriod } from "@/types/stats";

import { ChartDataPoint } from "./charts-body";
import ChartCard from "./chart-card";

const ChartsDisplay = ({ data, period }: { data: ChartDataPoint[], period: ChartsPeriod }) => {
    return (
        <Flex direction="column" gap={6}>
            <ChartCard
                data={data}
                series={[
                    { name: "games_played", label: "games played", color: "blue.solid" },
                    { name: "wins", color: "green.solid" },
                    { name: "losses", color: "red.solid" }
                ]}
                period={period}
                heading="Games Played, Wins & Losses"
            />

            <ChartCard
                data={data}
                series={[
                    { name: "score", color: "purple.solid" },
                    { name: "average_score", label: "average score", color: "yellow.solid" }
                ]}
                period={period}
                heading="Score"
            />
        </Flex>
    );
};

export default ChartsDisplay;
