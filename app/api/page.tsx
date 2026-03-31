import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer API - Yaqin",
  description:
    "Access Quran and Hadith search through the API. Semantic search powered by AI, supporting 6,236 verses and 21,641 authentic hadiths from 6 major collections.",
  openGraph: {
    title: "Developer API - Yaqin",
    description:
      "Access Quran and Hadith search through the API. Semantic search powered by AI.",
  },
};

export default function APIPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Developer API</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Access authentic Islamic knowledge through our Yaqin's API. Use the APIs to find relevant verses and hadiths for any topic. Our semantic similarity search understands the meaning and intent of your queries, matching conceptually similar content even when exact words differ—search 6,236 Quran verses and 21,641 authentic hadiths from 6 major collections with AI-powered precision.
          </p>
          
          {/* Try Live Links */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href="/quran/search"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-5 py-2.5 font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              🔍 Try Quran Search Live
            </Link>
            <Link
              href="/hadith/search"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-5 py-2.5 font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              📚 Try Hadith Search Live
            </Link>
          </div>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <div className="bg-muted p-6 rounded-lg space-y-4">
            <div>
              <p className="mb-2 font-medium">JavaScript/TypeScript:</p>
              <pre className="bg-background p-4 rounded overflow-x-auto text-sm">
                <code>
                  {`// Search Quran
const response = await fetch(
  'https://yaqin.app/api/v1/quran/search?q=patience&limit=5'
);
const data = await response.json();

// Search Hadith  
const response = await fetch(
  'https://yaqin.app/api/v1/hadith/search?q=charity&collections=bukhari,muslim'
);
const data = await response.json();`}
                </code>
              </pre>
            </div>
            
            <div>
              <p className="mb-2 font-medium">cURL:</p>
              <pre className="bg-background p-4 rounded overflow-x-auto text-sm">
                <code>
                  {`# Search Quran
curl "https://yaqin.app/api/v1/quran/search?q=patience&limit=5"

# Search Hadith
curl "https://yaqin.app/api/v1/hadith/search?q=charity&collections=bukhari,muslim"`}
                </code>
              </pre>
            </div>

            <div>
              <p className="mb-2 font-medium">Python:</p>
              <pre className="bg-background p-4 rounded overflow-x-auto text-sm">
                <code>
                  {`import requests

# Search Quran
response = requests.get(
    'https://yaqin.app/api/v1/quran/search',
    params={'q': 'patience', 'limit': 5}
)
data = response.json()`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">API Endpoints</h2>

          {/* Quran Search */}
          <div className="border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                GET
              </span>
              <code className="text-lg font-mono">/api/v1/quran/search</code>
            </div>
            <p className="text-muted-foreground mb-4">
              Semantic search across 6,236 Quran verses using AI embeddings. Top
              results include ±2 surrounding verses for context.
            </p>

            <h4 className="font-semibold mb-2">Parameters</h4>
            <ul className="space-y-2 mb-4 text-sm">
              <li>
                <code className="bg-muted px-2 py-1 rounded">q</code> <span className="text-red-600">*required</span> - Search query (1-500 chars)
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">limit</code>{" "}
                <span className="text-muted-foreground">optional</span> - Number of results (1-20, default: 7)
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Example Response</h4>
            <pre className="bg-muted p-4 rounded overflow-x-auto text-xs">
              <code>
                {JSON.stringify(
                  {
                    results: [
                      {
                        verseId: "032c3b98-e9a7-40ad-801e-4c581154d65c",
                        surahNumber: 70,
                        ayahNumber: 5,
                        surahNameEnglish: "Al-Ma'arij",
                        surahNameArabic: "المعارج",
                        textArabic: "فَاصْبِرْ صَبْرًا جَمِيلًا",
                        textEnglish: "So be patient with gracious patience.",
                        similarity: 0.7667777003247903,
                        hasContext: true,
                        contextBefore: [
                          {
                            surahNumber: 70,
                            ayahNumber: 4,
                            textArabic: "...",
                            textEnglish: "The angels and the Spirit will ascend to Him..."
                          }
                        ],
                        contextAfter: [
                          {
                            surahNumber: 70,
                            ayahNumber: 6,
                            textArabic: "...",
                            textEnglish: "Indeed, they see it [as] distant,"
                          }
                        ]
                      }
                    ],
                    query: "patience",
                    count: 5,
                    language: "en"
                  },
                  null,
                  2
                )}
              </code>
            </pre>
          </div>

          {/* Hadith Search */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                GET
              </span>
              <code className="text-lg font-mono">/api/v1/hadith/search</code>
            </div>
            <p className="text-muted-foreground mb-4">
              Semantic Similarity search across 21,641 authentic hadiths from 6 major collections
            </p>

            <h4 className="font-semibold mb-2">Parameters</h4>
            <ul className="space-y-2 mb-4 text-sm">
              <li>
                <code className="bg-muted px-2 py-1 rounded">q</code> <span className="text-red-600">*required</span> - Search query (1-500 chars)
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">collections</code>{" "}
                <span className="text-muted-foreground">optional</span> - bukhari, muslim, tirmidhi, abudawud, nawawi40, riyadussalihin (comma-separated)
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">grade</code>{" "}
                <span className="text-muted-foreground">optional</span> - sahih-only (default), sahih-and-hasan, all
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">limit</code>{" "}
                <span className="text-muted-foreground">optional</span> - Number of results (1-15, default: 5)
              </li>
            </ul>

            <h4 className="font-semibold mb-2">Example Response</h4>
            <pre className="bg-muted p-4 rounded overflow-x-auto text-xs">
              <code>
                {JSON.stringify(
                  {
                    results: [
                      {
                        reference: "Sahih al-Bukhari 2891",
                        collection: "Sahih Bukhari",
                        english: "The Prophet (ﷺ) said, \"Charity is obligatory everyday on every joint of a human being. If one helps a person in matters concerning his riding animal by helping him to ride it or by lifting his luggage on to it, all this will be regarded charity. A good word, and every step one takes to offer the compulsory Congregational prayer, is regarded as charity; and guiding somebody on the road is regarded as charity.\"",
                        arabic: "...",
                        grade: "Sahih",
                        narrator: "Narrated Abu Huraira:",
                        book: "Fighting for the Cause of Allah (Jihaad)",
                        chapter: "The superiority of him who carries the luggage...",
                        sourceUrl: "https://sunnah.com/bukhari:2891",
                        similarity: 0.6108240601445545
                      }
                    ],
                    query: "charity",
                    count: 5,
                    filters: {
                      collections: ["Sahih Bukhari", "Sahih Muslim"],
                      gradeFilter: "sahih-only"
                    }
                  },
                  null,
                  2
                )}
              </code>
            </pre>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold mb-1">Semantic Search</h3>
              <p className="text-sm text-muted-foreground">Powered by high dimensional embeddings for meaning-based results</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-2xl mb-2">📖</div>
              <h3 className="font-semibold mb-1">Context-Aware</h3>
              <p className="text-sm text-muted-foreground">Quran results include ±2 surrounding verses</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold mb-1">Authenticity First</h3>
              <p className="text-sm text-muted-foreground">Filter by Sahih, Hasan grades</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Fast Responses</h3>
              <p className="text-sm text-muted-foreground">~500ms average latency</p>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
          <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-r-lg">
            <p className="mb-2 font-semibold">
              Current limits: 10 requests per minute per IP
            </p>
            <p className="text-sm text-muted-foreground">
              Rate limit headers included in responses. Need higher limits? Contact us for API keys.
            </p>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <div>
                <strong>Embeddings:</strong> Google Gemini text-embedding-004 (768-dim)
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <div>
                <strong>Database:</strong> PostgreSQL + pgvector with HNSW indexes
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <div>
                <strong>Vector Search:</strong> Cosine similarity
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <div>
                <strong>Keyword Search:</strong> PostgreSQL ts_rank
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <div>
                <strong>Merge Strategy:</strong> Reciprocal Rank Fusion (k=60)
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">▸</span>
              <div>
                <strong>Validation:</strong> Zod schemas
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Support</h2>
          <div className="border rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground">
              Questions or need help? We're here to assist:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="https://github.com/ynouar/yaqin/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <div className="font-semibold">GitHub Issues</div>
                  <div className="text-sm text-muted-foreground">Report bugs or request features</div>
                </div>
              </a>
              <a
                href="https://github.com/ynouar/yaqin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <span className="text-2xl">📚</span>
                <div>
                  <div className="font-semibold">View Source</div>
                  <div className="text-sm text-muted-foreground">Open source on GitHub</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="border-t pt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to build Islamic applications?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 px-6 py-3 font-semibold transition-colors hover:bg-muted"
            >
              Try the Chat Interface
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Open Source Code
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
