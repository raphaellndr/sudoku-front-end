import {
    Card,
    Flex,
    Text,
    Badge,
    VStack,
    HStack,
    Box,
    SimpleGrid
} from "@chakra-ui/react";
import { LuClock, LuTrophy, LuLightbulb, LuCircleCheck, LuEraser } from "react-icons/lu";

import { GameRecord } from "@/types/games";
import { formatTime } from "@/utils/time";
import { getStatusColor } from "@/utils/game";
import { formatDate } from "@/utils/date";

interface GameCardProps {
    game: GameRecord;
};

const GameCard = ({ game }: GameCardProps) => {
    return (
        <Card.Root size="sm" variant="outline">
            <Card.Body>
                <Flex justify="space-between" align="start" mb={3}>
                    <VStack align="start" gap={1}>
                        <HStack>
                            <Badge
                                colorPalette={getStatusColor(game.status, game.won)}
                                variant="subtle"
                            >
                                {game.won ? "Won" : game.status.replace("_", " ")}
                            </Badge>
                            <Text fontSize="sm" color="fg.muted">
                                {formatDate(game.completed_at || game.started_at)}
                            </Text>
                        </HStack>
                        <HStack>
                            <LuTrophy size={16} />
                            <Text fontWeight="semibold" fontSize="lg">
                                {game.score} pts
                            </Text>
                        </HStack>
                    </VStack>

                    {game.won && (
                        <Box color="green.500">
                            <LuCircleCheck size={24} />
                        </Box>
                    )}
                </Flex>

                <SimpleGrid columns={2} gap={4}>
                    <VStack align="start" gap={2}>
                        <HStack color="fg.muted">
                            <LuClock size={16} />
                            <Text fontSize="sm">
                                Time: {formatTime(Math.floor(game.time_taken))}
                            </Text>
                        </HStack>
                        <HStack color="fg.muted">
                            <LuLightbulb size={16} />
                            <Text fontSize="sm">
                                Hints: {game.hints_used}/3
                            </Text>
                        </HStack>
                    </VStack>

                    <VStack align="start" gap={2}>
                        <HStack color="fg.muted">
                            <LuCircleCheck size={16} />
                            <Text fontSize="sm">
                                Checks: {game.checks_used}/3
                            </Text>
                        </HStack>
                        <HStack color="fg.muted">
                            <LuEraser size={16} />
                            <Text fontSize="sm">
                                Deletions: {game.deletions}
                            </Text>
                        </HStack>
                    </VStack>
                </SimpleGrid>
            </Card.Body>
        </Card.Root>
    );
};

export default GameCard;
