import { Message } from "@/models/UserModel";

export interface ApiRespone {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Message[];
}
