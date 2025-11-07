import { NextResponse } from "next/server";
import { after } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { VOICE_SYSTEM_PROMPT } from "@/lib/ai/voice-system-prompt";
import { createVoiceSession, endVoiceSession, saveVoiceMessage } from "@/lib/db/queries";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [sessionId, response] = await Promise.all([
      createVoiceSession({ userId: session.user.id }),
      fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-realtime-mini",
          voice: "cedar",
          modalities: ["audio", "text"],
          instructions: VOICE_SYSTEM_PROMPT,
        }),
      }),
    ]);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      ...data,
      sessionId,
    });
  } catch (error) {
    console.error("Error creating voice session:", error);
    return NextResponse.json(
      { error: "Failed to create voice session" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sessionId, action, role, transcript } = await request.json();

    // Save message (fire-and-forget)
    if (role && transcript) {
      after(() => saveVoiceMessage(sessionId, role, transcript));
    }

    // Complete session (fire-and-forget)
    if (action === "complete") {
      after(() => endVoiceSession(sessionId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating voice session:", error);
    return NextResponse.json({ success: true }); // Don't fail the request
  }
}
