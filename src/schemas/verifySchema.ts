import { z } from "zod";

export const verifySchema = z.object({
  verifyCode: z
    .string()
    .length(6, "verification code must be atleast 6 digits"),
});
