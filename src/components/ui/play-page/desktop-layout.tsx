import { VStack, HStack, Box, Separator } from "@chakra-ui/react";

import SudokuPlayer from "@/components/ui/play-page/sudoku-player";
import HowToPlayAccordion from "@/components/ui/play-page/explanations/how-to-play-accordion";
import Leaderboard from "@/components/ui/play-page/leaderboard/leaderboard";

const DesktopLayout = () => {
    return (
        <VStack gap={8} align="stretch">
            <HStack gap={8}>
                <Box flex="2">
                    <SudokuPlayer />
                </Box>
                <Box flex="1">
                    <Leaderboard />
                </Box>
            </HStack>
            <Separator />
            <Box>
                <HowToPlayAccordion />
            </Box>
        </VStack>
    );
};

export default DesktopLayout;
