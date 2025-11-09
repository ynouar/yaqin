/**
 * SEO Metadata Helpers
 * Centralized Open Graph and Twitter Card metadata
 */

import type { Metadata } from "next";
import img from "@/app/opengraph-image.png";


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://criterion.life/";

interface OpenGraphMetadataOptions {
  title: string;
  description: string;
  path?: string;
}

/**
 * Generate Open Graph metadata with absolute URLs
 */
export function createOpenGraphMetadata({
  title,
  description,
  path = "",
}: OpenGraphMetadataOptions): Metadata["openGraph"] {
  return {
    type: "website",
    url: `${siteUrl}${path}`,
    title,
    description,
    siteName: "Criterion",
    images: [
      {
        url: img.src,
        width: img.width,
        height: img.height,
        alt: "Criterion - Quran Powered AI Assistant",
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
}: Omit<OpenGraphMetadataOptions, "path">): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: img.src,
        width: img.width,
        height: img.height,
        alt: "Criterion - Quran Powered AI Assistant",
      },
    ],
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
  noIndex = false,
  publishedTime,
  modifiedTime,
}: OpenGraphMetadataOptions & {
  keywords?: string[];
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const metadata: Metadata = {
    title,
    description,
    keywords,
    openGraph: createOpenGraphMetadata({ title, description, path }),
    twitter: createTwitterMetadata({ title, description }),
    metadataBase: new URL(siteUrl),
    category: 'Religion & Spirituality',
  };

  // Add article-specific Open Graph metadata if timestamps provided
  if (publishedTime || modifiedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
    };
  }

  // Add canonical URL if path is provided
  if (path) {
    metadata.alternates = {
      canonical: path,
    };
  }

  // Add robots configuration if noIndex is true
  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    };
  } else {
    // Add default robots configuration for better indexing
    metadata.robots = {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    };
  }

  return metadata;
}
