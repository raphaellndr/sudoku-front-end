import { Flex, Spinner, Table, Text, VStack } from "@chakra-ui/react";

import useLeaderboard from "@/hooks/use-leaderboard";

import ErrorRow from "./rows/error-row";
import PlayerDetailRow from "./rows/player-detail-row";
import { useColorMode, useColorModeValue } from "../../color-mode";


const Leaderboard = () => {
    const { leaderboardData, loading, error } = useLeaderboard();

    const { colorMode } = useColorMode();
    const borderColor = useColorModeValue("white", "undefined");

    if (loading) {
        return (
            <Flex justify="center" align="center" height="400px">
                <VStack gap={4}>
                    <Spinner size="xl" color="blue.500" />
                    <Text>Loading leaderboard...</Text>
                </VStack>
            </Flex>
        );
    }

    return (
        <Table.ScrollArea
            rounded="xl"
            maxHeight="500px"
            boxShadow="sm"
            border={colorMode === "dark" ? "1px solid" : "none"}
            borderColor={borderColor}
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
    );
};

export default Leaderboard;
