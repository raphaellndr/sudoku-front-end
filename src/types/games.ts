import { z } from "zod";

import { GameStatusEnum, GameModeEnum } from "@/enums/games";
import { GameRecordSchema } from "@/schemas/games";

export type GameRecord = z.infer<typeof GameRecordSchema>;
export type GameStatus = z.infer<typeof GameStatusEnum>;
export type GameMode = z.infer<typeof GameModeEnum>;
