import { VStack, Box, Separator } from "@chakra-ui/react";

import SudokuPlayer from "@/components/ui/play-page/sudoku-player";
import HowToPlayAccordion from "@/components/ui/play-page/explanations/how-to-play-accordion";

const MobileLayout = () => {
    return (
        <VStack gap={6}>
            <SudokuPlayer />
            <Separator />
            <Box>
                <HowToPlayAccordion />
            </Box>
        </VStack>
    );
};

export default MobileLayout;
