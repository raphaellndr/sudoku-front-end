import { useState } from "react";

import {
    Accordion,
    SimpleGrid,
    Card,
    Flex,
    Heading,
    Spinner,
} from "@chakra-ui/react";
import { LuRefreshCw } from "react-icons/lu";

import GamesWon from "./games-won";
import WinRatio from "./win-ratio";
import GamesPlayed from "./games-played";
import TotalScore from "./total-score";
import AverageScore from "./average-score";
import TooltipIconButton from "../tooltip-icon-button";

const StatsBody = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsRefreshing(false);
        console.log("Stats refreshed");
    };

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
                        <GamesWon />
                        <WinRatio />
                        <GamesPlayed />
                        <TotalScore />
                        <AverageScore />
                    </SimpleGrid>
                </Card.Body>
            </Card.Root>
        </Accordion.ItemBody>
    );
};

export default StatsBody;
