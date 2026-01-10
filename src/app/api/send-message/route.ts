import dbConnect from "@/lib/dbConnect";
import User from "@/models/UserModel";
import { Message } from "@/models/UserModel";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, content } = await request.json();
    const user = await User.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "no user with the given username exists" },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "User is currently not accepting messages" },
        { status: 403 }
      );
    }
    const newMessage: Message = {
      content,
      createdAt: new Date(),
    } as Message;
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          messages: newMessage,
        },
      },
      { new: true }
    );

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error occured while sending message to user :: ", error);
    return Response.json(
      {
        success: false,
        message: "error occured while sending message to user",
      },
      { status: 500 }
    );
  }
}
