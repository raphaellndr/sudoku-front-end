import {
    Accordion,
    Card,
    Flex,
    Heading,
    Spinner,
    Text,
    SimpleGrid
} from "@chakra-ui/react";
import { LuRefreshCw } from "react-icons/lu";

import useGamesHistory from "@/hooks/use-games-history";

import GameCard from "./game-card";
import GamesPagination from "./games-pagination";
import TooltipIconButton from "../../tooltip-icon-button";

const GamesHistoryBody = () => {
    const {
        recentGames,
        isRefreshing,
        handleRefresh,
        currentPage,
        totalPages,
        totalCount,
        pageSize,
        handlePageChange
    } = useGamesHistory();

    return (
        <Accordion.ItemBody>
            <Card.Root>
                <Card.Header>
                    <Flex justify="space-between" align="center">
                        <Heading size="lg" color="fg.emphasized">
                            Your Games History
                        </Heading>
                        <TooltipIconButton
                            leftIcon={isRefreshing ? (
                                <Spinner size="sm" />
                            ) : (
                                <LuRefreshCw />
                            )}
                            tooltipText={isRefreshing ? "Games are being refreshed" : "Refresh games"}
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        />
                    </Flex>
                </Card.Header>
                <Card.Body>
                    {totalCount === 0 ? (
                        <Text color="fg.muted" textAlign="center" py={8}>
                            No games found. Start playing to see your history!
                        </Text>
                    ) : (
                        <>
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                                {recentGames.map((game) => (
                                    <GameCard key={game.id} game={game} />
                                ))}
                            </SimpleGrid>

                            <GamesPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalCount={totalCount}
                                pageSize={pageSize}
                                onPageChange={handlePageChange}
                                isLoading={isRefreshing}
                            />
                        </>
                    )}
                </Card.Body>
            </Card.Root>
        </Accordion.ItemBody>
    );
};

export default GamesHistoryBody;
