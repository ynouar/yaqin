# Data Directory

This directory contains the source data for Criterion's Islamic knowledge base, powering the dual-source RAG system with Quranic verses and Hadith narrations.

## 📊 Overview

**Total Dataset Size:**

- **Quran**: 6,236 verses (English + Slovak translations)
- **Hadith Collections**: 12,416 narrations across 4 major collections
- **Combined**: 18,652 Islamic text entries with embeddings

## 📖 Quran Data Files

### English Translation

- **`quran.txt`** - Clean English translation (Sahih International)

  - 6,236 verses in tab-separated format: `surah|verse|text`
  - Sourced from Tanzil.net
  - Master dataset for RAG ingestion

- **`quran-arabic.txt`** - Original Arabic text
  - Complete Quranic text in Arabic script
  - Parallel structure to English translation

### Slovak Translation

- **`quran-slovak.txt`** - Slovak translation by JUDr. Abdulwahab Al-Sbenaty

  - Third Edition (2015) from King Fahd Complex, Saudi Arabia
  - Tab-separated format matching English structure

- **`quran-slovak-metadata.json`** - Translation metadata
  - Translator information and edition details
  - All 114 Surah names with transliterations and Slovak translations
  - Used for multilingual UI rendering

## 📚 Hadith Data Files

### Text Files (Legacy Format)

Simple line-by-line hadith text for quick reference:

- **`bukhari.txt`** - Sahih Bukhari narrations
- **`muslim.txt`** - Sahih Muslim narrations
- **`nawawi40.txt`** - 40 Hadith Nawawi collection
- **`riyadussalihin.txt`** - Riyad as-Salihin collection
- **`en.sahih.txt`** - Combined Sahih collection

### JSON Files (Production Format)

Structured hadith data with full metadata for RAG ingestion:

#### **`bukhari-full.json`** - Sahih Bukhari

- **7,558 hadiths** (most comprehensive collection)
- Exported: October 12, 2025
- Fields: Arabic text, English text, narrator chain, book/chapter info, grading, source URL
- Example structure:
  ```json
  {
    "collection": "bukhari",
    "hadith_number": 1,
    "reference": "Sahih al-Bukhari 1",
    "english_text": "...",
    "arabic_text": "...",
    "book_name": "Revelation",
    "chapter_name": "How the Divine Revelation started...",
    "grade": "Sahih",
    "narrator_chain": "Narrated 'Umar bin Al-Khattab:",
    "source_url": "https://sunnah.com/bukhari:1"
  }
  ```

#### **`muslim-full.json`** - Sahih Muslim

- **2,920 hadiths** (second most authentic collection)
- Exported: October 12, 2025
- Similar structure to Bukhari with slight field variations

#### **`nawawi40-full.json`** - 40 Hadith Nawawi

- **42 hadiths** (foundational teachings)
- Curated by Imam Nawawi
- Covers pillars of Islam, Iman, and Ihsan

#### **`riyadussalihin-full.json`** - Riyad as-Salihin

- **1,896 hadiths** (practical guidance)
- "Gardens of the Righteous"
- Organized by moral and spiritual topics

## 🔄 Data Ingestion

Use these scripts to populate the database:

```bash
# Ingest English Quran (required first)
pnpm ingest:quran

# Ingest Slovak translation (optional)
pnpm ingest:quran:slovak

# Ingest all Hadith collections
pnpm ingest:hadith
```

**Ingestion Process:**

1. Parses text/JSON files
2. Generates 768-dimensional embeddings via Google Gemini `text-embedding-004`
3. Stores in PostgreSQL with pgvector HNSW indexes
4. Enables semantic search for RAG retrieval

## 📝 Data Format Conventions

### Quran Text Files

```
surah_number|verse_number|verse_text
1|1|In the name of Allah, the Entirely Merciful, the Especially Merciful.
```

### Hadith JSON Schema

```typescript
{
  collection: string,           // "bukhari" | "muslim" | "nawawi40" | "riyadussalihin"
  hadith_number: number,         // Global hadith ID
  reference: string,             // Human-readable citation
  english_text: string,          // Full hadith text in English
  arabic_text: string,           // Original Arabic text
  book_name: string,             // Book/chapter classification
  chapter_name: string,          // Specific chapter title
  grade: string,                 // "Sahih" (authentic)
  narrator_chain: string,        // Isnad (chain of transmission)
  source_url: string            // Sunnah.com reference link
}
```

## 🎯 Usage in Application

### RAG Context Retrieval

- **Quran**: `lib/ai/embeddings.ts` → `findRelevantVerses()`
  - Returns top 7 verses, top 3 with ±2 context window
- **Hadith**: `lib/ai/embeddings.ts` → `findRelevantHadiths()`
  - Returns top 5 narrations for Prophet's teachings

### Public Browsing

- **Quran Pages**: `/quran/[surah]/[verse]` with optional `?context=true` for ±5 verses
- **Hadith Pages**: `/hadith/[collection]/[number]` with citation links
- **Search**: `/search?q=...` for full-text search across both sources

### Multilingual Support

- English: Primary language (stored in `quranVerse` table)
- Slovak: Secondary translation (stored in `quranTranslation` table)
- Fast path: English-only queries avoid JOIN operations

## 📊 Data Quality

### Authenticity

- **Quran**: Verified against Tanzil.net (trusted Islamic text provider)
- **Hadith**: All narrations graded "Sahih" (authentic) from Sunnah.com
- **Citations**: Every response includes verifiable source URLs

### Completeness

- ✅ All 6,236 Quranic verses covered
- ✅ Major Sahih collections (Bukhari, Muslim) fully included
- ✅ Supplementary collections (Nawawi40, Riyad) for practical guidance

### Embedding Quality

- Model: Google Gemini `text-embedding-004` (768 dimensions)
- Task type: `RETRIEVAL_QUERY` for semantic search optimization
- Indexes: HNSW (Hierarchical Navigable Small World) for fast vector similarity

## 🚨 Important Notes

1. **Never modify source files directly** - regenerate from original sources
2. **Coordinate embeddings** - changing text requires re-embedding (expensive!)
3. **Character encoding** - All files use UTF-8 for proper Arabic rendering
4. **Line endings** - Use Unix-style LF, not CRLF
5. **Version control** - JSON files are large but tracked for reproducibility

## 📚 Data Sources

- **Quran**: [Tanzil.net](https://tanzil.net) - Sahih International translation
- **Slovak Quran**: King Fahd Complex for Printing the Quran
- **Hadith**: [Sunnah.com](https://sunnah.com) - Verified authentic narrations
- **Export Date**: October 12, 2025

## 🔍 Testing

Validate data integrity after ingestion:

```bash
# Test Quran RAG retrieval
pnpm test:quran

# Test multilingual queries
pnpm test:multilingual

# Verify database content
pnpm db:studio
```

---

**Last Updated**: December 19, 2025  
**Total Storage**: ~350MB (including embeddings in database)  
**Maintenance**: Data sources are immutable - no planned updates unless new translations added
