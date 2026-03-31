import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { SURAH_METADATA } from '@/lib/quran-metadata';
import { createBreadcrumbSchema } from '@/lib/seo/schema';
import { SiteHeader } from '@/components/layout/site-header';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'Quran - Browse All 114 Surahs',
  description: 'Browse all 114 Surahs (chapters) of the Holy Quran. Read full Arabic text and English translations. Explore Meccan and Medinan revelations.',
  path: '/quran',
  keywords: [
    'Quran',
    'Holy Quran',
    'Quran chapters',
    'Surahs',
    'Islamic scripture',
    'Quran online',
    'Read Quran',
  ],
});

export default async function QuranPage() {
  const t = await getTranslations('quran');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yaqin.app';
  
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Quran', url: `${siteUrl}/quran` },
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
            <Link href="/" className="hover:text-foreground">{t('home')}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{t('breadcrumb')}</span>
          </nav>

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">{t('title')}</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t('description')}
            </p>
          </div>

          {/* Surah Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SURAH_METADATA.map((surah) => (
              <Link
                key={surah.number}
                href={`/quran/${surah.number}`}
                className="group rounded-lg border p-4 transition-all hover:border-primary hover:bg-muted/50"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-sm font-semibold">
                      {surah.number}
                    </div>
                    <div>
                      <h2 className="font-semibold group-hover:text-primary">
                        {surah.transliteration}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {surah.translation}
                      </p>
                    </div>
                  </div>
                  <div className="font-arabic text-xl">{surah.name}</div>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-2 py-1">{surah.type}</span>
                  <span className="rounded bg-muted px-2 py-1">{surah.verses} {t('verses')}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-lg border bg-muted/50 p-8 text-center">
            <h2 className="mb-2 text-2xl font-semibold">{t('searchTitle')}</h2>
            <p className="mb-4 text-muted-foreground">
              {t('searchDesc')}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('searchCta')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
