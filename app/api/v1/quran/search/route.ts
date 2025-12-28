import { NextRequest, NextResponse } from "next/server";
import { findRelevantVerses } from "@/lib/ai/embeddings";
import { checkApiRateLimit } from "@/lib/api/rate-limit";
import {
  quranSearchSchema,
  validateQueryParams,
  formatValidationError,
} from "@/lib/api/validation";

/**
 * Public API endpoint for Quran semantic search
 * 
 * @route GET /api/v1/quran/search
 * @query q - Search query (required)
 * @query limit - Number of results (optional, default: 7, max: 20)
 * @query language - Language code (optional, default: "en", supports: "en", "sk")
 * 
 * @returns {
 *   results: Array<{
 *     surahNumber, ayahNumber, text, translation,
 *     surahNameArabic, surahNameEnglish, similarity
 *   }>,
 *   query, count, language
 * }
 */
export async function GET(request: NextRequest) {
  // CORS headers for external developers
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
      quranSearchSchema
    );

    if (!validation.success) {
      return NextResponse.json(formatValidationError(validation.error), {
        status: 400,
        headers,
      });
    }

    const { q: query, limit } = validation.data;

    // Execute RAG search (currently English only for embeddings)
    // Note: language parameter for future multilingual embedding support
    const verses = await findRelevantVerses(query, limit);

    return NextResponse.json(
      {
        results: verses,
        query: query.trim(),
        count: verses.length,       
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("[Public API - Quran Search] Error:", error);
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
