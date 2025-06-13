import { useState, useCallback } from "react";

import { useSession } from "next-auth/react";

import { createGame } from "@/services/gamesApi";
import { calculateScore } from "@/utils/score";
import { GameRecord, GameStatus } from "@/types/games";
import { Cell, Sudoku } from "@/types/sudoku";
import { MAX_HINTS } from "@/components/ui/play-page/buttons/hint-button";
import { MAX_CHECKS } from "@/components/ui/play-page/buttons/check-button";

export const useGameManager = () => {
    const { data: session } = useSession();
    const [startDate, setStartDate] = useState<Date>(new Date());

    const createGameRecord = useCallback((
        sudoku: Sudoku,
        grid: Cell[],
        remainingHints: number,
        remainingChecks: number,
        cellDeletionCount: number,
        timer: number,
        won: boolean,
        status: GameStatus
    ): GameRecord => {
        const endDate = new Date();
        const score = won ? calculateScore(remainingHints, remainingChecks, cellDeletionCount, timer) : 0;
        const hintsUsed = won ? MAX_HINTS - remainingHints : MAX_HINTS;

        return {
            sudoku_id: sudoku.id,
            score,
            hints_used: hintsUsed,
            checks_used: MAX_CHECKS - remainingChecks,
            deletions: cellDeletionCount,
            time_taken: timer,
            won,
            status,
            original_puzzle: sudoku.grid,
            solution: sudoku.solution ? sudoku.solution.grid : "",
            final_state: grid.map(cell => cell.value).join(""),
            started_at: startDate.toISOString(),
            completed_at: endDate.toISOString(),
        };
    }, [startDate]);

    const saveGame = useCallback(async (
        headers: any,
        gameData: GameRecord
    ) => {
        if (session) {
            await createGame(headers, gameData);
        }
    }, [session]);

    const resetStartDate = useCallback(() => {
        setStartDate(new Date());
    }, []);

    return {
        createGameRecord,
        saveGame,
        resetStartDate,
    };
};
