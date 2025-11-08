/**
 * SEO Metadata Helpers
 * Centralized Open Graph and Twitter Card metadata
 */

import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://criterion.life";

interface OpenGraphMetadataOptions {
  title: string;
  description: string;
  path?: string;
  imageUrl?: string;
}

/**
 * Generate Open Graph metadata with absolute URLs
 */
export function createOpenGraphMetadata({
  title,
  description,
  path = "",
  imageUrl = `${siteUrl}/opengraph-image.png`,
}: OpenGraphMetadataOptions): Metadata["openGraph"] {
  return {
    type: "website",
    url: `${siteUrl}${path}`,
    title,
    description,
    siteName: "Criterion",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
}

/**
 * Generate Twitter Card metadata with absolute URLs
 */
export function createTwitterMetadata({
  title,
  description,
  imageUrl = `${siteUrl}/twitter-image.png`,
}: Omit<OpenGraphMetadataOptions, "path">): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  };
}

/**
 * Generate complete metadata with Open Graph and Twitter cards
 */
export function createPageMetadata({
  title,
  description,
  path = "",
  keywords,
  imageUrl,
}: OpenGraphMetadataOptions & {
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: createOpenGraphMetadata({ title, description, path, imageUrl }),
    twitter: createTwitterMetadata({ title, description, imageUrl }),
  };
}
