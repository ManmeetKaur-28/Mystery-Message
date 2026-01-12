"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Message } from "@/models/UserModel";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
type MessageProps = {
  message: Message;
  handleMessageDelete: (messageId: any) => void;
};
function MessageCard({ message, handleMessageDelete }: MessageProps) {
  const deleteMessage = async () => {
    try {
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      toast.success("Message Successfully deleted");
      handleMessageDelete(message._id);
    } catch (error) {
      console.log("Error occured in deleting the message", error);
      toast.error("Error occured in deleting the message");
    }
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{message.content}</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <X />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
              <DialogHeader>
                <DialogTitle>Delete message ?</DialogTitle>
                <DialogDescription>
                  Once a message has been deleted , it cannot be restored
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose>
                  <Button onClick={deleteMessage} variant="destructive">
                    Delete
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <CardDescription>
            {new Date(message.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default MessageCard;
