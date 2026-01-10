import User from "@/models/UserModel";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParam);
    console.log("Result of safe Parse : ", result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "username is unique" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error occured while checking username :: ", error);
    return Response.json(
      { success: false, message: "Error checking username uniqueness" },
      { status: 500 }
    );
  }
}
