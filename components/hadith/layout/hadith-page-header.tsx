import Link from 'next/link';
import { ScrollTextIcon } from 'lucide-react';
import { CriterionBranding } from '@/components/criterion-branding';

export function HadithPageHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <div className="mr-6">
            <CriterionBranding />
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/hadith/search"
              className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <ScrollTextIcon className="h-4 w-4" />
              <span>Search Hadith</span>
            </Link>
            <Link
              href="/quran"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Quran
            </Link>
            <Link
              href="/topics"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Topics
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
