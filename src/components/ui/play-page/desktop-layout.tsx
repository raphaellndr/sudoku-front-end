import { VStack, HStack, Box, Separator, Card } from "@chakra-ui/react";

import SudokuPlayer from "@/components/ui/play-page/sudoku-player";
import HowToPlayAccordion from "@/components/ui/play-page/how-to-play-accordion";
import Leaderboard from "@/components/ui/play-page/leaderboard/leaderboard";

const DesktopLayout = () => {
    return (
        <VStack gap={8} align="stretch">
            <HStack gap={8}>
                <Box flex="2">
                    <SudokuPlayer />
                </Box>
                <Box flex="1">
                    <LeaderboardCard />
                </Box>
            </HStack>
            <Separator />
            <Box>
                <HowToPlayAccordion />
            </Box>
        </VStack>
    );
};

const LeaderboardCard = () => {
    return (
        <Card.Root shadow="md" maxHeight="500px">
            <Card.Body>
                <Card.Title mb="4" textAlign="center">
                    🏆 Leaderboard 🏆
                </Card.Title>
                <Leaderboard />
            </Card.Body>
        </Card.Root>
    );
};

export default DesktopLayout;
