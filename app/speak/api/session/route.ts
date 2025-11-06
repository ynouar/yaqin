import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { voiceSession } from "@/lib/db/schema";
import { VOICE_SYSTEM_PROMPT } from "@/lib/ai/voice-system-prompt";

export async function POST() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create voice session record
    const [dbSession] = await db
      .insert(voiceSession)
      .values({
        userId: session.user.id,
        status: "active",
      })
      .returning();

    // Get OpenAI ephemeral token
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-realtime",
        voice: "alloy",
        modalities: ["audio", "text"],
        instructions: VOICE_SYSTEM_PROMPT,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Return session data with our DB session ID
    return NextResponse.json({
      ...data,
      sessionId: dbSession.id,
    });
  } catch (error) {
    console.error("Error creating voice session:", error);
    return NextResponse.json(
      { error: "Failed to create voice session" },
      { status: 500 }
    );
  }
}
