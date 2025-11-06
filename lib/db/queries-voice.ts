import { db } from "@/lib/db";
import { voiceMessage, voiceSession } from "./schema";
import { eq, sql } from "drizzle-orm";

export async function createVoiceSession(userId: string) {
  const [session] = await db
    .insert(voiceSession)
    .values({
      userId,
      startedAt: new Date(),
      status: "active",
    })
    .returning();

  return session;
}

export async function endVoiceSession(sessionId: string) {
  const [session] = await db
    .select()
    .from(voiceSession)
    .where(eq(voiceSession.id, sessionId))
    .limit(1);

  if (!session) {
    throw new Error("Session not found");
  }

  const duration = session.startedAt
    ? Math.floor((Date.now() - session.startedAt.getTime()) / 1000)
    : null;

  const [updatedSession] = await db
    .update(voiceSession)
    .set({
      endedAt: new Date(),
      duration,
      status: "completed",
    })
    .where(eq(voiceSession.id, sessionId))
    .returning();

  return updatedSession;
}

export function markVoiceSessionError(sessionId: string) {
  // Fire-and-forget: don't block on error logging
  db.update(voiceSession)
    .set({
      status: "error",
      endedAt: new Date(),
    })
    .where(eq(voiceSession.id, sessionId))
    .catch((err: unknown) => console.error("Failed to mark session error:", err));
}

export function saveVoiceMessage(
  sessionId: string,
  role: "user" | "assistant",
  transcript?: string,
  toolCalls?: Array<{
    tool: string;
    args: Record<string, any>;
    result: any;
  }>
) {
  // Fire-and-forget: don't block real-time voice interaction
  const savePromise = (async () => {
    // Save message
    await db.insert(voiceMessage).values({
      sessionId,
      role,
      transcript,
      toolCalls,
    });

    // Update session counters in a single query
    const toolCallIncrement = toolCalls ? toolCalls.length : 0;
    await db
      .update(voiceSession)
      .set({
        messageCount: sql`${voiceSession.messageCount} + 1`,
        toolCallCount: sql`${voiceSession.toolCallCount} + ${toolCallIncrement}`,
      })
      .where(eq(voiceSession.id, sessionId));
  })();

  // Log errors but don't throw
  savePromise.catch((err: unknown) =>
    console.error("Failed to save voice message:", err)
  );
}