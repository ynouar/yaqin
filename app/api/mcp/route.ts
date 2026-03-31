/**
 * Yaqin MCP Server API Route
 *
 * Exposes Yaqin's semantic search capabilities through the Model Context Protocol.
 * Deployed on Vercel Functions with HTTP transport (Streamable HTTP).
 *
 * Tools provided:
 * - search_quran: Semantic search across 6,236 Quran verses
 * - search_hadith: Semantic search across 21,641 authentic Hadiths from 6 collections
 * - get_verse: Retrieve specific verse by reference
 *
 * Usage:
 * - Local testing: Use MCP Inspector at http://localhost:3000/api/mcp
 * - Production: https://yaqin.app/api/mcp
 * - Configure in Cursor: .cursor/mcp.json or Claude Desktop config
 *
 * @see https://modelcontextprotocol.io/
 * @see https://vercel.com/docs/mcp
 */

import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import { searchQuranTool, searchHadithTool, getVerseTool } from '@/lib/mcp/tools';

// Create MCP handler with our three tools
const handler = createMcpHandler(
  (server) => {
    // Tool 1: Search Quran verses
    server.tool(
      'search_quran',
      'Search 6,236 Quran verses using semantic similarity. Returns verses with ±2 surrounding verses for context. Use this for questions about Quranic guidance, themes, or specific topics.',
      {
        query: z
          .string()
          .min(1, 'Query cannot be empty')
          .max(500, 'Query too long (max 500 characters)')
          .describe('Search query for Quran verses (e.g., "patience in hardship")'),
        limit: z
          .number()
          .int()
          .min(1)
          .max(20)
          .default(7)
          .describe('Number of results to return (1-20, default: 7)'),
      },
      async ({ query, limit }) => {
        return await searchQuranTool({ query, limit });
      },
    );

    // Tool 2: Search Hadith collections
    server.tool(
      'search_hadith',
      'Search 21,641 authentic Hadith narrations from 6 major collections: Sahih Bukhari, Sahih Muslim, Jami` at-Tirmidhi, Sunan Abi Dawud, 40 Hadith Nawawi, and Riyad as-Salihin. Filter by collection and authenticity grade. Use this for questions about Prophet Muhammad\'s teachings and practices.',
      {
        query: z
          .string()
          .min(1, 'Query cannot be empty')
          .max(500, 'Query too long (max 500 characters)')
          .describe('Search query for Hadith (e.g., "charity and good deeds")'),
        collections: z
          .string()
          .optional()
          .describe(
            'Comma-separated collection names: bukhari, muslim, tirmidhi, abudawud, nawawi40, riyadussalihin (leave empty for all)',
          ),
        grade: z
          .enum(['sahih-only', 'sahih-and-hasan', 'all'])
          .default('sahih-only')
          .describe(
            'Authenticity filter: sahih-only (most authentic), sahih-and-hasan (authentic + good), or all',
          ),
        limit: z
          .number()
          .int()
          .min(1)
          .max(15)
          .default(5)
          .describe('Number of results to return (1-15, default: 5)'),
      },
      async ({ query, collections, grade, limit }) => {
        return await searchHadithTool({ query, collections, grade, limit });
      },
    );

    // Tool 3: Get specific verse by reference
    server.tool(
      'get_verse',
      'Retrieve a specific Quran verse by reference. Use this when you need an exact verse (e.g., Ayat al-Kursi is 2:255).',
      {
        reference: z
          .string()
          .regex(
            /^\d+:\d+$/,
            'Invalid format. Use "surah:ayah" (e.g., "2:255" for Ayat al-Kursi)',
          )
          .describe('Verse reference in format "surah:ayah" (e.g., "2:255", "18:10")'),
      },
      async ({ reference }) => {
        return await getVerseTool({ reference });
      },
    );
  },
  {
    // Server metadata
    serverInfo: {
      name: 'criterion-islamic-search',
      version: '1.0.0',
    },
  },
  {
    // Route configuration for Vercel
    basePath: '/api',
  },
);

// Export handlers for Next.js App Router
// Supports GET (SSE stream), POST (requests), DELETE (cleanup)
export { handler as GET, handler as POST, handler as DELETE };
