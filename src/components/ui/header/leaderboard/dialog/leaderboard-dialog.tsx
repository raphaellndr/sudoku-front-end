import { CloseButton, Container, Dialog, HStack, Portal } from "@chakra-ui/react";
import { FaTrophy } from "react-icons/fa";

import LeaderboardButton from "./leaderboard-button";
import Leaderboard from "../leaderboard";

const LeaderboardDialogButton = () => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <LeaderboardButton />
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content mx={4}>
                        <Container centerContent>
                            <Dialog.Title mt="4">
                                <HStack><FaTrophy /> Leaderboard <FaTrophy /></HStack>
                            </Dialog.Title>
                        </Container>
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
