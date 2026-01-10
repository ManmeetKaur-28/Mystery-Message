import dbConnect from "@/lib/dbConnect";
import User from "@/models/UserModel";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    if (!username || !code) {
      return Response.json({
        success: false,
        message: "username and code are required for verifying the user",
      });
    }

    const existingUser = await User.findOne({
      username,
      verifyCodeExpiry: { $gt: Date.now() },
    });
    if (!existingUser) {
      return Response.json(
        {
          success: false,
          message:
            "no user with the given username found to be verified or the verification code has been expired",
        },
        { status: 404 }
      );
    }
    if (existingUser.isVerified) {
      return Response.json(
        { success: false, message: "user is already verified" },
        { status: 400 }
      );
    }
    if (code != existingUser.verifyCode) {
      return Response.json(
        { success: false, message: "incorrect verification code entered" },
        { status: 400 }
      );
    }
    existingUser.isVerified = true;
    await existingUser.save();
    return Response.json(
      { success: true, message: "user has been successfully verified" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error verifying the user :: ", error);
    return Response.json(
      { success: false, message: "error verifying the user" },
      { status: 500 }
    );
  }
}
