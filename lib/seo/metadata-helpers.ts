import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://criterion.life';

interface SocialImageOptions {
  title: string;
  description: string;
  type?: 'website' | 'article';
  url?: string;
}

/**
 * Generate OpenGraph and Twitter metadata with consistent social media images
 */
export function generateSocialMetadata({
  title,
  description,
  type = 'website',
  url,
}: SocialImageOptions): Pick<Metadata, 'openGraph' | 'twitter'> {
  const ogImage = {
    url: `${siteUrl}/opengraph-image.png`,
    width: 1200,
    height: 630,
    alt: title,
  };

  const twitterImage = `${siteUrl}/twitter-image.png`;

  return {
    openGraph: {
      title,
      description,
      type,
      ...(url && { url }),
      siteName: 'Criterion',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [twitterImage],
      site: '@criterion',
    },
  };
}

/**
 * Get the site URL for use in metadata
 */
export function getSiteUrl(): string {
  return siteUrl;
}
