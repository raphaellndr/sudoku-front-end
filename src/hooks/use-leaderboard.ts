import { useEffect, useState } from "react";

import { createHeaders } from "@/utils/apiUtils";
import { fetchLeaderboard } from "@/services/usersAPi";
import { Leaderboard as LeaderboardData, LeaderboardResponse } from "@/types/stats";

const useLeaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            setError(null);

            const headers = createHeaders();
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

    return {
        leaderboardData,
        loading,
        error,
        refetch: loadLeaderboard
    };
};

export default useLeaderboard;
