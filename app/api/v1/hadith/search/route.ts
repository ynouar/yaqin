import { NextRequest, NextResponse } from "next/server";
import { findRelevantHadiths } from "@/lib/ai/embeddings";
import { checkApiRateLimit } from "@/lib/api/rate-limit";
import {
  hadithSearchSchema,
  validateQueryParams,
  formatValidationError,
} from "@/lib/api/validation";

type Collection = "bukhari" | "muslim" | "nawawi40" | "riyadussalihin";
type GradePreference = "sahih-only" | "sahih-and-hasan" | "all";

/**
 * Public API endpoint for Hadith hybrid search (semantic + keyword)
 * 
 * @route GET /api/v1/hadith/search
 * @query q - Search query (required)
 * @query collections - Comma-separated collection names (optional)
 * @query grade - Grade filter: "sahih-only" | "sahih-and-hasan" | "all" (optional, default: "sahih-only")
 * @query limit - Number of results (optional, default: 5, max: 15)
 * 
 * @returns {
 *   results: Array<{
 *     reference, collection, english, arabic, grade,
 *     narrator, book, chapter, sourceUrl, similarity
 *   }>,
 *   query, count, filters
 * }
 */
export async function GET(request: NextRequest) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    // Rate limiting
    const rateLimitResult = await checkApiRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429, headers }
      );
    }

    // Validate query parameters with Zod
    const validation = validateQueryParams(
      request.nextUrl.searchParams,
      hadithSearchSchema
    );

    if (!validation.success) {
      return NextResponse.json(formatValidationError(validation.error), {
        status: 400,
        headers,
      });
    }

    const { q: query, collections, grade, limit } = validation.data;

    // Execute hybrid RAG search
    const hadiths = await findRelevantHadiths(query, {
      collections,
      gradePreference: grade,
      limit,
    });

    // Map collection codes to display names
    const collectionNames: Record<Collection, string> = {
      bukhari: "Sahih Bukhari",
      muslim: "Sahih Muslim",
      nawawi40: "40 Hadith Nawawi",
      riyadussalihin: "Riyad as-Salihin",
    };

    const collectionsSearched = collections
      ? collections.map((c) => collectionNames[c])
      : ["All collections"];

    // Format response
    const formattedHadiths = hadiths.map((h) => ({
      reference: h.reference,
      collection: h.collectionName,
      english: h.englishText,
      arabic: h.arabicText,
      grade: h.grade || "Unknown",
      narrator: h.narratorChain || "Not specified",
      book: h.bookName || "Not specified",
      chapter: h.chapterName || "Not specified",
      sourceUrl: h.sourceUrl || "",
      similarity: h.similarity,
    }));

    return NextResponse.json(
      {
        results: formattedHadiths,
        query: query.trim(),
        count: formattedHadiths.length,
        filters: {
          collections: collectionsSearched,
          gradeFilter: grade,
        },
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("[Public API - Hadith Search] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred while processing your request",
      },
      { status: 500, headers }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
