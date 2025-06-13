import { VStack, Box, Separator } from "@chakra-ui/react";

import SudokuPlayer from "@/components/ui/play-page/sudoku-player";
import HowToPlayAccordion from "@/components/ui/play-page/how-to-play-accordion";
import LeaderboardDialogButton from "@/components/ui/play-page/leaderboard/leaderboard-dialog-button";

interface MobileLayoutProps {
    headerHeight: number;
    isLeaderboardOpen: boolean;
    setIsLeaderboardOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileLayout = ({
    headerHeight,
    isLeaderboardOpen,
    setIsLeaderboardOpen
}: MobileLayoutProps) => {
    return (
        <>
            <VStack gap={6}>
                <SudokuPlayer />
                <Separator />
                <Box>
                    <HowToPlayAccordion />
                </Box>
            </VStack>
            <LeaderboardDialogButton
                isOpen={isLeaderboardOpen}
                setIsLeaderboardOpen={setIsLeaderboardOpen}
                headerHeight={headerHeight}
            />
        </>
    );
};

export default MobileLayout;
