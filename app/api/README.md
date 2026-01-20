# Criterion API Documentation

Access authentic Islamic knowledge through Criterion's API. Search 6,236 Quran verses and 21,641 authentic hadiths from 6 major collections with AI-powered semantic search.

## Integration Options

### 1. HTTP API (REST)

Direct HTTP requests to our public API endpoints. Great for web apps and traditional integrations.

### 2. Model Context Protocol (MCP)

Connect AI Agents or assistants like Claude Desktop and Cursor directly to Criterion's search. See [MCP.md](../../MCP.md) for details.

**MCP Server URL:** `https://criterion.life/api/mcp`

---

## Base URL

```
https://criterion.life/api/v1
```

## Quick Start

### JavaScript/TypeScript

```javascript
// Search Quran
const response = await fetch(
  "https://criterion.life/api/v1/quran/search?q=patience&limit=5"
);
const data = await response.json();

// Search Hadith
const response = await fetch(
  "https://criterion.life/api/v1/hadith/search?q=charity&collections=bukhari,muslim"
);
const data = await response.json();
```

### cURL

```bash
# Search Quran
curl "https://criterion.life/api/v1/quran/search?q=patience&limit=5"

# Search Hadith
curl "https://criterion.life/api/v1/hadith/search?q=charity&collections=bukhari,muslim"
```

### Python

```python
import requests

# Search Quran
response = requests.get(
    'https://criterion.life/api/v1/quran/search',
    params={'q': 'patience', 'limit': 5}
)
data = response.json()

# Search Hadith
response = requests.get(
    'https://criterion.life/api/v1/hadith/search',
    params={
        'q': 'charity',
        'collections': 'bukhari,muslim',
        'grade': 'sahih-only'
    }
)
data = response.json()
```

## API Endpoints

### 1. Quran Search

**`GET /api/v1/quran/search`**

Semantic search across 6,236 Quran verses using AI embeddings. Top results include ±2 surrounding verses for context.

#### Parameters

| Parameter | Type   | Required | Description                          |
| --------- | ------ | -------- | ------------------------------------ |
| `q`       | string | Yes      | Search query (1-500 chars)           |
| `limit`   | number | No       | Number of results (1-20, default: 7) |

#### Example Request

```bash
curl "https://criterion.life/api/v1/quran/search?q=patience&limit=5"
```

#### Example Response

```json
{
  "results": [
    {
      "verseId": "032c3b98-e9a7-40ad-801e-4c581154d65c",
      "surahNumber": 70,
      "ayahNumber": 5,
      "surahNameEnglish": "Al-Ma'arij",
      "surahNameArabic": "المعارج",
      "textArabic": "فَاصْبِرْ صَبْرًا جَمِيلًا",
      "textEnglish": "So be patient with gracious patience.",
      "similarity": 0.7667777003247903,
      "hasContext": true,
      "contextBefore": [
        {
          "surahNumber": 70,
          "ayahNumber": 3,
          "textArabic": "مِنَ اللَّهِ ذِي الْمَعَارِجِ",
          "textEnglish": "[It is] from Allah, owner of the ways of ascent."
        },
        {
          "surahNumber": 70,
          "ayahNumber": 4,
          "textArabic": "تَعْرُجُ الْمَلَائِكَةُ وَالرُّوحُ إِلَيْهِ فِي يَوْمٍ كَانَ مِقْدَارُهُ خَمْسِينَ أَلْفَ سَنَةٍ",
          "textEnglish": "The angels and the Spirit will ascend to Him during a Day the extent of which is fifty thousand years."
        }
      ],
      "contextAfter": [
        {
          "surahNumber": 70,
          "ayahNumber": 6,
          "textArabic": "إِنَّهُمْ يَرَوْنَهُ بَعِيدًا",
          "textEnglish": "Indeed, they see it [as] distant,"
        },
        {
          "surahNumber": 70,
          "ayahNumber": 7,
          "textArabic": "وَنَرَاهُ قَرِيبًا",
          "textEnglish": "But We see it [as] near."
        }
      ]
    }
  ],
  "query": "patience",
  "count": 5,
  "language": "en"
}
```

#### Response Fields

- `verseId`: Unique identifier for the verse
- `surahNumber`: Chapter number (1-114)
- `ayahNumber`: Verse number within the chapter
- `surahNameEnglish`: English name of the chapter
- `surahNameArabic`: Arabic name of the chapter
- `textArabic`: Arabic text of the verse
- `textEnglish`: English translation
- `similarity`: Relevance score (0-1)
- `hasContext`: Whether context verses are included
- `contextBefore`: Array of up to 2 preceding verses
- `contextAfter`: Array of up to 2 following verses

