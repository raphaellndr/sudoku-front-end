import { z } from "zod";

export const GameStatusEnum = z.enum(["in_progress", "completed", "abandoned", "stopped"]);
