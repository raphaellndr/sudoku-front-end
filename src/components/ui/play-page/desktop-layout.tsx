import { VStack, HStack, Box, Separator, Text } from "@chakra-ui/react";
import { FaTrophy } from "react-icons/fa";

import SudokuPlayer from "@/components/ui/play-page/sudoku-player";
import HowToPlayAccordion from "@/components/ui/play-page/explanations/how-to-play-accordion";
import Leaderboard from "@/components/ui/play-page/leaderboard/leaderboard";

const DesktopLayout = () => {
    return (
        <VStack gap={8} align="stretch">
            <HStack gap={8} align="start">
                <Box flex="2">
                    <SudokuPlayer />
                </Box>
                <Box flex="1">
                    <VStack gap={4} align="stretch">
                        <HStack gap={2} justify="center">
                            <FaTrophy size={24} />
                            <Text fontSize="xl" fontWeight="bold">
                                Leaderboard
                            </Text>
                            <FaTrophy size={24} />
                        </HStack>
                        <Leaderboard />
                    </VStack>
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
