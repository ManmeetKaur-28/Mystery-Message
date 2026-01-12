"use client";
import { acceptMessagesValidation } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/models/UserModel";
const Dashboard = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const form = useForm({
    resolver: zodResolver(acceptMessagesValidation),
  });
  const { register, setValue, watch } = form;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const isAcceptingMessages = watch("isAcceptingMessages");

  const getAcceptingStatus = async () => {
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("isAcceptingMessages", response.data.isAcceptingMessages);
    } catch (error) {
      console.log(
        "Error occured in fetching message accepting status :: ",
        error
      );
      toast.error("Error occured while fetching message accepting status");
    }
  };
  const changeAcceptingStatus = async () => {
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptingMessages: !isAcceptingMessages,
      });
      setValue("isAcceptingMessages", !isAcceptingMessages);
    } catch (error) {
      console.log("error in changing message accepting status :: ", error);
      toast.error("Error occured while changing the message accepting status");
    }
  };
  const getMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const response = await axios.get("/api/get-messages");
      setMessages(response.data.messages);
    } catch (error: any) {
      console.log("Error occured while fetching user messages :: ", error);
      toast.error(error.response.data.message);
    }
    setIsLoadingMessages(false);
  };

  useEffect(() => {
    if (!session || !session.user) return;
    getAcceptingStatus();
    getMessages();
  }, []);

  const handleMessageDelete = (messageId: any) => {
    setMessages(messages.filter((message) => message._id != messageId));
  };

  const ProfileUrl = `${window.location.origin}/u/${user?.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ProfileUrl);
    toast.success("Profile Url successfully copied to clipboard");
  };

  if (!session || !session.user) {
    return (
      <div>
        Please sign in first to see the messages{" "}
        <Link href="/sign-in">Sign In</Link>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col m-8 gap-5">
      <div>
        <h2>Profile Url</h2>
        <div className="flex space-x-5 w-full">
          <Input disabled={true} value={ProfileUrl} />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <Separator />
      <div className="space-x-3 flex items-center">
        <span>Message Accepting : </span>
        <Switch
          {...register("isAcceptingMessages")}
          onCheckedChange={changeAcceptingStatus}
          checked={isAcceptingMessages}
        />
        <span>{isAcceptingMessages ? "ON" : "OFF"}</span>
      </div>

      <div className="bg-gray-600/30 p-4 rounded-xl space-y-2">
        <h2 className="text-3xl text-center font-bold">ALL MESSAGES</h2>
        <Separator />
        <div>
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                message={message}
                handleMessageDelete={handleMessageDelete}
              />
            ))
          ) : (
            <p className="text-center font-sm">No Messages yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
