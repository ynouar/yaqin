import type { Metadata } from 'next';
import Link from "next/link";
import { CriterionBranding } from "@/components/criterion-branding";
import { findRelevantVerses } from "@/lib/ai/embeddings";
import { SearchUI } from "./search-ui";
import { createPageMetadata } from '@/lib/seo/metadata';

// Route segment config
export const dynamic = 'force-dynamic'; // SSR for each search query
export const revalidate = 3600; // Cache search results for 1 hour

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
      path: `/search?q=${encodeURIComponent(trimmedQuery)}`,
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
    title: 'Search the Quran - Semantic Search',
    description: 'Search 6,236 Quran verses by topic using AI-powered semantic search.',
    path: '/search',
    keywords: [
      'Quran search',
      'search Quran verses',
      'Islamic search',
      'Quran by topic',
      'semantic Quran search',
    ],
  });
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: query } = await searchParams;
  const trimmedQuery = query?.trim();
  
  // Server-side search if query exists
  let results = null;
  if (trimmedQuery) {
    try {
      const verses = await findRelevantVerses(trimmedQuery.slice(0, 200), 20);
      
      results = {
        results: verses.map(v => ({
          surahNumber: v.surahNumber,
          ayahNumber: v.ayahNumber,
          surahNameEnglish: v.surahNameEnglish,
          surahNameArabic: v.surahNameArabic,
          textArabic: v.textArabic,
          textEnglish: v.textEnglish,
          similarity: v.similarity || 0,
          hasContext: v.hasContext,
          contextBefore: v.contextBefore,
          contextAfter: v.contextAfter,
        })),
        query: trimmedQuery,
        count: verses.length,
      };
    } catch (error) {
      console.error('[Quran Search Page] Error:', error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <CriterionBranding />
          <nav className="flex gap-4 md:gap-6 text-sm">
            <Link href="/" className="hover:underline">
              Chat
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/quran" className="hover:underline">
              Quran
            </Link>
            <Link href="/faq" className="hover:underline">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <SearchUI initialQuery={trimmedQuery || ''} initialResults={results} />
    </div>
  );
}
