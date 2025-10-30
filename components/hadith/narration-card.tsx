"use client";

import { ScrollTextIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type NarrationData = {
  rank?: number;
  reference: string;
  collection: string;
  english: string;
  arabic: string;
  grade: string;
  narrator: string;
  book: string;
  chapter: string;
  relevance?: string;
  matchType?: string;
  sourceUrl: string;
  similarity?: number;
};

export type NarrationCardProps = {
  hadith: NarrationData;
  variant?: "default" | "highlighted" | "context";
  className?: string;
};

export const NarrationCard = ({
  hadith,
  variant = "default",
  className,
}: NarrationCardProps) => {
  const [showNarrator, setShowNarrator] = useState(false);

  const isHighlighted = variant === "highlighted";
  const isContext = variant === "context";

  // Grade badge color mapping
  const gradeColors = {
    Sahih:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
    Hasan:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300",
    "Da'if":
      "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300",
    Unknown: "bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300",
  };

  const gradeColor =
    gradeColors[hadith.grade as keyof typeof gradeColors] ||
    gradeColors.Unknown;

  // Variant-specific styling
  const cardClasses = cn(
    "flex w-full flex-col overflow-hidden rounded-lg border p-3 transition-all sm:p-4",
    {
      // Default variant - regular hadith in list
      "border-sky-200 bg-gradient-to-br from-sky-50/50 to-orange-50/30 hover:border-sky-400 dark:border-sky-800/50 dark:from-sky-950/20 dark:to-orange-950/10 dark:hover:border-sky-600":
        variant === "default",

      // Highlighted variant - featured hadith (individual page)
      "border-2 border-sky-400 bg-gradient-to-br from-sky-50 to-orange-50/50 shadow-lg dark:border-sky-600 dark:from-sky-950/30 dark:to-orange-950/20":
        isHighlighted,

      // Context variant - muted related hadiths
      "border-sky-200/50 bg-sky-50/30 dark:border-sky-800/30 dark:bg-sky-950/10":
        isContext,
    },
    className
  );

  const arabicTextClasses = cn("mb-4 text-right", {
    "text-xl": variant === "default",
    "text-2xl md:text-3xl mb-6": isHighlighted,
    "text-lg": isContext,
  });

  const englishTextClasses = cn("mb-3 flex-1", {
    "text-base": variant === "default",
    "text-lg leading-relaxed": isHighlighted,
    "text-sm": isContext,
  });

  return (
    <div className={cardClasses}>
      {/* Header with collection, reference, and grade */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 items-center gap-2 font-semibold text-sm">
          <SparklesIcon
            className={cn("shrink-0 text-sky-600 dark:text-sky-400", {
              "size-3.5": !isHighlighted,
              "size-4": isHighlighted,
            })}
          />
          <span className="truncate">{hadith.collection}</span>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            gradeColor,
            {
              "px-2.5 py-1 text-sm": isHighlighted,
            }
          )}
        >
          {hadith.grade}
        </span>
        {variant === "default" && hadith.similarity !== undefined && (
          <span className="ml-auto text-xs text-zinc-500">
            {Math.round(hadith.similarity * 100)}% match
          </span>
        )}
      </div>

      <div
        className={cn("mb-2 text-muted-foreground text-xs", {
          "text-sm": isHighlighted,
        })}
      >
        {hadith.reference}
      </div>

      {/* Arabic text */}
      {hadith.arabic && (
        <div className={arabicTextClasses} dir="rtl">
          <p
            className={cn(
              "break-words font-arabic text-foreground leading-loose",
              {
                "text-xl": !isHighlighted && !isContext,
                "text-2xl md:text-3xl": isHighlighted,
                "text-lg": isContext,
              }
            )}
          >
            {hadith.arabic}
          </p>
        </div>
      )}

      {/* English translation */}
      <div className={englishTextClasses}>
        <p
          className={cn("break-words text-foreground", {
            "leading-relaxed": !isHighlighted,
            "leading-loose": isHighlighted,
            "text-muted-foreground": isContext,
          })}
        >
          {hadith.english}
        </p>
      </div>

      {/* Metadata: Book and Chapter */}
      {(hadith.book !== "Not specified" ||
        hadith.chapter !== "Not specified") && (
        <div
          className={cn(
            "mb-3 space-y-1 rounded-md border border-sky-200/50 bg-sky-50/30 p-2 text-sm dark:border-sky-800/30 dark:bg-sky-950/10",
            {
              "p-3": isHighlighted,
            }
          )}
        >
          {hadith.book !== "Not specified" && (
            <div className="text-muted-foreground">
              <span className="font-medium">Book:</span> {hadith.book}
            </div>
          )}
          {hadith.chapter !== "Not specified" && (
            <div className="text-muted-foreground">
              <span className="font-medium">Chapter:</span> {hadith.chapter}
            </div>
          )}
        </div>
      )}

      {/* Narrator chain (collapsible) */}
      {hadith.narrator && hadith.narrator !== "Not specified" && (
        <div className="mb-3">
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-md border border-sky-200/50 bg-sky-50/30 p-2 text-left text-sm transition-colors hover:bg-sky-100/40 dark:border-sky-800/30 dark:bg-sky-950/10 dark:hover:bg-sky-900/20",
              {
                "p-3": isHighlighted,
              }
            )}
            onClick={() => setShowNarrator(!showNarrator)}
            type="button"
          >
            <span className="font-medium text-muted-foreground">
              Narrator Chain
            </span>
            <span className="text-muted-foreground text-xs">
              {showNarrator ? "Hide" : "Show"}
            </span>
          </button>
          {showNarrator && (
            <div
              className={cn(
                "mt-2 rounded-md border border-sky-200/50 bg-sky-50/30 p-2 text-muted-foreground text-sm dark:border-sky-800/30 dark:bg-sky-950/10",
                {
                  "p-3": isHighlighted,
                }
              )}
            >
              {hadith.narrator}
            </div>
          )}
        </div>
      )}

      {/* Source link */}
      {hadith.sourceUrl && (
        <div
          className={cn(
            "mt-auto flex items-center justify-center gap-2 rounded-md border border-sky-200 bg-sky-50/50 px-3 py-2 dark:border-sky-800/50 dark:bg-sky-950/20",
            {
              "py-3": isHighlighted,
            }
          )}
        >
          <ScrollTextIcon
            className={cn("shrink-0 text-sky-600 dark:text-sky-400", {
              "size-3.5": !isHighlighted,
              "size-4": isHighlighted,
            })}
          />
          <a
            className="text-sky-700 text-sm hover:underline dark:text-sky-300"
            href={hadith.sourceUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            View on Sunnah.com
          </a>
        </div>
      )}
    </div>
  );
};
