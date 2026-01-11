import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function GET(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended questions formatted as a single string . Each question should be separated by '||' . These questions are for an anonymous social messaging platform , like Qooh.me, and should be suitable for a diverse audience. Avoid personal or senstitive topics, focusing on instead universal themes that encourage friendly interaction. For example, your output should be structured like this : 'What's a hobby you've recently started?||If you could have dinner with any historical figure , who would it be?||What's a simple thing that makes you happy?'.Ensure the questions are intriguing, foster curiousity , and contribute to a postive and welcoming conversational environment";

    const result = await generateText({
      model: groq("openai/gpt-oss-20b"),
      prompt,
    });

    //   const returnText= result.toUIMessageStreamResponse();
    //   console.log("Return text from ai : ",returnText)

    // console.log("Result from ai : ", result);
    // console.log("Response text : ", result.text);
    return Response.json(
      { success: true, message: result.text },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "error occured while generating message suggestions :: ",
      error
    );
    return Response.json(
      {
        success: false,
        message: "error occured while generating messages suggestions",
      },
      { status: 500 }
    );
  }
}
