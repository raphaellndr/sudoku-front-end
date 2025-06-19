import { z } from "zod";

import { LeaderboardSchema, UserStatsSchema } from "@/schemas/stats";
import { ChartsPeriodEnum, StatsPeriodEnum } from "@/enums/stats";


export type UserStats = z.infer<typeof UserStatsSchema>;
export type StatsPeriod = z.infer<typeof StatsPeriodEnum>;
export type ChartsPeriod = z.infer<typeof ChartsPeriodEnum>;

export type Leaderboard = z.infer<typeof LeaderboardSchema>;
export interface LeaderboardResponse {
    count: number;
    results: Leaderboard[];
};
