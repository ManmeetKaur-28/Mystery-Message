import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 characters")
  .max(20, "username cannot exceed 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain any special symbols");

export const signupValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 characters long" }),
});
