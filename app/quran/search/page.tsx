import type { Metadata } from 'next';
import { findRelevantVerses } from "@/lib/ai/embeddings";
import { SiteHeader } from "@/components/layout/site-header";
import { SearchUI } from "./search-ui";

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
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
