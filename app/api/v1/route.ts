import { NextResponse } from "next/server";

/**
 * API health check and metadata endpoint
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "operational",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      endpoints: {
        quran: "/api/v1/quran/search",
        hadith: "/api/v1/hadith/search",
      },
      documentation: "https://criterion.life/developers",
      rateLimit: {
        window: "1 minute",
        maxRequests: 60,
      },
      features: {
        semantic_search: true,
        hybrid_search: true,
        context_verses: true,
        authenticity_filtering: true,
        cors_enabled: true,
      },
      data: {
        quran_verses: 6236,
        hadiths: 12416,
        collections: ["Sahih Bukhari", "Sahih Muslim", "40 Hadith Nawawi", "Riyad as-Salihin"],
        languages: ["en"],
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
