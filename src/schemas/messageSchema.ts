import { z } from "zod";
export const contentValidation = z
  .string()
  .min(5, "message must be atleast 5 characters long")
  .max(200, "message cannot exceed limit of 200 characters");

export const messageValidation = z.object({
  message: contentValidation,
  createdAt: z.date(),
});
