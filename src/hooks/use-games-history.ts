import { useEffect, useMemo, useState } from "react";

import { useSession } from "next-auth/react";

import { fetchCurrentUserGames } from "@/services/meApi";
import { createHeaders } from "@/utils/apiUtils";
import { GameRecord } from "@/types/games";

const PAGE_SIZE = 9;

const useGamesHistory = () => {
    const { data: session } = useSession();
    const headers = useMemo(() => createHeaders(session), [session]);

    const [recentGames, setRecentGames] = useState<GameRecord[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const fetchRecentGames = async (page: number = 1) => {
        if (!session) return;

        try {
            const recentGamesResponse = await fetchCurrentUserGames(headers, {
                page: page,
                page_size: PAGE_SIZE
            });

            const recentGamesJSON = await recentGamesResponse.json();
            const games = recentGamesJSON.results as GameRecord[] || [];
            const count = recentGamesJSON.count as number || 0;

            setRecentGames(games);
            setTotalCount(count);

        } catch (error) {
            console.error('Failed to fetch games:', error);
            setRecentGames([]);
            setTotalCount(0);
        }
    };

    const handleRefresh = async (): Promise<void> => {
        if (isRefreshing) return;
        setIsRefreshing(true);

        try {
            await fetchRecentGames(currentPage);
        } catch (error) {
            console.error(`Failed to refresh games:`, error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handlePageChange = async (page: number): Promise<void> => {
        if (isRefreshing || page === currentPage) return;

        setIsRefreshing(true);

        try {
            await fetchRecentGames(page);
            setCurrentPage(page);
        } catch (error) {
            console.error(`Failed to load page ${page}:`, error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (session) {
            setCurrentPage(1);
            fetchRecentGames(1);
        }
    }, [session]);

    return {
        recentGames,
        isRefreshing,
        handleRefresh,
        currentPage,
        totalPages,
        totalCount,
        pageSize: PAGE_SIZE,
        handlePageChange
    };
};

export default useGamesHistory;
