"use client";

import { useState, useEffect } from "react";

import {
    Box,
    Heading,
    Text,
    Spinner,
    Flex,
} from "@chakra-ui/react";

import { fetchLeaderboard } from "@/services/usersAPi";
import { createHeaders } from "@/utils/apiUtils";
import { Leaderboard as LeaderboardData } from "@/types/types";

import { useColorMode } from "../color-mode";

interface LeaderboardResponse {
    count: number;
    results: LeaderboardData[];
}

const Leaderboard = () => {
    const { colorMode } = useColorMode();
    const headers = createHeaders();

    const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchLeaderboard(headers);
                const data = await response.json() as LeaderboardResponse;

                console.log("coucou");
                console.log(data);

                setLeaderboard(data.results);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load leaderboard");
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
    }, []);

    if (loading) {
        return (
            <Flex justify="center" align="center" height="200px">
                <Spinner size="lg" color="blue.500" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" py={8}>
                <Text color="red.500">Error loading leaderboard: {error}</Text>
            </Box>
        );
    }

    if (leaderboard.length === 0) {
        return (
            <Box textAlign="center" py={8}>
                <Text color="gray.500">No leaderboard data available</Text>
            </Box>
        );
    }

    return (
        <Box maxW="600px" mx="auto">
            <Heading
                size="lg"
                mb={8}
                textAlign="center"
                color={colorMode === "dark" ? "gray.200" : "gray.700"}
            >
                🏆 Leaderboard
            </Heading>

            <Box
                bg={colorMode === "dark" ? "gray.800" : "white"}
                borderRadius="xl"
                shadow="sm"
                border="1px"
                borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
                overflow="hidden"
            >
                {leaderboard.map((data, index) => (
                    <Flex
                        key={data.user_id}
                        align="center"
                        justify="space-between"
                        p={4}
                        borderBottom={index < leaderboard.length - 1 ? "1px" : "none"}
                        borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
                        bg={
                            colorMode === "dark" ? (
                                index === 0 ? "yellow.900" :
                                    index === 1 ? "gray.700" :
                                        index === 2 ? "orange.900" :
                                            "gray.800"
                            ) : (
                                index === 0 ? "yellow.100" :
                                    index === 1 ? "gray.100" :
                                        index === 2 ? "orange.100" :
                                            "white"
                            )
                        }
                        transition="background 0.2s"
                    >
                        <Flex align="center" gap={4} flex="1">
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={
                                    colorMode === "dark" ? (
                                        index === 0 ? "yellow.400" :
                                            index === 1 ? "gray.400" :
                                                index === 2 ? "orange.400" :
                                                    "gray.500"
                                    ) : (
                                        index === 0 ? "yellow.600" :
                                            index === 1 ? "gray.600" :
                                                index === 2 ? "orange.600" :
                                                    "gray.500"
                                    )
                                }
                                minW="8"
                            >
                                {index + 1}
                            </Text>

                            <Text
                                fontWeight="semibold"
                                color={colorMode === "dark" ? "gray.100" : "gray.800"}
                            >
                                {data.username}
                            </Text>
                        </Flex>

                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                        >
                            {data.total_score}
                        </Text>
                    </Flex>
                ))}
            </Box>
        </Box>
    );
};

export default Leaderboard;
