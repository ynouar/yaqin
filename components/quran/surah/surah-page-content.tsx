"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getQuranLanguageFromParam, type QuranLanguage } from "@/lib/quran-language";
import { VerseCard } from "../verse/verse-card";
import { LanguageSelector } from "../language-selector";

interface Verse {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  textArabic: string;
  textEnglish: string;
  translation?: string | null;
  surahNameTranslated?: string | null;
  translatorName?: string | null;
}

interface SurahPageContentProps {
  initialVerses: Verse[];
  surahNumber: number;
}

export function SurahPageContent({
  initialVerses,
  surahNumber,
}: SurahPageContentProps) {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") || undefined;
  const language = getQuranLanguageFromParam(langParam);
  
  const [verses, setVerses] = useState(initialVerses);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch translated verses when language changes
  useEffect(() => {
    // Skip if English (already in initialVerses)
    if (language === "en") {
      setVerses(initialVerses);
      return;
    }

    // Fetch translation
    const fetchTranslation = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          surahNumber: String(surahNumber),
          language,
        });

        const response = await fetch(`/quran/api/surah?${params}`);
        if (!response.ok) throw new Error("Failed to fetch translation");
        
        const data = await response.json();
        setVerses(data);
      } catch (error) {
        console.error("Error fetching translation:", error);
        // Fallback to initial data on error
        setVerses(initialVerses);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslation();
  }, [language, surahNumber, initialVerses]);

  return (
    <>
      {/* Language Selector */}
      <div className="mb-8 flex justify-end">
        <LanguageSelector currentLanguage={language} className="w-[200px]" />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 text-center text-sm text-muted-foreground">
          Loading translation...
        </div>
      )}

      {/* Verses */}
      <div className="space-y-6">
        {verses.map((verse) => (
          <VerseCard
            key={verse.id}
            verse={verse}
            variant="default"
            showVerseLink
            showQuranComLink
          />
        ))}
      </div>
    </>
  );
}
