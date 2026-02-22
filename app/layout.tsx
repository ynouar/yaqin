import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Naskh_Arabic } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google'
import { IntlProvider } from "@/components/intl-provider";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { organizationSchema, websiteSchema, softwareApplicationSchema } from "@/lib/seo/schema";
import socialImage from "./opengraph-image.png";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://criterion.life";
const description = "Intelligent AI assistant for exploring Islam. Ask questions about Islam, the Quran, and Hadith. Get authentic answers from Islamic sources with an AI-powered guide. Search and find answers from Quranic verses and authentic Hadiths.";
const title = "Criterion - Quran Powered AI Assistant";
const name = "Criterion";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Criterion",
  },
  description,
  keywords: [
    "Quran search",
    "Read Quran",
    "Find Verse",
    "Islamic questions",
    "learn about Islam",
    "Quran AI",
    "Islamic teachings",
    "understanding Islam",
    "authentic Hadith",
    "Islamic guidance",
    "Hadith search",
    "Islamic AI assistant",
    "learn Quran online",
    "Quran verses",
    "Islamic knowledge"
  ],
  authors: [{ name }],
  creator: name,
  publisher: name,
  applicationName: name,
  category: "Religion & Spirituality",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title,
    description,
    siteName: "Criterion",
    images: [
      {
        url: socialImage.src,
        width: socialImage.width,
        height: socialImage.height,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{
        url: socialImage.src,
        width: socialImage.width,
        height: socialImage.height,
        alt: title,
      }],
    creator: "@criterion_life",
    site: "@criterion_life",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': siteUrl,
      'ar': siteUrl,
      'ur': siteUrl,
      'tr': siteUrl,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-arabic",
});

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

// Sets lang and dir on <html> from the NEXT_LOCALE cookie before React hydrates,
// preventing RTL layout shift. Same pattern next-themes uses for dark mode.
const LOCALE_SCRIPT = `(function(){var m=document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);var l=m?decodeURIComponent(m[1]):'en';document.documentElement.lang=l;document.documentElement.dir=['ar','ur'].indexOf(l)!==-1?'rtl':'ltr';})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geist.variable} ${geistMono.variable} ${notoNaskhArabic.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sets lang/dir before hydration to prevent RTL layout shift (same pattern as next-themes)
          dangerouslySetInnerHTML={{ __html: LOCALE_SCRIPT }}
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sets theme-color meta tag before hydration
          dangerouslySetInnerHTML={{ __html: THEME_COLOR_SCRIPT }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required for SEO structured data"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required for SEO structured data"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required for SEO structured data"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />
      </head>
      <body className="antialiased">
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <Toaster position="top-center" />
            {/*
              IntlProvider is async (reads locale from cookie via middleware header).
              Wrapping in Suspense is the correct cacheComponents pattern: the outer
              layout is a cacheable static shell; dynamic data streams in via Suspense.
            */}
            <Suspense>
              <IntlProvider>
                <SessionProvider>{children}</SessionProvider>
              </IntlProvider>
            </Suspense>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-1DWTBY3VBS" />
    </html>
  );
}
