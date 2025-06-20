import { z } from "zod";

import { LeaderboardSchema } from "@/schemas/stats";

export type Leaderboard = z.infer<typeof LeaderboardSchema>;

export interface LeaderboardResponse {
    count: number;
    results: Leaderboard[];
};
