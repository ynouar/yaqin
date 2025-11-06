import { NextResponse } from "next/server";
import { after } from "next/server";
import { findRelevantVerses } from "@/lib/ai/embeddings";
import { saveVoiceMessage } from "@/lib/db/queries";

export async function POST(request: Request) {
  try {
    const { tool, args, sessionId } = await request.json();

    if (tool === "queryQuran") {
      const verses = await findRelevantVerses(args.question);
      
      const result = {
        success: verses.length > 0,
        totalVerses: verses.length,
        verses: verses.map((v, index) => ({
          reference: `${v.surahNameEnglish} ${v.surahNumber}:${v.ayahNumber}`,
          surahArabic: v.surahNameArabic,
          arabic: v.textArabic,
          english: v.textEnglish,
          relevance: `${(v.similarity * 100).toFixed(1)}%`,
          rank: index + 1,
        })),
      };

      // Save tool call (fire-and-forget)
      if (sessionId) {
        after(() =>
          saveVoiceMessage(sessionId, "assistant", undefined, [
            {
              tool: "queryQuran",
              args,
              result: {
                totalVerses: result.totalVerses,
                topReferences: result.verses.slice(0, 3).map((v) => v.reference),
              },
            },
          ])
        );
      }

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown tool" }, { status: 400 });
  } catch (error) {
    console.error("Error executing tool:", error);
    return NextResponse.json(
      { error: "Failed to execute tool" },
      { status: 500 }
    );
  }
}
