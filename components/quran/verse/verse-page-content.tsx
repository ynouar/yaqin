"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getQuranLanguageFromParam, type QuranLanguage } from "@/lib/quran-language";
import { VerseCard } from "./verse-card";
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

interface VersePageContentProps {
  initialData: {
    target: Verse;
    contextBefore: Verse[];
    contextAfter: Verse[];
  };
  surahNumber: number;
  ayahNumber: number;
  showContext: boolean;
}

export function VersePageContent({
  initialData,
  surahNumber,
  ayahNumber,
  showContext,
}: VersePageContentProps) {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") || undefined;
  const language = getQuranLanguageFromParam(langParam);
  
  const [verseData, setVerseData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch translated verses when language changes
  useEffect(() => {
    // Skip if English (already in initialData)
    if (language === "en") {
      setVerseData(initialData);
      return;
    }

    // Fetch translation
    const fetchTranslation = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          surahNumber: String(surahNumber),
          ayahNumber: String(ayahNumber),
          language,
          context: showContext ? "true" : "false",
        });

        const response = await fetch(`/quran/api/verse?${params}`);
        if (!response.ok) throw new Error("Failed to fetch translation");
        
        const data = await response.json();
        setVerseData(data);
      } catch (error) {
        console.error("Error fetching translation:", error);
        // Fallback to initial data on error
        setVerseData(initialData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslation();
  }, [language, surahNumber, ayahNumber, showContext, initialData]);

  return (
    <>
      {/* Language Selector */}
      <div className="mb-6 flex justify-end">
        <LanguageSelector currentLanguage={language} className="w-[200px]" />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 text-center text-sm text-muted-foreground">
          Loading translation...
        </div>
      )}

      {/* Context Before */}
      {showContext && verseData.contextBefore.length > 0 && (
        <div className="mb-6 space-y-4">
          {verseData.contextBefore.map((verse) => (
            <VerseCard
              key={verse.id}
              verse={verse}
              variant="context"
              showVerseLink
              showQuranComLink={false}
            />
          ))}
        </div>
      )}

      {/* Main Verse - Highlighted */}
      <div className="mb-6">
        <VerseCard
          verse={verseData.target}
          variant="highlighted"
          showQuranComLink
        />
      </div>

      {/* Context After */}
      {showContext && verseData.contextAfter.length > 0 && (
        <div className="mb-8 space-y-4">
          {verseData.contextAfter.map((verse) => (
            <VerseCard
              key={verse.id}
              verse={verse}
              variant="context"
              showVerseLink
              showQuranComLink={false}
            />
          ))}
        </div>
      )}
    </>
  );
}
