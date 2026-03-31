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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yaqin.app";
const description = "Le premier assistant islamique francophone augmenté par IA. Posez vos questions sur l'Islam, le Coran et les Hadiths. Obtenez des réponses authentiques depuis les sources islamiques. Recherchez parmi 6 236 versets coraniques et 21 641 hadiths authentiques.";
const title = "Yaqin — Assistant Islamique IA";
const name = "Yaqin";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Yaqin",
  },
  description,
  keywords: [
    "Coran",
    "Hadith",
    "Islam",
    "assistant islamique",
    "IA islamique",
    "Coran IA",
    "recherche Coran",
    "hadiths authentiques",
    "questions islamiques",
    "apprendre l'Islam",
    "guide islamique",
    "Quran AI",
    "Islamic AI assistant",
    "Hadith search",
    "Islamic knowledge"
  ],
  authors: [{ name }],
  creator: name,
  publisher: name,
  applicationName: name,
  category: "Religion & Spirituality",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    title,
    description,
    siteName: "Yaqin",
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
    creator: "@yaqin_app",
    site: "@yaqin_app",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'fr': siteUrl,
      'en': siteUrl,
      'ar': siteUrl,
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
  maximumScale: 1,
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

const LOCALE_SCRIPT = `(function(){var m=document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);var l=m?decodeURIComponent(m[1]):'fr';document.documentElement.lang=l;document.documentElement.dir=['ar','ur'].indexOf(l)!==-1?'rtl':'ltr';})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geist.variable} ${geistMono.variable} ${notoNaskhArabic.variable}`}
      lang="fr"
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
