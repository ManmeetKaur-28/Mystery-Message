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
  handleMessageDelete: (messageId: string) => void;
};
function MessageCard({ message, handleMessageDelete }: MessageProps) {
  const deleteMessage = async () => {
    try {
      handleMessageDelete(message._id.toString());
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      console.log("Response from delete : ", response);
      toast.success("Message Successfully deleted");
    } catch (error) {
      console.log("Error occured in deleting the message", error);
      toast.error("Error occured in deleting the message");
    }
  };
  return (
    <div className="lg:w-75 sm:w-65 xl:w-70 m-3">
      <Card className="min-h-30 flex flex-col justify-center">
        <div className="flex justify-between items-center ">
          <CardHeader className="w-3/5">
            <CardTitle>{message.content}</CardTitle>

            <CardDescription>
              {new Date(message.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <div className="w-1/5 mr-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <X className="w-20" />
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
          </div>
        </div>
      </Card>
    </div>
  );
}

export default MessageCard;
