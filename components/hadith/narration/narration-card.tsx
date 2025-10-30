"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAuthenticityDisplay } from "@/lib/hadith-metadata";

export interface NarrationCardData {
  reference: string;
  collection: string;
  englishText: string;
  arabicText: string;
  grade: string;
  narratorChain: string;
  bookName: string;
  chapterName: string;
  sourceUrl: string;
  hadithNumber?: number;
}

interface NarrationCardProps {
  narration: NarrationCardData;
  variant?: "default" | "highlighted" | "context";
  showLink?: boolean;
  className?: string;
}

export function NarrationCard({
  narration,
  variant = "default",
  showLink = false,
  className,
}: NarrationCardProps) {
  const [showNarrator, setShowNarrator] = useState(false);
  
  const isHighlighted = variant === "highlighted";
  const isContext = variant === "context";

  // Get authenticity info
  const authenticity = getAuthenticityDisplay(narration.grade);

  // Grade badge colors based on authenticity level
  const gradeColors = {
    highest: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
    high: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
    acceptable: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-300 dark:border-blue-700",
    weak: "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 border-orange-300 dark:border-orange-700",
    unknown: "bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300 border-gray-300 dark:border-gray-700",
  };

  const gradeColor = gradeColors[authenticity.level];

  const cardClasses = cn(
    "flex w-full flex-col overflow-hidden rounded-lg border transition-all",
    {
      // Default variant - regular card
      "border-sky-200 bg-gradient-to-br from-sky-50/50 to-orange-50/30 p-4 dark:border-sky-800/50 dark:from-sky-950/20 dark:to-orange-950/10":
        variant === "default",

      // Highlighted variant - featured on individual page
      "border-2 border-sky-400 bg-gradient-to-br from-sky-50 to-orange-50/50 p-6 shadow-lg dark:border-sky-600 dark:from-sky-950/30 dark:to-orange-950/20":
        isHighlighted,

      // Context variant - muted for related hadiths
      "border-muted bg-muted/30 p-3 dark:border-muted/50": isContext,

      // Hover effect for default variant
      "hover:border-sky-400 hover:shadow-md dark:hover:border-sky-600":
        variant === "default",
    },
    className
  );

  const arabicTextClasses = cn("mb-4 text-right font-arabic leading-loose", {
    "text-xl": variant === "default",
    "text-2xl md:text-3xl mb-6": isHighlighted,
    "text-lg text-muted-foreground": isContext,
  });

  const englishTextClasses = cn("mb-3 break-words leading-relaxed", {
    "text-base": variant === "default",
    "text-lg": isHighlighted,
    "text-sm text-muted-foreground": isContext,
  });

  const content = (
    <>
      {/* Header with collection, reference, and grade */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
          <ScrollTextIcon
            className={cn("size-3.5 shrink-0 text-sky-600 dark:text-sky-400", {
              "size-4": isHighlighted,
            })}
          />
          <span className="truncate">{narration.collection}</span>
        </div>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-xs font-medium",
            gradeColor,
            { "px-3 py-1 text-sm": isHighlighted }
          )}
          title={authenticity.description}
        >
          {authenticity.label}
        </span>
      </div>

      {/* Reference */}
      <div className={cn("mb-2 text-xs text-muted-foreground", { "text-sm mb-3": isHighlighted })}>
        {narration.reference}
      </div>

      {/* Arabic text */}
      {narration.arabicText && (
        <div className="mb-4" dir="rtl">
          <p className={arabicTextClasses}>{narration.arabicText}</p>
        </div>
      )}

      {/* English translation */}
      <div className="mb-3 flex-1">
        <p className={englishTextClasses}>{narration.englishText}</p>
      </div>

      {/* Metadata: Book and Chapter */}
      {(narration.bookName !== "Not specified" ||
        narration.chapterName !== "Not specified") && (
        <div
          className={cn(
            "mb-3 space-y-1 rounded-md border border-sky-200/50 bg-sky-50/30 p-2 text-sm dark:border-sky-800/30 dark:bg-sky-950/10",
            { "p-3": isHighlighted }
          )}
        >
          {narration.bookName !== "Not specified" && (
            <div className="text-muted-foreground">
              <span className="font-medium">Book:</span> {narration.bookName}
            </div>
          )}
          {narration.chapterName !== "Not specified" && (
            <div className="text-muted-foreground">
              <span className="font-medium">Chapter:</span>{" "}
              {narration.chapterName}
            </div>
          )}
        </div>
      )}

      {/* Narrator chain (collapsible) */}
      {narration.narratorChain && narration.narratorChain !== "Not specified" && (
        <div className="mb-3">
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-md border border-sky-200/50 bg-sky-50/30 p-2 text-left text-sm transition-colors hover:bg-sky-100/40 dark:border-sky-800/30 dark:bg-sky-950/10 dark:hover:bg-sky-900/20",
              { "p-3": isHighlighted }
            )}
            onClick={() => setShowNarrator(!showNarrator)}
            type="button"
          >
            <span className="font-medium text-muted-foreground">
              Narrator Chain
            </span>
            <span className="text-xs text-muted-foreground">
              {showNarrator ? "Hide" : "Show"}
            </span>
          </button>
          {showNarrator && (
            <div
              className={cn(
                "mt-2 rounded-md border border-sky-200/50 bg-sky-50/30 p-2 text-sm text-muted-foreground dark:border-sky-800/30 dark:bg-sky-950/10",
                { "p-3": isHighlighted }
              )}
            >
              {narration.narratorChain}
            </div>
          )}
        </div>
      )}

      {/* Source link */}
      {narration.sourceUrl && (
        <div
          className={cn(
            "mt-auto flex items-center justify-center gap-2 rounded-md border border-sky-200 bg-sky-50/50 px-3 py-2 dark:border-sky-800/50 dark:bg-sky-950/20",
            { "py-3": isHighlighted }
          )}
        >
          <ScrollTextIcon className="size-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
          <a
            className={cn(
              "text-sm text-sky-700 hover:underline dark:text-sky-300",
              { "text-base": isHighlighted }
            )}
            href={narration.sourceUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            View on Sunnah.com
          </a>
        </div>
      )}
    </>
  );

  // Wrap in Link if showLink is true and hadithNumber is available
  if (showLink && narration.hadithNumber) {
    const collection = narration.collection.toLowerCase().replace(/\s+/g, "");
    return (
      <Link
        href={`/hadith/${collection}/${narration.hadithNumber}`}
        className={cn(cardClasses, "block")}
      >
        {content}
      </Link>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}
