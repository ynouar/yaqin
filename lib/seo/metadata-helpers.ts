import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://criterion.life';

interface SocialMetadataOptions {
  title: string;
  description: string;
  type?: 'website' | 'article';
  url?: string;
}

/**
 * Generate OpenGraph and Twitter metadata.
 * Images are inherited from the root opengraph-image.png and twitter-image.png files.
 * 
 * Note: Next.js automatically detects opengraph-image.png and twitter-image.png files
 * in the app directory and adds them to the metadata. Child routes inherit these images
 * unless they have their own image files.
 */
export function generateSocialMetadata({
  title,
  description,
  type = 'website',
  url,
}: SocialMetadataOptions): Pick<Metadata, 'openGraph' | 'twitter'> {
  const imageUrl = `${siteUrl}/opengraph-image.png`;
  const twitterImageUrl = `${siteUrl}/twitter-image.png`;

  return {
    openGraph: {
      title,
      description,
      type,
      ...(url && { url }),
      siteName: 'Criterion',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@criterion',
      images: [twitterImageUrl],
    },
  };
}

/**
 * Get the site URL for use in metadata
 */
export function getSiteUrl(): string {
  return siteUrl;
}
