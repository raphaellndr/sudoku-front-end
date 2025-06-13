import { useMemo } from "react";

import { UserStats } from "@/types/stats";

export type StatsEvolution = UserStats & {
    percentageChanges: {
        [key in keyof UserStats]: number;
    };
};

export const useStatsEvolution = (
    currentStats: UserStats | null,
    previousStats: UserStats | null
): StatsEvolution | null => {
    return useMemo(() => {
        if (!currentStats || !previousStats) {
            return null;
        }

        const calculatePercentageChange = (current: number, previous: number): number => {
            if (previous === 0 || previous === null) {
                return current > 0 ? 100 : 0;
            }
            return ((current - previous) / previous) * 100;
        };

        const evolution: UserStats = {
            total_games: currentStats.total_games - previousStats.total_games,
            completed_games: currentStats.completed_games - previousStats.completed_games,
            abandoned_games: currentStats.abandoned_games - previousStats.abandoned_games,
            stopped_games: currentStats.stopped_games - previousStats.stopped_games,
            in_progress_games: currentStats.in_progress_games - previousStats.in_progress_games,
            won_games: currentStats.won_games - previousStats.won_games,
            lost_games: currentStats.lost_games - previousStats.lost_games,
            win_rate: currentStats.win_rate - previousStats.win_rate,
            total_time_seconds: currentStats.total_time_seconds - previousStats.total_time_seconds,
            average_time_seconds: currentStats.average_time_seconds - previousStats.average_time_seconds,
            best_time_seconds: currentStats.best_time_seconds - previousStats.best_time_seconds,
            total_score: currentStats.total_score - previousStats.total_score,
            average_score: currentStats.average_score - previousStats.average_score,
            best_score: currentStats.best_score - previousStats.best_score,
            total_hints_used: currentStats.total_hints_used - previousStats.total_hints_used,
            total_checks_used: currentStats.total_checks_used - previousStats.total_checks_used,
            total_deletions: currentStats.total_deletions - previousStats.total_deletions,
        };

        const percentageChanges = {
            total_games: calculatePercentageChange(currentStats.total_games, previousStats.total_games),
            completed_games: calculatePercentageChange(currentStats.completed_games, previousStats.completed_games),
            abandoned_games: calculatePercentageChange(currentStats.abandoned_games, previousStats.abandoned_games),
            stopped_games: calculatePercentageChange(currentStats.stopped_games, previousStats.stopped_games),
            in_progress_games: calculatePercentageChange(currentStats.in_progress_games, previousStats.in_progress_games),
            won_games: calculatePercentageChange(currentStats.won_games, previousStats.won_games),
            lost_games: calculatePercentageChange(currentStats.lost_games, previousStats.lost_games),
            win_rate: calculatePercentageChange(currentStats.win_rate, previousStats.win_rate),
            total_time_seconds: calculatePercentageChange(currentStats.total_time_seconds, previousStats.total_time_seconds),
            average_time_seconds: calculatePercentageChange(currentStats.average_time_seconds, previousStats.average_time_seconds),
            best_time_seconds: calculatePercentageChange(currentStats.best_time_seconds, previousStats.best_time_seconds),
            total_score: calculatePercentageChange(currentStats.total_score, previousStats.total_score),
            average_score: calculatePercentageChange(currentStats.average_score, previousStats.average_score),
            best_score: calculatePercentageChange(currentStats.best_score, previousStats.best_score),
            total_hints_used: calculatePercentageChange(currentStats.total_hints_used, previousStats.total_hints_used),
            total_checks_used: calculatePercentageChange(currentStats.total_checks_used, previousStats.total_checks_used),
            total_deletions: calculatePercentageChange(currentStats.total_deletions, previousStats.total_deletions),
        };

        return {
            ...evolution,
            percentageChanges,
        };
    }, [currentStats, previousStats]);
};
