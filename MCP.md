# Criterion MCP Server

Connect Criterion's semantic Islamic search to AI assistants like Claude Desktop, Cursor, and other MCP-compatible clients.

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to external data sources and tools. Think of it as a "USB-C port for AI" - it provides a standardized way for AI agents to discover and use your tools.

## Features

Criterion exposes **3 powerful tools** through MCP:

### 1. `search_quran`

Search across **6,236 Quran verses** using AI-powered semantic similarity

- Returns top matches with ±2 surrounding verses for context
- Supports 1-20 results per query
- Powered by Google Gemini embeddings (768-dim)

### 2. `search_hadith`

Search across **12,416 authentic Hadith** narrations

- Collections: Sahih Bukhari, Sahih Muslim, 40 Hadith Nawawi, Riyad as-Salihin
- Filter by authenticity grade: Sahih only, Sahih + Hasan, or All
- Filter by specific collections
- Supports 1-15 results per query

### 3. `get_verse`

Retrieve a specific Quran verse by reference

- Format: `"surah:ayah"` (e.g., `"2:255"` for Ayat al-Kursi)
- Returns both Arabic text and English translation

## Quick Start

### Option 1: Use Production Server (Recommended)

No installation needed! Use Criterion's hosted MCP server:

**URL:** `https://criterion.life/api/mcp`

### Option 2: Run Locally

1. Clone and set up Criterion:

```bash
git clone https://github.com/BalajSaleem/criterion.git
cd criterion
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
# Add your DATABASE_URL and other required env vars
```

3. Start the development server:

```bash
pnpm dev
```

4. Your local MCP server will be available at:

```
http://localhost:3000/api/mcp
```

## Configure MCP Clients

See the example.mcp.json file a sample mcp client JSON setup.

### Claude Desktop

Claude Desktop requires an HTTP proxy wrapper for HTTP MCP servers. Add this to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**Production Setup:**

```json
{
  "mcpServers": {
    "criterion": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://criterion.life/api/mcp"]
    }
  }
}
```

**Local Development:**

```json
{
  "mcpServers": {
    "criterion-local": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/api/mcp"]
    }
  }
}
```

> **Note:** We use `mcp-remote` instead of `mcp-client-http` as it provides better compatibility with the Streamable HTTP transport.

Restart Claude Desktop after saving.

### Claude Code (AI IDE)

If you cloned this repository, the `.mcp.json` file is already included with both production and local configurations.

**Using production server:**

```bash
claude mcp add criterion --transport http https://criterion.life/api/mcp
```

**Using local development server:**

```bash
claude mcp add criterion-local --transport http http://localhost:3000/api/mcp
```

The `.mcp.json` file in this repo configures both:

```json
{
  "mcpServers": {
    "criterion": {
      "type": "http",
      "url": "https://criterion.life/api/mcp"
    },
    "criterion-local": {
      "type": "http",
      "url": "http://localhost:3000/api/mcp"
    }
  }
}
```

After configuration, use `/mcp` in Claude Code to verify the connection.

### Cursor IDE

Cursor supports HTTP MCP servers natively. Add this to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "criterion": {
      "url": "https://criterion.life/api/mcp"
    }
  }
}
```

Or use the Claude Code CLI if you have it installed:

```bash
claude mcp add criterion --transport http --scope project https://criterion.life/api/mcp
```

### Other MCP Clients

Any MCP-compatible client can connect using the **Streamable HTTP** transport:

```
https://criterion.life/api/mcp
```

## Testing Your Setup

### Using MCP Inspector (Local Development)

1. Start Criterion locally:

```bash
pnpm dev
```

2. In a new terminal, run the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector@latest http://localhost:3000
```

3. Open the inspector at `http://127.0.0.1:6274`

4. Configure the connection:

   - Select **Streamable HTTP** transport
   - URL: `http://localhost:3000/api/mcp`
   - Click **Connect**

5. Test the tools:
   - Click **List Tools** under Tools
   - Try `search_quran` with query: `"patience in hardship"`
   - Try `search_hadith` with query: `"charity"`
   - Try `get_verse` with reference: `"2:255"`

## Usage Examples

Once connected, you can ask your AI assistant:

### Quran Search Examples

> "Search the Quran for verses about patience during difficult times"

> "Find Quranic guidance on being grateful"

> "What does the Quran say about prayer?"

### Hadith Search Examples

> "Search Sahih Bukhari and Sahih Muslim for hadiths about charity"

> "Find authentic hadiths about kindness to parents"

> "What did the Prophet say about knowledge?"

### Specific Verse Retrieval

> "Get verse 2:255 (Ayat al-Kursi)"

> "Show me verse 18:10"

> "Retrieve Surah Al-Fatiha verse 1"

## Tool Parameters

### search_quran

| Parameter | Type   | Required | Default | Description                     |
| --------- | ------ | -------- | ------- | ------------------------------- |
| `query`   | string | Yes      | -       | Search query (1-500 characters) |
| `limit`   | number | No       | 7       | Number of results (1-20)        |

**Example:**

```json
{
  "query": "patience in hardship",
  "limit": 10
}
```

### search_hadith

| Parameter     | Type   | Required | Default      | Description                                               |
| ------------- | ------ | -------- | ------------ | --------------------------------------------------------- |
| `query`       | string | Yes      | -            | Search query (1-500 characters)                           |
| `collections` | string | No       | all          | Comma-separated: `bukhari,muslim,nawawi40,riyadussalihin` |
| `grade`       | enum   | No       | `sahih-only` | `sahih-only`, `sahih-and-hasan`, or `all`                 |
| `limit`       | number | No       | 5            | Number of results (1-15)                                  |

