# GitHub Copilot Instructions for Criterion

## Project Overview
Criterion is an AI-powered Islamic Da'i (guide) chatbot built with Next.js 15, featuring dual-source RAG (Retrieval Augmented Generation) over the Quran (6,236 verses) and Hadith (12,416 narrations). The system uses tool-based AI with XAI Grok 4 LLM for autonomous retrieval and real-time streaming responses.

## Architecture & Data Flow
**Core Pattern**: User query → LLM tool selection → Vector search → Context enhancement → Response with citations

- **Frontend**: Next.js 15 App Router, React 19, Tailwind CSS, real-time SSE streaming
- **AI Stack**: XAI Grok 4 (chat + reasoning), Google Gemini text-embedding-004 (768 dims), Vercel AI SDK
- **Database**: PostgreSQL + pgvector (HNSW indexes), Drizzle ORM
- **Key Components**: Tool-based RAG, semantic search, multilingual reading (English + Slovak), shareable URLs

## Important: How to code effectively
* KISS: Keep It Simple, Stupid - avoid over-engineering
* DRY: Don't Repeat Yourself - reuse existing functions and components
* Follow established patterns for RAG, tool usage, and context
* Principle of Least Astonishment: Code should behave as expected
* Avoid verbosity: concise and clear code is better
* Use context7 when looking for documentation on libraries and frameworks
* Do not reinvent the wheel - leverage existing solutions and libraries

DO NOT: create summaries after every task unless specifically asked for.

## Essential Workflows

### Data Ingestion (Critical for new setups)
```bash
# Quran data (6,236 verses + embeddings) - ~10 minutes
pnpm ingest:quran

# Hadith data (12,416 narrations) - ~20 minutes
pnpm ingest:hadith

# Slovak translation
pnpm ingest:quran:slovak
```

### Testing & Validation
```bash
# Test Quran RAG functionality
pnpm test:quran

# Test multilingual queries
pnpm test:multilingual
```

### Database Operations
```bash
# Run migrations (required after schema changes)
pnpm db:migrate

# Open database GUI
pnpm db:studio

# Enable pgvector extension (one-time setup)
pnpm db:enable-pgvector
```

## Key Patterns & Conventions

### 1. Tool-Based RAG Pattern
**Always use tools for Islamic questions** - never rely on LLM training data alone. The system prompt enforces:
- `queryQuran` for divine guidance, verses, Allah's words
- `queryHadith` for Prophet's teachings, practical examples
- Max 2 tool calls per interaction (efficiency critical)

**Example Implementation**:
```typescript
// lib/ai/tools/query-quran.ts
export const queryQuran = tool({
  description: "Search the Holy Quran for verses...",
  execute: async ({ question }) => {
    const verses = await findRelevantVerses(question);
    // Returns top 7 verses, top 3 with ±2 context
  },
});
```

### 2. Context Enhancement
**Top 3 results get ±2 surrounding verses** for proper Islamic context. Never crosses Surah boundaries.

```typescript
// lib/ai/embeddings.ts
const context_window = 2; // ±2 verses for RAG
// Verse pages use ±5 when ?context=true
```

### 3. Da'i Personality & Content Guidelines
**Never fabricate verses or hadiths**. Always cite sources. Focus on fundamentals, avoid sectarian debates.

```typescript
// lib/ai/prompts.ts
const daIPrompt = `You are a knowledgeable Islamic scholar...
ALWAYS use tools for Islamic questions - never rely on training data
Cite Quran: [Al-Baqarah 2:153](https://quran.com/2/153)
Cite Hadith: [Sahih Bukhari 1](https://sunnah.com/bukhari:1)`;
```

### 4. Performance Monitoring
**Use PerformanceTimer for all operations** - built-in timing and color-coded logging.

```typescript
import { PerformanceTimer, timeAsync } from "@/lib/monitoring/performance";

const timer = new PerformanceTimer("operation-name");
const result = await timeAsync("sub-operation", () => doWork());
timer.log({ metadata: "value" }); // 🟢 <500ms, 🟡 <1s, 🔴 >1s
```

### 5. Multilingual Support
**English is master language** (stored in QuranVerse table, fast queries). Translations in QuranTranslation table.

```typescript
// Fast path: English only
const verses = await db.select().from(quranVerse)...

// With translation: Single JOIN
const verses = await db.select()
  .from(quranVerse)
  .leftJoin(quranTranslation, eq(quranVerse.id, quranTranslation.verseId))
  .where(eq(quranTranslation.language, lang));
```

### 6. Database Schema Patterns
**Use Drizzle ORM with full type safety**. Key tables:
- `quranVerse` (6,236) + `quranEmbedding` (vectors)
- `hadithText` (12,416) + `hadithEmbedding` (vectors)
- HNSW indexes for fast vector search

### 7. Route Organization
**Route groups for auth boundaries**:
- `(chat)/` - Authenticated chat interface
- `(auth)/` - Login/register pages
- Public routes outside groups (quran/, hadith/, search/)

## Integration Points

### AI APIs
- **XAI Grok 4**: `grok-4-fast-non-reasoning` (chat), `grok-4-fast-reasoning` (thinking)
- **Google Gemini**: `text-embedding-004` with `RETRIEVAL_QUERY` task type
- **Vercel AI SDK**: Streaming, tool calling, multi-step reasoning

### External Services
- **PostgreSQL + pgvector**: Vector storage and search
- **Vercel**: Hosting, AI Gateway, analytics
- **Data Sources**: Tanzil.net (Quran), Sunnah.com (Hadith)

## Common Pitfalls

### 2. Tool Efficiency
**Limit tool calls**: System prompt restricts to max 2 tools per interaction. Too many calls = high latency.

### 3. Content Accuracy
**Never fabricate**: Always use tools for Islamic content. Citations required for all responses.

### 4. Performance
**Vector search is expensive**: Cache results, use appropriate limits (7 for RAG, 20 for search UI).

## Development Commands
```bash
pnpm dev --turbo     # Development server
pnpm build           # Production build (runs migrations)
pnpm lint            # Code linting
pnpm format          # Code formatting
pnpm test            # E2E tests (Playwright)
```

## File Structure Highlights
```
lib/ai/
├── embeddings.ts    # Core RAG logic (vector search)
├── tools/           # LLM tools (queryQuran, queryHadith)
└── prompts.ts       # Da'i system prompts

lib/db/
├── schema.ts        # Database schema (6 tables)
├── queries.ts       # Database operations
└── migrations/      # SQL migrations

app/(chat)/
├── page.tsx         # Home page (handles bot access)
├── chat/[id]/       # Individual chat pages
└── api/chat/        # Main chat endpoint

scripts/
├── ingest-*.ts      # Data ingestion scripts
└── test-*.ts        # Validation scripts
```

## Quality Standards
- **Type Safety**: Full TypeScript coverage
- **Performance**: <150ms for queries, color-coded monitoring
- **Accuracy**: Verified Islamic sources only
- **SEO**: Rich metadata, shareable URLs, bot-friendly
- **Testing**: Comprehensive test scripts for RAG validation</content>
<parameter name="filePath">/home/balaj/work/criterion/criterion/.github/copilot-instructions.md
