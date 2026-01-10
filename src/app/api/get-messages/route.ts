import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "user not authenticated to get the messages",
        },
        { status: 401 }
      );
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    const userFromPipeline = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: `$_id`, messages: { $push: "$messages" } },
      },
    ]);

    if (!userFromPipeline || userFromPipeline.length == 0) {
      return Response.json(
        { success: false, message: "User not found or has no messages yet" },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User messages fetched successfully",
        messages: userFromPipeline[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error occured while fetching user messages :: ", error);
    return Response.json(
      { success: false, message: "error occured while fetching user messages" },
      { status: 500 }
    );
  }
}
