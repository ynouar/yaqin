import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';
import { getHadithByCollectionAndNumber, getAdjacentHadiths } from '@/lib/db/queries';
import { getCollectionMetadata, getAuthenticityDisplay, isValidCollection } from '@/lib/hadith-metadata';
import { createBreadcrumbSchema } from '@/lib/seo/schema';
import { HadithPageLayout } from '@/components/hadith/layout/hadith-page-layout';
import { NarrationHeader } from '@/components/hadith/narration/narration-header';
import { NarrationCard } from '@/components/hadith/narration-card';
import { PageNavigation } from '@/components/quran/navigation/page-navigation';

interface PageProps {
  params: Promise<{
    collection: string;
    hadithNumber: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collection, hadithNumber } = await params;
  const hadithNum = Number.parseInt(hadithNumber);

  if (!isValidCollection(collection) || Number.isNaN(hadithNum)) {
    return { title: 'Hadith Not Found' };
  }

  const hadith = await getHadithByCollectionAndNumber({
    collection,
    hadithNumber: hadithNum,
  });

  if (!hadith) {
    return { title: 'Hadith Not Found' };
  }

  const collectionMeta = getCollectionMetadata(collection);
  const title = `${hadith.reference} - ${hadith.chapterName || 'Hadith'}`;
  const description = hadith.englishText.slice(0, 200) + (hadith.englishText.length > 200 ? '...' : '');

  return {
    title,
    description,
    keywords: [
      hadith.reference,
      collectionMeta?.name || collection,
      hadith.grade || '',
      hadith.bookName || '',
      'authentic hadith',
      'Islamic narration',
      'Sunnah',
    ].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function HadithPage({ params }: PageProps) {
  const { collection, hadithNumber } = await params;
  const hadithNum = Number.parseInt(hadithNumber);

  // Validate parameters
  if (!isValidCollection(collection) || Number.isNaN(hadithNum) || hadithNum < 1) {
    notFound();
  }

  const hadith = await getHadithByCollectionAndNumber({
    collection,
    hadithNumber: hadithNum,
  });

  if (!hadith) {
    notFound();
  }

  const collectionMeta = getCollectionMetadata(collection);
  const adjacent = await getAdjacentHadiths(collection, hadithNum);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://criterion.life';
  const authenticityInfo = getAuthenticityDisplay(hadith.grade || 'Unknown');

  // Breadcrumb schema
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Hadith', url: `${siteUrl}/hadith` },
    { name: collectionMeta?.name || collection, url: `${siteUrl}/hadith/${collection}` },
    { name: `#${hadithNum}`, url: `${siteUrl}/hadith/${collection}/${hadithNum}` },
  ]);

  // Format hadith for NarrationCard
  const formattedHadith = {
    reference: hadith.reference,
    collection: hadith.collectionName,
    english: hadith.englishText,
    arabic: hadith.arabicText,
    grade: authenticityInfo.label,
    narrator: hadith.narratorChain || 'Not specified',
    book: hadith.bookName || 'Not specified',
    chapter: hadith.chapterName || 'Not specified',
    sourceUrl: hadith.sourceUrl || '',
  };

  return (
    <HadithPageLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Hadith', href: '/hadith' },
        { label: collectionMeta?.name || collection, href: `/hadith/${collection}` },
        { label: `#${hadithNum}` },
      ]}
      jsonLd={breadcrumbSchema}
      cta={{
        title: 'Have questions about this hadith?',
        description: 'Ask our AI assistant powered by Quran and Hadith',
      }}
    >
      <NarrationHeader
        collection={collectionMeta?.name || hadith.collectionName}
        collectionArabic={collectionMeta?.arabicName}
        hadithNumber={hadithNum}
        reference={hadith.reference}
        compiler={collectionMeta?.compiler}
        links={[
          {
            label: 'Ask about this Hadith',
            href: `/?question=${encodeURIComponent(`Tell me about ${hadith.reference}`)}`,
            icon: <MessageCircle className="h-4 w-4" />,
          },
        ]}
      />

      {/* Main Hadith - Highlighted */}
      <div className="mb-8">
        <NarrationCard
          hadith={formattedHadith}
          variant="highlighted"
        />
      </div>

      {/* Authenticity Information */}
      {authenticityInfo.level !== 'unknown' && (
        <div className="mb-8 rounded-lg border border-sky-200 bg-sky-50/50 p-4 dark:border-sky-800/50 dark:bg-sky-950/20">
          <h3 className="font-semibold mb-2">Authenticity</h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{authenticityInfo.label}:</span> {authenticityInfo.description}
          </p>
        </div>
      )}

      {/* Navigation */}
      <PageNavigation
        previous={
          adjacent.previous
            ? {
                href: `/hadith/${collection}/${adjacent.previous}`,
                label: `Hadith #${adjacent.previous}`,
                sublabel: 'Previous',
              }
            : undefined
        }
        next={
          adjacent.next
            ? {
                href: `/hadith/${collection}/${adjacent.next}`,
                label: `Hadith #${adjacent.next}`,
                sublabel: 'Next',
              }
            : undefined
        }
      />
    </HadithPageLayout>
  );
}
