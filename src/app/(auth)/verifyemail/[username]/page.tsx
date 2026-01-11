"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyCodeValidation } from "@/schemas/verifySchema";
import { ApiRespone } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function verifyPage() {
  const { username } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof verifyCodeValidation>>({
    resolver: zodResolver(verifyCodeValidation),
  });
  const onVerify = async (data: z.infer<typeof verifyCodeValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/verifycode", {
        username,
        code: data.verifyCode,
      });
      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      console.log("error in verify code page :: ", error);
      const axiosError = error as AxiosError<ApiRespone>;
      toast.error(
        axiosError.response?.data.message ||
          "Error in verification of user.Please try again with correct code"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full border-2 border-white max-w-md p-8 space-y-8  rounded-lg shadow-md">
        <div className="text-center">
          <h1 className=" text-center text-4xl font-extrabold tracking-tight lg:tex5 mb-6">
            Join <br /> Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onVerify)} className="space-y-6">
            <FormField
              control={form.control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="eg:111111" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center">
              <Button type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default verifyPage;
