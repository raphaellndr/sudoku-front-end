import { z } from "zod";

export const GameStatusEnum = z.enum(["in_progress", "completed", "abandoned", "stopped"]);
export const GameModeEnum = z.enum(["create", "display", "play", "completed"]);
