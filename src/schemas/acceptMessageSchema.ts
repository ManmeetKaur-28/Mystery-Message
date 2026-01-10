import { z } from "zod";

export const acceptMessagesValidation = z.object({
  isAcceptingMessages: z.boolean(),
});
