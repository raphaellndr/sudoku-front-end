import { Box, CloseButton, Dialog, Portal } from "@chakra-ui/react";

import LeaderboardButton from "./leaderboard-button";
import Leaderboard from "./leaderboard";

interface LeaderboardDialogProps {
    isOpen: boolean;
    setIsLeaderboardOpen: React.Dispatch<React.SetStateAction<boolean>>;
    headerHeight: number;
};

const LeaderboardDialog: React.FC<LeaderboardDialogProps> = ({
    isOpen,
    setIsLeaderboardOpen,
    headerHeight,
}) => {
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(details) => setIsLeaderboardOpen(details.open)}
        >
            <Box
                position="fixed"
                top={`${headerHeight + 16}px`}
                left={4}
                zIndex="docked"
            >
                <LeaderboardButton
                    onClick={() => setIsLeaderboardOpen(true)}
                />
            </Box>

            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content mx={4}>
                        <Dialog.Header>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Leaderboard />
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default LeaderboardDialog;
