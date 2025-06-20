import { z } from "zod";

import { UserStatsSchema } from "@/schemas/stats";
import { StatsPeriodEnum } from "@/enums/stats";

export type UserStats = z.infer<typeof UserStatsSchema>;

export type StatsPeriod = z.infer<typeof StatsPeriodEnum>;

export interface PeriodStats {
    current: UserStats | null;
    previous: UserStats | null;
    isLoading: boolean;
};

export interface StatsData {
    daily: PeriodStats;
    weekly: PeriodStats;
    monthly: PeriodStats;
    yearly: PeriodStats;
    allTime: PeriodStats;
};
