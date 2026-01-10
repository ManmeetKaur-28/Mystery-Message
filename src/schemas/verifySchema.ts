import { z } from "zod";

export const verifyCodeValidation = z.object({
  verifyCode: z
    .string()
    .length(6, "verification code must be atleast 6 digits"),
});
