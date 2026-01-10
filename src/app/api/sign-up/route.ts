import dbConnect from "@/lib/dbConnect";
import User from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiRespone } from "@/types/ApiResponse";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, username, password } = await request.json();
    const existingVerifiedUserByUsername = await User.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUserByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await User.findOne({ email });
    const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User with the given email id is already verified",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        messages: [],
      });

      await newUser.save();
    }

    //send verification email
    const sentEmailRes = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!sentEmailRes.success) {
      return Response.json(
        { success: false, message: sentEmailRes.message },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully . Please verify your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An Error occured while signing up the user :: ", error);
    return Response.json(
      {
        success: false,
        message: "An Error occured while signing up the user",
      },
      { status: 500 }
    );
  }
}
