import { z } from "zod";

import { RegisterFormSchema, SettingsFormSchema, SignInFormSchema } from "@/schemas/forms";

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
export type SignInFormValues = z.infer<typeof SignInFormSchema>;
export type SettingsFormValues = z.infer<typeof SettingsFormSchema>;
