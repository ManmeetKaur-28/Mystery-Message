"use client";
import { acceptMessagesValidation } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
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
import * as z from "zod";
import { ApiRespone } from "@/types/ApiResponse";
const Dashboard = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const form = useForm<z.infer<typeof acceptMessagesValidation>>({
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
      toast.success(
        `Message accepting status turned ${isAcceptingMessages ? "OFF" : "ON"} `
      );
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
      setMessages(response.data.messages || []);
      // console.log(response);
    } catch (error: any) {
      console.log("Error occured while fetching user messages :: ", error);
      const axiosError = error as AxiosError<ApiRespone>;
      toast.error(axiosError.response?.data.message);
    }
    setIsLoadingMessages(false);
  };

  useEffect(() => {
    if (!session || !session.user) return;
    getMessages();
    getAcceptingStatus();
  }, [session]);

  const handleMessageDelete = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() != messageId)
    );
  };
  let profileUrl = "";
  if (typeof window != undefined) {
    profileUrl = `${window?.location.origin}/u/${user?.username}`; //change this url ---------------------
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Url successfully copied to clipboard");
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
          <Input disabled={true} value={profileUrl} />
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

      <div className="bg-gray-600/30 text-center p-4 rounded-xl space-y-2 flex-col flex w-full ">
        <h2 className="text-3xl text-center font-bold">ALL MESSAGES</h2>
        <Separator />
        <div className=" grid grid-cols-1 sm:grid-cols-2 mx-auto lg:gap-4 gap-2  lg:grid-cols-3 xl:grid-cols-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
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
