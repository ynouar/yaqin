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
}: OpenGraphMetadataOptions & {
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: createOpenGraphMetadata({ title, description, path }),
    twitter: createTwitterMetadata({ title, description }),
    metadataBase: new URL("https://criterion.life/"),
  };
}
