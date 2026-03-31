/**
 * Tools for Yaqin Islamic Search
 *
 * Three focused tools that expose our semantic search capabilities:
 * 1. search_quran - Search 6,236 Quran verses
 * 2. search_hadith - Search 21,641 authentic Hadiths from 6 collections
 * 3. get_verse - Get specific verse by reference
 */

import { findRelevantVerses, findRelevantHadiths } from '@/lib/ai/embeddings';
import { parseQuranReference } from '@/lib/quran-reference-parser';
import { db } from '@/lib/db';
import { quranVerse } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import type {
  SearchQuranParams,
  SearchHadithParams,
  GetVerseParams,
  ToolResponse,
} from './types';

/**
 * Search Quran verses using semantic similarity
 * Returns top results with ±2 surrounding verses for context
 */
export async function searchQuranTool(
  params: SearchQuranParams,
): Promise<ToolResponse> {
  try {
    const { query, limit = 7 } = params;

    // Input validation
    if (!query || query.trim().length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Query cannot be empty',
          },
        ],
        isError: true,
      };
    }

    if (query.length > 500) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Query too long (max 500 characters)',
          },
        ],
        isError: true,
      };
    }

    if (limit < 1 || limit > 20) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Limit must be between 1 and 20',
          },
        ],
        isError: true,
      };
    }

    // Execute search using existing RAG logic
    const verses = await findRelevantVerses(query.trim(), limit);

    // Format results
    const result = {
      results: verses.map((v) => ({
        reference: `${v.surahNumber}:${v.ayahNumber}`,
        surah: v.surahNameEnglish,
        surahArabic: v.surahNameArabic,
        ayah: v.ayahNumber,
        textArabic: v.textArabic,
        textEnglish: v.textEnglish,
        similarity: Math.round(v.similarity * 100) / 100,
        hasContext: v.hasContext,
        contextBefore: v.contextBefore,
        contextAfter: v.contextAfter,
      })),
      query: query.trim(),
      count: verses.length,
      tip: 'Context verses (±2 surrounding verses) are included for top results',
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error('[MCP] search_quran error:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error searching Quran: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Search Hadith collections using semantic similarity
 * Filter by authenticity grade and collection
 */
export async function searchHadithTool(
  params: SearchHadithParams,
): Promise<ToolResponse> {
  try {
    const { query, collections, grade = 'sahih-only', limit = 5 } = params;

    // Input validation
    if (!query || query.trim().length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Query cannot be empty',
          },
        ],
        isError: true,
      };
    }

    if (query.length > 500) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Query too long (max 500 characters)',
          },
        ],
        isError: true,
      };
    }

    if (limit < 1 || limit > 15) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Limit must be between 1 and 15',
          },
        ],
        isError: true,
      };
    }

    // Parse collections if provided
    const collectionArray = collections
      ? collections.split(',').map((c) => c.trim() as any)
      : undefined;

    // Execute search using existing RAG logic
    const hadiths = await findRelevantHadiths(query.trim(), {
      collections: collectionArray,
      gradePreference: grade,
      limit,
    });

    // Format results
    const result = {
      results: hadiths.map((h) => ({
        reference: h.reference,
        collection: h.collectionName,
        textEnglish: h.englishText,
        textArabic: h.arabicText,
        grade: h.grade || 'Unknown',
        narrator: h.narratorChain || 'Not specified',
        book: h.bookName,
        chapter: h.chapterName,
        sourceUrl: h.sourceUrl,
        similarity: Math.round(h.similarity * 100) / 100,
      })),
      query: query.trim(),
      count: hadiths.length,
      filters: {
        collections: collectionArray || ['all'],
        grade,
      },
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error('[MCP] search_hadith error:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error searching Hadith: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Get a specific Quran verse by reference
 * Format: "surah:ayah" (e.g., "2:255" for Ayat al-Kursi)
 */
export async function getVerseTool(
  params: GetVerseParams,
): Promise<ToolResponse> {
  try {
    const { reference } = params;

    // Parse reference
    const parsed = parseQuranReference(reference);

    if (!parsed) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Invalid verse reference format. Use "surah:ayah" (e.g., "2:255")',
          },
        ],
        isError: true,
      };
    }

    // Fetch verse from database
    const [verse] = await db
      .select()
      .from(quranVerse)
      .where(
        and(
          eq(quranVerse.surahNumber, parsed.surahNumber),
          eq(quranVerse.ayahNumber, parsed.startAyah),
        ),
      )
      .limit(1);

    if (!verse) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: Verse ${reference} not found`,
          },
        ],
        isError: true,
      };
    }

    // Format result
    const result = {
      reference: `${verse.surahNumber}:${verse.ayahNumber}`,
      surah: verse.surahNameEnglish,
      surahArabic: verse.surahNameArabic,
      ayah: verse.ayahNumber,
      textArabic: verse.textArabic,
      textEnglish: verse.textEnglish,
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error('[MCP] get_verse error:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error retrieving verse: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
}