### 2. Hadith Search

**`GET /api/v1/hadith/search`**

Semantic similarity search across 21,641 authentic hadiths from 6 major collections.

#### Parameters

| Parameter     | Type   | Required | Description                                                           |
| ------------- | ------ | -------- | --------------------------------------------------------------------- |
| `q`           | string | Yes      | Search query (1-500 chars)                                            |
| `collections` | string | No       | Comma-separated: bukhari, muslim, tirmidhi, abudawud, nawawi40, riyadussalihin |
| `grade`       | string | No       | sahih-only (default), sahih-and-hasan, all                            |
| `limit`       | number | No       | Number of results (1-15, default: 5)                       |

#### Example Request

```bash
curl "https://criterion.life/api/v1/hadith/search?q=charity&collections=bukhari,muslim&grade=sahih-only&limit=5"
```

#### Example Response

```json
{
  "results": [
    {
      "reference": "Sahih al-Bukhari 2891",
      "collection": "Sahih Bukhari",
      "english": "The Prophet (ﷺ) said, \"Charity is obligatory everyday on every joint of a human being. If one helps a person in matters concerning his riding animal by helping him to ride it or by lifting his luggage on to it, all this will be regarded charity. A good word, and every step one takes to offer the compulsory Congregational prayer, is regarded as charity; and guiding somebody on the road is regarded as charity.\"",
      "arabic": "حَدَّثَنَا مُسَدَّدٌ، حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ، عَنْ شُعْبَةَ...",
      "grade": "Sahih",
      "narrator": "Narrated Abu Huraira:",
      "book": "Fighting for the Cause of Allah (Jihaad)",
      "chapter": "The superiority of him who carries the luggage of his companions during a journey",
      "sourceUrl": "https://sunnah.com/bukhari:2891",
      "similarity": 0.6108240601445545
    }
  ],
  "query": "charity",
  "count": 5,
  "filters": {
    "collections": ["Sahih Bukhari", "Sahih Muslim"],
    "gradeFilter": "sahih-only"
  }
}
```

#### Response Fields

- `reference`: Hadith reference number (e.g., "Sahih al-Bukhari 2891")
- `collection`: Collection name
- `english`: English translation of the hadith
- `arabic`: Arabic text of the hadith
- `grade`: Authenticity grade (Sahih, Hasan, etc.)
- `narrator`: Chain of narration
- `book`: Book/section within the collection
- `chapter`: Chapter within the book
- `sourceUrl`: Link to sunnah.com for verification
- `similarity`: Relevance score (0-1)

## Key Features

### 🔍 Semantic Search

Powered by Google Gemini text-embedding-004 (768 dimensions) for meaning-based results that understand intent, not just keywords.

### 📖 Context-Aware

Quran results automatically include ±2 surrounding verses to provide proper context for understanding.

### ✅ Authenticity First

Filter hadiths by authenticity grade (Sahih, Hasan) to ensure you're accessing authentic Islamic knowledge.

### ⚡ Fast Responses

~500ms average latency with PostgreSQL + pgvector HNSW indexes for efficient vector search.

## Rate Limits

**Current limits:** 10 requests per minute per IP

Rate limit headers are included in all responses. Need higher limits? Contact us for API keys.

## Technology Stack

- **Embeddings:** Google Gemini text-embedding-004 (768-dim)
- **Database:** PostgreSQL + pgvector with HNSW indexes
- **Vector Search:** Cosine similarity
- **Keyword Search:** PostgreSQL ts_rank
- **Merge Strategy:** Reciprocal Rank Fusion (k=60)
- **Validation:** Zod schemas

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

Error responses include a descriptive message:

```json
{
  "error": "Query parameter is required",
  "code": "INVALID_REQUEST"
}
```

## Examples

### Find verses about prayer

```bash
curl "https://criterion.life/api/v1/quran/search?q=establish%20prayer&limit=10"
```

### Search for hadiths about kindness

```bash
curl "https://criterion.life/api/v1/hadith/search?q=kindness%20to%20parents&collections=bukhari&limit=5"
```

### Get Sahih and Hasan hadiths about fasting

```bash
curl "https://criterion.life/api/v1/hadith/search?q=fasting&grade=sahih-and-hasan&limit=10"
```

## Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/BalajSaleem/criterion/issues)
- **View Source:** [Open source on GitHub](https://github.com/BalajSaleem/criterion)
- **Try Live:** [Quran Search](https://criterion.life/quran/search) | [Hadith Search](https://criterion.life/hadith/search)

## License

Open source under the MIT License. See [LICENSE](https://github.com/BalajSaleem/criterion/blob/main/LICENSE) for details.
