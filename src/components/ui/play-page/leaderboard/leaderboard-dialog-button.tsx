import { Box, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { FaTrophy } from "react-icons/fa";

import LeaderboardButton from "./leaderboard-button";
import Leaderboard from "./leaderboard";

interface LeaderboardDialogButtonProps {
    isOpen: boolean;
    setIsLeaderboardOpen: React.Dispatch<React.SetStateAction<boolean>>;
    headerHeight: number;
};

const LeaderboardDialogButton: React.FC<LeaderboardDialogButtonProps> = ({
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
                        <Dialog.Title textAlign="center" mt="4"><FaTrophy /> Leaderboard <FaTrophy /></Dialog.Title>
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

export default LeaderboardDialogButton;
