import { useEffect, useState } from "react";

import { Flex, Spinner, Table } from "@chakra-ui/react";

import { createHeaders } from "@/utils/apiUtils";
import { Leaderboard as LeaderboardData } from "@/types/types";
import { fetchLeaderboard } from "@/services/usersAPi";

import { ErrorRow, PlayerDetailRow } from "./custom-rows";

interface LeaderboardResponse {
    count: number;
    results: LeaderboardData[];
}

const Leaderboard = () => {
    const headers = createHeaders();

    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetchLeaderboard(headers);
            const data = await response.json() as LeaderboardResponse;

            setLeaderboardData(data.results);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load leaderboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const rows = leaderboardData.map((item, index) => (
        <PlayerDetailRow
            key={item.user_id}
            data={item}
            index={index}
        />
    ));

    if (loading) {
        return (
            <Flex justify="center" align="center" height="300px">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <Table.ScrollArea rounded="md" height="400px">
            <Table.Root size="sm" interactive stickyHeader>
                <Table.ColumnGroup>
                    <Table.Column htmlWidth={!error ? "10%" : "100%"} />
                </Table.ColumnGroup>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader />
                        {!error && (
                            <>
                                <Table.ColumnHeader>Player</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">Total Score</Table.ColumnHeader>
                            </>
                        )}
                    </Table.Row>
                </Table.Header>
                <Table.Body>{!error ? rows : <ErrorRow />}</Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};

export default Leaderboard;
