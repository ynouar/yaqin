/**
 * SEO Utilities and Structured Data Schemas
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://criterion.life';

/**
 * Organization Schema (JSON-LD)
 * Helps search engines understand who we are
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Criterion',
  description: 'Open-source Quran-powered AI assistant for learning about Islam',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    'https://github.com/BalajSaleem/criterion'
  ],
};

/**
 * WebSite Schema with Search Action (JSON-LD)
 * Enables site search box in Google results
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Criterion',
  url: siteUrl,
  description: 'Ask questions about Islam, the Quran, and Hadith. Get authentic answers from Islamic sources.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

/**
 * FAQ Page Schema (JSON-LD)
 * For structured FAQ data in search results
 */
export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList Schema (JSON-LD)
 * For breadcrumb navigation in search results
 */
export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article Schema (JSON-LD)
 * For content pages like Surah details
 */
export function createArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished?: Date;
  dateModified?: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished?.toISOString(),
    dateModified: article.dateModified?.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Criterion',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Criterion',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  };
}

/**
 * Hadith Article Schema (JSON-LD)
 * For individual hadith pages with religious text specifics
 */
export function createHadithArticleSchema(hadith: {
  reference: string;
  title: string;
  description: string;
  url: string;
  collection: string;
  compiler?: string;
  grade?: string;
  arabicText?: string;
  englishText: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: hadith.title,
    description: hadith.description,
    url: hadith.url,
    articleBody: hadith.englishText,
    inLanguage: ['en', 'ar'],
    about: {
      '@type': 'Thing',
      name: 'Islamic Hadith',
      description: `Narration from ${hadith.collection}`,
    },
    author: {
      '@type': 'Organization',
      name: 'Criterion',
      description: 'Islamic knowledge platform',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Criterion',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    isPartOf: {
      '@type': 'Book',
      name: hadith.collection,
      author: hadith.compiler ? {
        '@type': 'Person',
        name: hadith.compiler,
      } : undefined,
    },
    datePublished: new Date('2024-01-01').toISOString(), // Collection compilation date proxy
    dateModified: new Date().toISOString(),
  };
}
