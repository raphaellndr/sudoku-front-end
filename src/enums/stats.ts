import { z } from "zod";

export const StatsPeriodEnum = z.enum(["daily", "weekly", "monthly", "yearly", "allTime"]);
export const ChartsPeriodEnum = z.enum(["daily", "monthly"]);
