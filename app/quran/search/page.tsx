import type { Metadata } from 'next';
import { findRelevantVerses } from "@/lib/ai/embeddings";
import { SiteHeader } from "@/components/layout/site-header";
import { SearchUI } from "./search-ui";
import { createPageMetadata } from '@/lib/seo/metadata';

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q: query } = await searchParams;
  
  if (query && query.trim()) {
    const trimmedQuery = query.trim();
    return createPageMetadata({
      title: `"${trimmedQuery}" - Quran Search Results`,
      description: `Find Quran verses about ${trimmedQuery}. Search 6,236 verses with AI-powered semantic understanding.`,
      path: `/quran/search?q=${encodeURIComponent(trimmedQuery)}`,
      keywords: [
        'Quran search',
        trimmedQuery,
        'search Quran verses',
        'Islamic search',
        'semantic search',
      ],
    });
  }
  
  return createPageMetadata({
    title: 'Search the Quran',
    description: 'Search 6,236 Quran verses by topic, keyword, or theme using AI-powered semantic search. Get instant results with context and authentic translations.',
    path: '/quran/search',
    keywords: [
      'Quran search',
      'search Quran verses',
      'Islamic search',
      'Quran by topic',
      'semantic Quran search',
      'find Quran verses',
    ],
  });
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: query } = await searchParams;
  const trimmedQuery = query?.trim();
  
  // Fetch results server-side if query exists
  let results = null;
  if (trimmedQuery) {
    try {
      const verses = await findRelevantVerses(trimmedQuery.slice(0, 200), 20);
      results = {
        results: verses,
        query: trimmedQuery,
        count: verses.length,
      };
    } catch (error) {
      console.error('[Quran Search Page] Error:', error);
      // Continue rendering with null results
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <SearchUI 
        initialQuery={trimmedQuery || ''}
        initialResults={results}
      />
    </div>
  );
}
