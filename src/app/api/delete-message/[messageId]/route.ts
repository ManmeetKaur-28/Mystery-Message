import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import UserModel from "@/models/UserModel";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "User not authenticated to delete the message",
        },
        { status: 401 }
      );
    }

    const modifiedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $pull: {
          messages: { _id: messageId },
        },
      },
      { new: true }
    );
    if (!modifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Message already deleted or no message with given id",
        },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: "Message successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in backend in deleting user message : ", error);
    return Response.json(
      {
        success: false,
        message: "An error occured while deleting user message",
      },
      { status: 500 }
    );
  }
}
