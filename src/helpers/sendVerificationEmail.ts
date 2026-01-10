import { resend } from "@/lib/resend";
import VerificationEmailTemplate from "../../emails/verificationEmail";
import { ApiRespone } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiRespone> {
  try {
    const emailResponse = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystery Message : Verification Email",
      react: VerificationEmailTemplate({ username, otp: verifyCode }),
    });
    console.log("Verification email sent successfully");
    console.log("email Response : ", emailResponse);

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
