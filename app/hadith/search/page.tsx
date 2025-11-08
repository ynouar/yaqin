import type { Metadata } from 'next';
import { findRelevantHadiths } from "@/lib/ai/embeddings";
import { SiteHeader } from "@/components/layout/site-header";
import { HadithSearchUI } from "./search-ui";

type Collection = "bukhari" | "muslim" | "nawawi40" | "riyadussalihin";
type GradePreference = "sahih-only" | "sahih-and-hasan" | "all";

const VALID_COLLECTIONS: Collection[] = ["bukhari", "muslim", "nawawi40", "riyadussalihin"];
const VALID_GRADES: GradePreference[] = ["sahih-only", "sahih-and-hasan", "all"];

interface PageProps {
  searchParams: Promise<{
    q?: string;
    collections?: string;
    grade?: string;
  }>;
}

export default async function HadithSearchPage({ searchParams }: PageProps) {
  const { q: query, collections: collectionsParam, grade: gradeParam } = await searchParams;
  const trimmedQuery = query?.trim();
  
  // Parse collections filter
  let collections: Collection[] | undefined;
  let selectedCollections: Collection[] = [];
  if (collectionsParam) {
    const parsed = collectionsParam
      .split(",")
      .map((c) => c.trim() as Collection)
      .filter((c) => VALID_COLLECTIONS.includes(c));
    if (parsed.length > 0) {
      collections = parsed;
      selectedCollections = parsed;
    }
  }

  // Parse grade preference
  let gradePreference: GradePreference = "sahih-only";
  if (gradeParam && VALID_GRADES.includes(gradeParam as GradePreference)) {
    gradePreference = gradeParam as GradePreference;
  }
  
  // Fetch results server-side if query exists
  let results = null;
  if (trimmedQuery) {
    try {
      const hadiths = await findRelevantHadiths(trimmedQuery.slice(0, 200), {
        collections,
        gradePreference,
        limit: 15,
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

      // Map database fields to component's expected format
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

      results = {
        results: formattedHadiths,
        query: trimmedQuery,
        count: formattedHadiths.length,
        filters: {
          collections: collectionsSearched,
          gradeFilter: gradePreference,
        },
      };
    } catch (error) {
      console.error('[Hadith Search Page] Error:', error);
      // Continue rendering with null results
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <HadithSearchUI 
        initialQuery={trimmedQuery || ''}
        initialResults={results}
        initialCollections={selectedCollections}
        initialGrade={gradePreference}
      />
    </div>
  );
}
