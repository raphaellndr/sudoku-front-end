import { z } from "zod";

import { ChartsPeriodEnum } from "@/enums/stats";

export type ChartsPeriod = z.infer<typeof ChartsPeriodEnum>;

export interface ChartDataPoint {
    period: string;
    games_played: number;
    wins: number;
    losses: number;
    score: number;
    average_score: number;
};

export interface PeriodChartData {
    data: ChartDataPoint[] | null;
    isLoading: boolean;
};

export interface ChartsData {
    daily: PeriodChartData;
    monthly: PeriodChartData;
};
