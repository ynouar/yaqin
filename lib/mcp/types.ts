/**
 * Type definitions for Criterion MCP Server
 *
 * Simple, focused types for our 3 core tools:
 * - search_quran: Semantic search across Quran verses
 * - search_hadith: Semantic search across Hadith collections
 * - get_verse: Retrieve specific verse by reference
 */

// Quran search parameters
export interface SearchQuranParams {
  query: string; // Semantic search query (1-500 chars)
  limit?: number; // Number of results (1-20, default: 7)
}

// Hadith search parameters
export interface SearchHadithParams {
  query: string; // Semantic search query (1-500 chars)
  collections?: string; // Comma-separated: bukhari,muslim,nawawi40,riyadussalihin
  grade?: 'sahih-only' | 'sahih-and-hasan' | 'all'; // Authenticity filter
  limit?: number; // Number of results (1-15, default: 5)
}

// Get specific verse parameters
export interface GetVerseParams {
  reference: string; // Format: "surah:ayah" (e.g., "2:255" for Ayat al-Kursi)
}

// Standard MCP tool response
export interface ToolResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
  [key: string]: unknown; // Allow additional properties for MCP compatibility
}
