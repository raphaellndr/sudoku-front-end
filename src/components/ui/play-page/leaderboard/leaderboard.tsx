import { Flex, Spinner, Table, Text, VStack, Box, HStack } from "@chakra-ui/react";
import { FaTrophy } from "react-icons/fa";

import useLeaderboard from "@/hooks/use-leaderboard";

import ErrorRow from "./rows/error-row";
import PlayerDetailRow from "./rows/player-detail-row";


const Leaderboard = () => {
    const { leaderboardData, loading, error } = useLeaderboard();

    if (loading) {
        return (
            <Flex justify="center" align="center" height="400px">
                <VStack gap={4}>
                    <Spinner size="xl" color="blue.500" />
                    <Text color="gray.600">Loading leaderboard...</Text>
                </VStack>
            </Flex>
        );
    }

    return (
        <Box>
            <HStack gap={2} mb={4} justify="center">
                <FaTrophy size={24} color="#3182CE" />
                <Text fontSize="xl" fontWeight="bold">
                    Leaderboard
                </Text>
            </HStack>

            <Table.ScrollArea
                rounded="xl"
                height="500px"
                boxShadow="sm"
            >
                <Table.Root size="md" stickyHeader interactive>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader w="20%" fontWeight="semibold">
                                Rank
                            </Table.ColumnHeader>
                            <Table.ColumnHeader fontWeight="semibold">
                                Player
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="end" fontWeight="semibold">
                                Score
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {error ? (
                            <ErrorRow />
                        ) : (
                            leaderboardData.map((item, index) => (
                                <PlayerDetailRow
                                    key={item.user_id}
                                    data={item}
                                    position={index}
                                />
                            ))
                        )}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Box>
    );
};

export default Leaderboard;
