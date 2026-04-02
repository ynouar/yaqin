import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ArrowLeft, BookOpen, Sparkles, Search, MessageCircle } from "lucide-react";
import { getLocale } from "next-intl/server";
import { getAllTopicSlugs, getTopicBySlug, getRelatedTopics } from "@/lib/topics";
import { SiteHeader } from "@/components/layout/site-header";
import { findRelevantVerses } from "@/lib/ai/embeddings";
import { findRelevantHadiths } from "@/lib/ai/embeddings";
import { VerseCard } from "@/components/quran/verse/verse-card";
import { NarrationCard } from "@/components/hadith/narration-card";
import { createPageMetadata } from '@/lib/seo/metadata';

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all topics
 */
export async function generateStaticParams() {
  return getAllTopicSlugs().map((slug) => ({ slug }));
}

/**
 * Generate metadata for each topic
 */
export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return {
      title: "Topic Not Found",
    };
  }

  return createPageMetadata({
    title: `${topic.title} in Islam - Quran & Hadith`,
    description: topic.description,
    path: `/topics/${slug}`,
    keywords: topic.keywords,
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const locale = await getLocale();
  const isFr = locale === 'fr';

  const displayTitle = (isFr && topic.titleFr) ? topic.titleFr : topic.title;
  const displayDescription = (isFr && topic.descriptionFr) ? topic.descriptionFr : topic.description;

  // Fetch relevant content using RAG
  const [rawVerses, hadiths] = await Promise.all([
    findRelevantVerses(topic.query, 15),
    findRelevantHadiths(topic.query, { limit: 8, gradePreference: 'sahih-only' }),
  ]);

  // Map French translation when locale is fr
  const verses = rawVerses.map((v) => ({
    ...v,
    translation: (isFr && (v as any).textFrench) ? (v as any).textFrench : v.textEnglish,
  }));

  // Format hadiths for the HadithCard component
  const formattedHadiths = hadiths.map((h) => ({
    reference: h.reference,
    collection: h.collectionName,
    english: h.englishText,
    arabic: h.arabicText,
    grade: h.grade || 'Unknown',
    narrator: h.narratorChain || 'Not specified',
    book: h.bookName || 'Not specified',
    chapter: h.chapterName || 'Not specified',
    sourceUrl: h.sourceUrl || '',
    similarity: h.similarity,
  }));

  const relatedTopics = getRelatedTopics(slug);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <SiteHeader />

      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/topics"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {isFr ? 'Tous les sujets' : 'All Topics'}
          </Link>

          <div className="flex items-start gap-4 mb-6">
            {topic.icon && (
              <div className="text-5xl" role="img" aria-label={displayTitle}>
                {topic.icon}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                {displayTitle}
              </h1>
              {topic.titleAr && (
                <p className="text-2xl text-muted-foreground font-arabic mb-3" dir="rtl">
                  {topic.titleAr}
                </p>
              )}
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {displayDescription}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/quran/search?q=${encodeURIComponent(topic.title)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm font-medium">{isFr ? 'Chercher des versets' : 'Search More Verses'}</span>
            </Link>
            <Link
              href={`/`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{isFr ? 'Poser une question' : 'Ask Questions'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Quran Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">
              {isFr ? `Versets du Coran sur ${displayTitle}` : `Quran Verses About ${displayTitle}`}
            </h2>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            {isFr
              ? `${verses.length} versets pertinents trouvés`
              : `Found ${verses.length} relevant verses from the Quran`}
          </p>

          {verses.length > 0 ? (
            <div className="space-y-6">
              <Suspense fallback={<div className="text-center py-8 text-muted-foreground">{isFr ? 'Chargement...' : 'Loading verses...'}</div>}>
                {verses.map((verse) => (
                  <VerseCard
                    key={`${verse.surahNumber}:${verse.ayahNumber}`}
                    verse={verse}
                  />
                ))}
              </Suspense>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{isFr ? 'Aucun verset trouvé pour ce sujet.' : 'No verses found for this topic.'}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href={`/quran/search?q=${encodeURIComponent(topic.title)}`}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Sparkles className="h-4 w-4" />
              {isFr ? `Chercher plus de versets sur ${displayTitle}` : `Search more verses about ${displayTitle}`}
            </Link>
          </div>
        </section>

        {/* Hadith Section */}
        {formattedHadiths.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              <h2 className="text-2xl md:text-3xl font-bold">
                {isFr ? `Hadiths Authentiques sur ${displayTitle}` : `Authentic Hadiths About ${displayTitle}`}
              </h2>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              {isFr
                ? `${formattedHadiths.length} narrations authentiques trouvées (grade Sahih)`
                : `Found ${formattedHadiths.length} authentic narrations (Sahih grade)`}
            </p>

            <div className="space-y-6">
              {formattedHadiths.map((hadith, index) => (
                <NarrationCard
                  key={`${hadith.reference}-${index}`}
                  hadith={hadith}
                  variant="default"
                />
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href={`/hadith/search?q=${encodeURIComponent(topic.title)}`}
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Sparkles className="h-4 w-4" />
                {isFr ? `Chercher plus de hadiths sur ${displayTitle}` : `Search more hadiths about ${displayTitle}`}
              </Link>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <div className="mb-16 p-8 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h3 className="text-xl font-semibold mb-3">
            {isFr ? `Vous voulez en savoir plus sur ${displayTitle} ?` : `Want to explore more about ${displayTitle}?`}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {isFr
              ? "Utilisez notre assistant IA pour poser des questions et obtenir des réponses ancrées dans le Coran et les Hadiths."
              : "Use our AI-powered chat to ask specific questions and get answers grounded in Quran and Hadith."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/?q=${encodeURIComponent(isFr ? `Parle-moi de ${displayTitle} en Islam` : `Tell me more about ${topic.title.toLowerCase()} in Islam`)}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{isFr ? `Poser une question sur ${displayTitle}` : `Ask About ${displayTitle}`}</span>
            </Link>
            <Link
              href={`/hadith/search?q=${encodeURIComponent(topic.title)}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              <Search className="h-5 w-5" />
              <span>{isFr ? 'Chercher des Hadiths' : 'Search More Hadiths'}</span>
            </Link>
          </div>
        </div>

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <section className="pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">{isFr ? 'Sujets Connexes' : 'Related Topics'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {relatedTopics.map((relatedTopic) => (
                <Link
                  key={relatedTopic.slug}
                  href={`/topics/${relatedTopic.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-lg border hover:border-primary transition-colors"
                >
                  {relatedTopic.icon && (
                    <span className="text-2xl">{relatedTopic.icon}</span>
                  )}
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {(isFr && relatedTopic.titleFr) ? relatedTopic.titleFr : relatedTopic.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
