import OpenAI from "openai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });

    return Response.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    return Response.json(
      { error: "AI service failed" },
      { status: 500 }
    );
  }
}
