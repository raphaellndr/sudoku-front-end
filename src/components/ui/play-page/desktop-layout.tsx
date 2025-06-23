import { VStack, Box, Separator } from "@chakra-ui/react";

import SudokuPlayer from "@/components/ui/play-page/sudoku-player";
import HowToPlayAccordion from "@/components/ui/play-page/explanations/how-to-play-accordion";

const DesktopLayout = () => {
    return (
        <VStack gap={8} align="stretch">
            <SudokuPlayer />
            <Separator />
            <Box>
                <HowToPlayAccordion />
            </Box>
        </VStack>
    );
};

export default DesktopLayout;
