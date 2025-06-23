import {
    CloseButton,
    Dialog,
    Portal,
    VStack,
    Avatar,
} from "@chakra-ui/react";

import { Leaderboard } from "@/types/leaderboard";

import PlayerStats from "./player-stats";
import RankDisplay from "../rank-display";

interface PlayerDetailDialogProps {
    data: Leaderboard;
    position: number;
    isOpen: boolean;
    onClose: () => void;
}

export const PlayerDetailDialog: React.FC<PlayerDetailDialogProps> = ({
    data,
    position,
    isOpen,
    onClose,
}) => {
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(e) => !e.open && onClose()}
        >
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.600" />
                <Dialog.Positioner>
                    <Dialog.Content maxW="450px" mx={4} borderRadius="xl" boxShadow="xl">
                        <Dialog.Header pb={2}>
                            <VStack gap={2} align="center" w="full">
                                <Avatar.Root size="lg">
                                    <Avatar.Fallback name={data.username} />
                                </Avatar.Root>
                                <Dialog.Title fontSize="xl" fontWeight="bold">
                                    {data.username}
                                </Dialog.Title>
                                <RankDisplay position={position} />
                            </VStack>
                            <Dialog.CloseTrigger asChild position="absolute" top={4} right={4}>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body pt={4}>
                            <PlayerStats data={data} />
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default PlayerDetailDialog;
