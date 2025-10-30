import { HadithPageHeader } from './hadith-page-header';
import { HadithBreadcrumbs } from './hadith-breadcrumbs';
import { ChatCTA } from '@/components/quran/shared/chat-cta';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HadithPageLayoutProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  jsonLd?: object;
  cta?: {
    title: string;
    description: string;
  } | false;
}

export function HadithPageLayout({
  children,
  breadcrumbs,
  jsonLd,
  cta,
}: HadithPageLayoutProps) {
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="min-h-screen bg-background">
        <HadithPageHeader />

        <div className="mx-auto max-w-4xl px-4 py-8">
          <HadithBreadcrumbs items={breadcrumbs} />

          {children}

          {cta !== false && (
            <div className="mt-12">
              <ChatCTA
                title={cta?.title}
                description={cta?.description}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
