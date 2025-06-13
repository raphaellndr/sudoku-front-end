import { useState } from "react";

import { Leaderboard as LeaderboardData } from "@/types/types";
import {
    CloseButton,
    Dialog,
    Portal,
    Table,
    Box,
    Text,
    VStack,
    HStack,
    Separator,
    FormatNumber,
} from "@chakra-ui/react";

import { formatTime } from "@/utils/time";

export const ErrorRow = () => {
    return (
        <Table.Row>
            <Table.Cell textAlign="center">No data available</Table.Cell>
        </Table.Row>
    );
};

interface PlayerDetailRowProps {
    data: LeaderboardData;
    index: number;
}

export const PlayerDetailRow: React.FC<PlayerDetailRowProps> = ({
    data,
    index,
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <Table.Row
                key={data.user_id}
                onClick={() => setIsDialogOpen(true)}
            >
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{data.username}</Table.Cell>
                <Table.Cell textAlign="end">{data.total_score}</Table.Cell>
            </Table.Row>

            <Dialog.Root
                open={isDialogOpen}
                onOpenChange={(e) => setIsDialogOpen(e.open)}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content maxW="400px" mx={4}>
                            <Dialog.Header>
                                <Dialog.Title>{data.username}</Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>

                            <Dialog.Body>
                                <VStack gap={4} align="stretch">
                                    <HStack justify="space-between">
                                        <Box textAlign="center">
                                            <Text fontSize="xl" fontWeight="bold">
                                                {data.total_score}
                                            </Text>
                                            <Text fontSize="sm">Total Score</Text>
                                        </Box>
                                        <Box textAlign="center">
                                            <Text fontSize="xl" fontWeight="bold">
                                                {data.best_score}
                                            </Text>
                                            <Text fontSize="sm">Best Score</Text>
                                        </Box>
                                    </HStack>

                                    <Separator />

                                    <VStack gap={2} align="stretch">
                                        <HStack justify="space-between">
                                            <Text>Games Played</Text>
                                            <Text fontWeight="medium">{data.total_games}</Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text>Games Won</Text>
                                            <Text fontWeight="medium">{data.won_games}</Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text>Win Rate</Text>
                                            <Text fontWeight="medium">
                                                <FormatNumber
                                                    value={data.win_rate}
                                                    style="percent"
                                                />
                                            </Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text>Best Time</Text>
                                            <Text fontWeight="medium">{formatTime(data.best_time_seconds)}</Text>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text>Average Score</Text>
                                            <Text fontWeight="medium">
                                                {data.average_score || 0}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </VStack>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
};
