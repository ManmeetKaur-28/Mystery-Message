"use client";
import React from "react";
import sampleMessages from "@/messages.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { BackgroundLines } from "@/components/ui/background-lines";
function HomePage() {
  return (
    <div>
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
        <div className="my-4 flex flex-col justify-center items-center">
          <h1 className="my-3 text-3xl lg:text-4xl font-bold ">
            Welcome to the world of mystery messages
          </h1>
          <p className="text-lg my-3">
            Send anonymous messages to users , anytime - anywhere
          </p>
        </div>
        <div className="flex justify-center ">
          <Carousel
            plugins={[Autoplay({ delay: 200000 })]}
            opts={{
              align: "start",
            }}
            className="w-full max-w-xs text-center "
          >
            <CarouselContent className="">
              {sampleMessages.map((message, index) => (
                <CarouselItem key={index} className="">
                  <div className="p-0">
                    <Card className="gap-2">
                      <CardHeader className="gap-0">{message.title}</CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center">
                        <span className="text-2xl font-semibold">
                          {message.content}
                        </span>
                      </CardContent>
                      <CardFooter className="">{message.received}</CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </BackgroundLines>
    </div>
  );
}

export default HomePage;
