import { useEffect, useMemo, useState } from "react";

import { useSession } from "next-auth/react";

import { fetchCurrentUserGames } from "@/services/meApi";
import { createHeaders } from "@/utils/apiUtils";
import { GameRecord } from "@/types/games";

const useGamesHistory = () => {
    const { data: session } = useSession();
    const headers = useMemo(() => createHeaders(session), [session]);

    const [recentGames, setRecentGames] = useState<GameRecord[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchRecentGames = async () => {
        const recentGamesResponse = await fetchCurrentUserGames(headers);
        const recentGamesJSON = await recentGamesResponse.json();
        const recentGames = recentGamesJSON["results"] as GameRecord[];
        setRecentGames(recentGames);
    };

    const handleRefresh = async (): Promise<void> => {
        if (isRefreshing) return;
        setIsRefreshing(true);

        try {
            await fetchRecentGames();
        } catch (error) {
            console.error(`Failed to refresh games:`, error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchRecentGames();
        }
    }, [session]);

    return {
        recentGames,
        isRefreshing,
        handleRefresh
    };
};

export default useGamesHistory;
