import { NextResponse } from "next/server";
import { getVersesBySurah } from "@/lib/db/queries";

// Cache translation requests for 1 hour (verses never change)
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const surahNumber = Number.parseInt(searchParams.get("surahNumber") || "");
  const language = searchParams.get("language") || "en";

  // Validate parameters
  if (Number.isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return NextResponse.json(
      { error: "Invalid surah number" },
      { status: 400 }
    );
  }

  try {
    const verses = await getVersesBySurah({ surahNumber, language });

    if (verses.length === 0) {
      return NextResponse.json(
        { error: "Surah not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(verses);
  } catch (error) {
    console.error("Error fetching surah:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
