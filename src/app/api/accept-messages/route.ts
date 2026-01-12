import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "not authenticated to toggle message status",
        },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    const { acceptingMessages } = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          isAcceptingMessages: acceptingMessages,
        },
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "error occured while changing message status",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "isAcceptingMessages field updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Error occured while changig user Accepting message status :: ",
      error
    );
    return Response.json({
      success: false,
      message: "error occured while updating user accepting message status",
    });
  }
}

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message:
            "user not authenticated to get the message acceptance status",
        },
        { status: 401 }
      );
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return Response.json(
        {
          success: false,
          message: "user with the given id not found to return message status",
        },
        { status: 404 }
      );
    }
    const messageAcceptingStatus = existingUser.isAcceptingMessages;
    return Response.json(
      {
        success: true,
        message: "user status fetched successfully",
        isAcceptingMessages: messageAcceptingStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error occured while fetching user message status :: ", error);
    return Response.json(
      {
        success: false,
        message: "error occured while fetching user message accepting status",
      },
      { status: 500 }
    );
  }
}
