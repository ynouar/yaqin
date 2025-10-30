/**
 * Hadith Collection Metadata
 * Contains information about the 4 major hadith collections
 */

export interface CollectionMetadata {
  slug: string;
  name: string;
  arabicName: string;
  compiler: string;
  description: string;
  totalHadiths: number;
  authenticityLevel: 'highest' | 'high';
  about: string;
}

export const COLLECTION_METADATA: CollectionMetadata[] = [
  {
    slug: 'bukhari',
    name: 'Sahih Bukhari',
    arabicName: 'صحيح البخاري',
    compiler: 'Imam Muhammad al-Bukhari',
    description: 'The most authentic collection of Hadith, compiled by Imam Bukhari',
    totalHadiths: 7558,
    authenticityLevel: 'highest',
    about: `Sahih al-Bukhari is considered the most authentic collection of Hadith after the Quran. 
    Compiled by Imam Muhammad al-Bukhari (810-870 CE), it contains 7,558 narrations selected from 
    over 600,000 hadiths. Imam Bukhari spent 16 years traveling and collecting these authentic 
    narrations, applying the strictest criteria for authenticity. Every hadith in this collection 
    is considered Sahih (authentic) and is accepted by all Islamic scholars.`,
  },
  {
    slug: 'muslim',
    name: 'Sahih Muslim',
    arabicName: 'صحيح مسلم',
    compiler: 'Imam Muslim ibn al-Hajjaj',
    description: 'The second most authentic collection of Hadith after Sahih Bukhari',
    totalHadiths: 2920,
    authenticityLevel: 'highest',
    about: `Sahih Muslim is the second most authentic hadith collection after Sahih Bukhari. 
    Compiled by Imam Muslim ibn al-Hajjaj (821-875 CE), it contains 2,920 narrations without 
    repetitions. Imam Muslim was a student of Imam Bukhari and applied similarly strict criteria 
    for authentication. Together, Sahih Bukhari and Sahih Muslim are known as "Sahihayn" 
    (the two authentic collections) and are considered the gold standard of hadith literature.`,
  },
  {
    slug: 'nawawi40',
    name: '40 Hadith Nawawi',
    arabicName: 'الأربعون النووية',
    compiler: 'Imam Yahya ibn Sharaf al-Nawawi',
    description: 'Forty essential hadiths covering the fundamentals of Islam',
    totalHadiths: 42,
    authenticityLevel: 'highest',
    about: `An-Nawawi's Forty Hadith is a concise collection of 42 authentic hadiths compiled by 
    Imam Yahya al-Nawawi (1233-1277 CE). Each hadith represents a fundamental principle of Islam. 
    This collection is widely studied and memorized by Muslims worldwide as it covers the core 
    teachings of Islamic faith, practice, and ethics. Despite being a small collection, it provides 
    a comprehensive overview of Islamic principles.`,
  },
  {
    slug: 'riyadussalihin',
    name: 'Riyad as-Salihin',
    arabicName: 'رياض الصالحين',
    compiler: 'Imam Yahya ibn Sharaf al-Nawawi',
    description: 'The Gardens of the Righteous - a collection of hadiths on Islamic ethics and conduct',
    totalHadiths: 1896,
    authenticityLevel: 'high',
    about: `Riyad as-Salihin (The Gardens of the Righteous) is a compilation of hadith by Imam 
    al-Nawawi focusing on Islamic manners, conduct, and spirituality. It contains 1,896 narrations 
    organized by topics such as sincerity, repentance, patience, gratitude, and social conduct. 
    This collection is beloved for its practical guidance on daily life and spiritual development, 
    making it one of the most widely read hadith books for personal development.`,
  },
];

export function getCollectionMetadata(slug: string): CollectionMetadata | undefined {
  return COLLECTION_METADATA.find((c) => c.slug === slug);
}

export function isValidCollection(slug: string): boolean {
  return COLLECTION_METADATA.some((c) => c.slug === slug);
}

/**
 * Get authenticity level display name
 */
export function getAuthenticityDisplay(grade: string): {
  label: string;
  level: 'highest' | 'high' | 'acceptable' | 'weak' | 'unknown';
  description: string;
} {
  const normalizedGrade = grade?.toLowerCase() || '';

  if (normalizedGrade.includes('sahih')) {
    return {
      label: 'Sahih',
      level: 'highest',
      description: 'Authentic - Highest level of authenticity',
    };
  }

  if (normalizedGrade.includes('hasan')) {
    return {
      label: 'Hasan',
      level: 'high',
      description: 'Good - High level of authenticity',
    };
  }

  if (normalizedGrade.includes("da'if") || normalizedGrade.includes('daif')) {
    return {
      label: "Da'if",
      level: 'weak',
      description: 'Weak - Lower level of authenticity',
    };
  }

  return {
    label: 'Unknown',
    level: 'unknown',
    description: 'Authenticity grade not specified',
  };
}
