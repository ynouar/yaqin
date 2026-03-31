'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { YaqinBranding } from '@/components/criterion-branding';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  isSticky?: boolean;
}

export function SiteHeader({ isSticky = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations('nav');

  const primaryLinks = [
    { href: '/', label: t('chat') },
    { href: '/quran', label: t('quran') },
    { href: '/hadith', label: t('hadith') },
    { href: '/topics', label: t('topics') },
  ];

  const searchLinks = [
    { href: '/quran/search', label: t('quranSearch') },
    { href: '/hadith/search', label: t('hadithSearch') },
  ];

  const secondaryLinks = [
    { href: '/about', label: t('about') },
    { href: '/faq', label: t('faq') },
    { href: '/privacy', label: t('privacy') },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isSearchActive = searchLinks.some((link) => pathname.startsWith(link.href));

  return (
    <header
      className={cn(
        'w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        isSticky && 'sticky top-0 z-50'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <YaqinBranding />
          </div>

          {/* SEO: Hidden crawlable links for search pages */}
          <div className="sr-only">
            <Link href="/quran/search">{t('quranSearch')}</Link>
            <Link href="/hadith/search">{t('hadithSearch')}</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label={t('navigation')}>
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(link.href)
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Search Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors gap-1',
                    isSearchActive
                      ? 'text-foreground bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  aria-label={t('openSearchMenu')}
                >
                  {t('search')}
                  <ChevronDown className="h-3 w-3" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {searchLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className="cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mx-2 h-4 w-px bg-border" />
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(link.href)
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mx-1 h-4 w-px bg-border" />
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcher />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('openNavMenu')}>
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>{t('navigation')}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8" aria-label={t('mobileNavigation')}>
                  <div className="flex flex-col gap-2">
                    {primaryLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive(link.href)
                            ? 'text-foreground bg-muted'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex flex-col gap-2">
                    {searchLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive(link.href)
                            ? 'text-foreground bg-muted'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex flex-col gap-2">
                    {secondaryLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive(link.href)
                            ? 'text-foreground bg-muted'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
