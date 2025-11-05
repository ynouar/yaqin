import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://criterion.life';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: [
          '/chat/',
          '/api/'
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
