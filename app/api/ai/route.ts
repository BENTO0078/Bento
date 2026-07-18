import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai/client";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, context } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are Bento, an AI life-admin assistant. You help users save money by analyzing their financial data, finding subscriptions to cancel, bills to negotiate, refunds to file, and warranties to track. Be concise, actionable, and specific. Always include the estimated savings when possible.",
        },
        {
          role: "user",
          content: context
            ? `Context: ${context}\n\nTask: ${prompt}`
            : prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
