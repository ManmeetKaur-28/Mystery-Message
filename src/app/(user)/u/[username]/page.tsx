"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { contentValidation } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import defaultDisplayMessages from "@/displayMessages.json";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ApiRespone } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const contentSchema = z.object({
  content: contentValidation,
});
function PublicProfilePage() {
  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const { register, handleSubmit, setValue, watch } = form;
  const [displayMessages, setDisplayMessages] = useState(
    defaultDisplayMessages
  );
  const { username } = useParams();
  //   const currContent = watch("content");
  const changeMessageWithSuggested = (messageIndex: number) => {
    setValue("content", displayMessages[messageIndex]);
  };

  const sendMessage = async (data: z.infer<typeof contentSchema>) => {
    setSendingMessage(true);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });
      toast.success("Message sent successfully");
      setValue("content", "");
    } catch (error) {
      console.log("Error sending message to user :: ", error);
      const axiosError = error as AxiosError<ApiRespone>;
      toast.error(axiosError.response?.data.message);
    }
    setSendingMessage(false);
  };

  const getDiplayMessages = async () => {
    try {
      const response = await axios.get("/api/suggest-messages");
      const sampleMessagesText = response.data.message;
      //   console.log(sampleMessagesText);
      const messagesArray = sampleMessagesText.split("||");
      setDisplayMessages(messagesArray);
    } catch (error) {
      console.log("An error occured in generating sample messages :: ", error);
      toast.error(
        "An error occured in generating sample messages . Please try again ..."
      );
    }
  };
  return (
    <div className="flex min-h-screen flex-col m-8 gap-5">
      <div>
        <Form {...form}>
          <form onSubmit={handleSubmit(sendMessage)} className="space-y-8 ">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content :</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type your message here ....."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center">
              <Button type="submit" className="">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Separator />
      <div className="my-6 bg-gray-500/20 py-4 px-3 rounded-2xl">
        <div className="flex flex-col justify-center space-y-3">
          {displayMessages.map((item, index) => (
            <Button
              variant={"outline"}
              key={index}
              onClick={() => changeMessageWithSuggested(index)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="text-center my-6">
          <Button className="" onClick={getDiplayMessages}>
            Suggest Messages
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PublicProfilePage;