**Example:**

```json
{
  "query": "charity and good deeds",
  "collections": "bukhari,muslim",
  "grade": "sahih-only",
  "limit": 10
}
```

### get_verse

| Parameter   | Type   | Required | Default | Description                              |
| ----------- | ------ | -------- | ------- | ---------------------------------------- |
| `reference` | string | Yes      | -       | Format: `"surah:ayah"` (e.g., `"2:255"`) |

**Example:**

```json
{
  "reference": "2:255"
}
```

## Technical Details

### Architecture

- **Transport:** Streamable HTTP (MCP over HTTP)
- **Deployment:** Vercel Functions with Fluid Compute
- **Database:** PostgreSQL + pgvector (HNSW indexes)
- **Embeddings:** Google Gemini text-embedding-004 (768 dimensions)
- **Search:** Cosine similarity with Reciprocal Rank Fusion

### Data Sources

- **Quran:** 6,236 verses from the complete Mushaf
  - Arabic: Uthmanic script
  - English: Sahih International translation
  - Slovak translation also available
- **Hadith:** 12,416 authentic narrations
  - Sahih Bukhari: ~7,563 hadiths
  - Sahih Muslim: ~5,362 hadiths
  - 40 Hadith Nawawi: 42 hadiths
  - Riyad as-Salihin: ~1,896 hadiths

### Performance

- Average latency: ~500ms
- Context-aware results with surrounding verses
- Automatic caching for common queries
- Scales automatically with Vercel Functions

## Troubleshooting

### HTTP 406 "Not Acceptable" Error

If you encounter `Error POSTing to endpoint (HTTP 406): Client must accept both application/json and text/event-stream`:

**Cause:** This is a known bug in `@modelcontextprotocol/sdk` v1.25.x with overly strict Accept header validation.

**Solution:** Ensure you have `@modelcontextprotocol/sdk@1.24.0` pinned in your `package.json`:

```bash
pnpm add @modelcontextprotocol/sdk@1.24.0
```

This is already configured in Criterion's dependencies. If you still see this error:

1. Delete `node_modules` and `pnpm-lock.yaml`
2. Run `pnpm install` again
3. Restart your dev server

### Connection Issues

1. **Verify the URL is correct:**

   - Production: `https://criterion.life/api/mcp`
   - Local: `http://localhost:3000/api/mcp`

2. **Check your client configuration:**

   - Restart Claude Desktop after config changes
   - Ensure JSON syntax is valid (no trailing commas)
   - Use `mcp-remote` proxy (not `mcp-client-http`)

3. **Test with MCP Inspector:**
   ```bash
   npx @modelcontextprotocol/inspector@latest https://criterion.life
   ```

### Tool Not Working

1. **Verify tool parameters:**

   - Check parameter types and ranges
   - Ensure required fields are provided

2. **Check error messages:**

   - Look at the response from the tool
   - Common errors: empty query, invalid reference format

3. **Test directly via API:**
   ```bash
   curl "https://criterion.life/api/v1/quran/search?q=patience&limit=5"
   ```

## Development

### Project Structure

```
criterion/
├── app/
│   └── api/
│       └── mcp/
│           └── route.ts          # MCP API route handler
└── lib/
    └── mcp/
        ├── tools.ts              # Tool implementations
        └── types.ts              # TypeScript types
```

### Adding New Tools

1. Define types in `lib/mcp/types.ts`
2. Implement handler in `lib/mcp/tools.ts`
3. Register tool in `app/api/mcp/route.ts`

Example:

```typescript
server.tool(
  "my_new_tool",
  "Description of what this tool does",
  {
    param1: z.string().describe("Parameter description"),
  },
  async ({ param1 }) => {
    // Tool implementation
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);
```

### Testing

Test tools locally using the MCP Inspector or write integration tests:

```typescript
import { searchQuranTool } from "@/lib/mcp/tools";

const result = await searchQuranTool({
  query: "patience",
  limit: 5,
});

console.log(result);
```

## Troubleshooting

### Claude Desktop: "Error parsing config file"

**Issue:** Claude Desktop shows `invalid_type` error with `"expected": "string"` for the `command` field.

**Solution:** Claude Desktop requires stdio transport with an HTTP proxy wrapper, not direct HTTP URLs.

**Wrong:**

```json
{
  "mcpServers": {
    "criterion": {
      "url": "https://criterion.life/api/mcp" // ❌ Not supported in Claude Desktop
    }
  }
}
```

**Correct:**

```json
{
  "mcpServers": {
    "criterion": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://criterion.life/api/mcp"] // ✅ Works
    }
  }
}
```

## Security & Privacy

- **No authentication required** for read-only search operations
- **Rate limiting:** 10 requests per minute per IP (configurable)
- **Open source:** Full transparency - [view the code](https://github.com/BalajSaleem/criterion)

## Resources

- **MCP Specification:** https://modelcontextprotocol.io/
- **Criterion Repository:** https://github.com/BalajSaleem/criterion
- **API Documentation:** https://criterion.life/api
- **Live Demo:** https://criterion.life
- **Report Issues:** https://github.com/BalajSaleem/criterion/issues

## Support

Need help? Have questions?

- 📖 [Read the full documentation](https://github.com/BalajSaleem/criterion)
- 🐛 [Report bugs](https://github.com/BalajSaleem/criterion/issues)
- 💬 [Join discussions](https://github.com/BalajSaleem/criterion/discussions)

## License

MIT License - See [LICENSE](https://github.com/BalajSaleem/criterion/blob/main/LICENSE) for details.

---

**Built with ❤️ by the Criterion team**  
Empowering AI assistants with authentic Islamic knowledge
