import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { COLLECTION_METADATA } from '@/lib/hadith-metadata';
import { createBreadcrumbSchema } from '@/lib/seo/schema';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'Hadith - Browse All 6 Major Collections',
  description: 'Browse 21,641 authentic hadiths from 6 major collections: Sahih Bukhari, Sahih Muslim, Jami` at-Tirmidhi, Sunan Abi Dawud, 40 Hadith Nawawi, and Riyad as-Salihin. Read narrations from the Prophet Muhammad ﷺ.',
  path: '/hadith',
  keywords: [
    'Hadith',
    'Sahih Bukhari',
    'Sahih Muslim',
    'Hadith Nawawi',
    'Riyad as-Salihin',
    'authentic hadith',
    'Islamic narrations',
    'Sunnah',
    'Prophet Muhammad sayings',
  ],
});

export default function HadithPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://criterion.life';
  
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Hadith', url: `${siteUrl}/hadith` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="min-h-screen bg-background">
        <SiteHeader />

        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Hadith</span>
          </nav>

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">Authentic Hadith Collections</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Browse 21,641 authentic hadiths from 6 major collections. Each hadith includes the full 
              Arabic text, English translation, and authenticity grading. Click any collection to explore.
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {COLLECTION_METADATA.map((collection) => (
              <Link
                key={collection.slug}
                href={`/hadith/${collection.slug}/1`}
                className="group rounded-lg border p-4 transition-all hover:border-primary hover:bg-muted/50"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="font-semibold group-hover:text-primary">
                        {collection.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {collection.compiler}
                      </p>
                    </div>
                  </div>
                  <div className="font-arabic text-xl">{collection.arabicName}</div>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-2 py-1">
                    {collection.authenticityLevel === 'highest' ? 'Highest Authenticity' : 'High Authenticity'}
                  </span>
                  <span className="rounded bg-muted px-2 py-1">
                    {collection.totalHadiths.toLocaleString()} hadiths
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-lg border bg-muted/50 p-8 text-center">
            <h2 className="mb-2 text-2xl font-semibold">Search Hadith by Topic</h2>
            <p className="mb-4 text-muted-foreground">
              Use our semantic search to find hadiths about any topic
            </p>
            <Link
              href="/hadith/search"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Search Hadith
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
