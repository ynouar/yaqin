import { NextResponse } from "next/server";
import { getVerseWithContext } from "@/lib/db/queries";

// Cache translation requests for 1 hour (verses never change)
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const surahNumber = Number.parseInt(searchParams.get("surahNumber") || "");
  const ayahNumber = Number.parseInt(searchParams.get("ayahNumber") || "");
  const language = searchParams.get("language") || "en";
  const showContext = searchParams.get("context") === "true";

  // Validate parameters
  if (Number.isNaN(surahNumber) || Number.isNaN(ayahNumber)) {
    return NextResponse.json(
      { error: "Invalid parameters" },
      { status: 400 }
    );
  }

  try {
    const contextWindow = showContext ? 5 : 0;
    const verseData = await getVerseWithContext({
      surahNumber,
      ayahNumber,
      contextWindow,
      language,
    });

    if (!verseData) {
      return NextResponse.json(
        { error: "Verse not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(verseData);
  } catch (error) {
    console.error("Error fetching verse:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
