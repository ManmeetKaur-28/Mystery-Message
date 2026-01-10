import { z } from "zod";

export const messageValidation = z.object({
  message: z
    .string()
    .min(5, "message must be atleast 5 characters long")
    .max(200, "message cannot exceed limit of 200 characters"),
  createdAt: z.date(),
});
