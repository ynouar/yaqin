import { config } from "dotenv";
import { asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { generateEmbeddings } from "../lib/ai/embeddings";
import { quranEmbedding, quranVerse } from "../lib/db/schema";

config({
  path: ".env.local",
});

const BATCH_SIZE = 100;
const RATE_LIMIT_MS = 1000;

async function reembedQuran() {
  console.log("🧠 Re-embedding Quran verses with current model...\n");

  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not defined");
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const client = postgres(process.env.POSTGRES_URL!);
  const db = drizzle(client);

  const verses = await db
    .select({
      id: quranVerse.id,
      textEnglish: quranVerse.textEnglish,
    })
    .from(quranVerse)
    .orderBy(asc(quranVerse.surahNumber), asc(quranVerse.ayahNumber));

  console.log(`✅ Loaded ${verses.length} verses`);

  console.log("\n🗑️  Clearing existing Quran embeddings...");
  await db.delete(quranEmbedding);
  console.log("✅ Quran embeddings cleared\n");

  const totalBatches = Math.ceil(verses.length / BATCH_SIZE);
  console.log(`🤖 Generating embeddings (${totalBatches} batches)...`);

  for (let i = 0; i < verses.length; i += BATCH_SIZE) {
    const batch = verses.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const texts = batch.map((v) => v.textEnglish);

    process.stdout.write(
      `   Batch ${batchNumber}/${totalBatches} (verses ${i + 1}-${Math.min(i + BATCH_SIZE, verses.length)})...`
    );

    try {
      const batchEmbeddings = await generateEmbeddings(texts);
      const rows = batchEmbeddings.map((emb, idx) => ({
        verseId: batch[idx].id,
        embedding: emb.embedding,
        content: emb.content,
      }));

      await db.insert(quranEmbedding).values(rows);
      console.log(" ✓");

      if (i + BATCH_SIZE < verses.length) {
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
      }
    } catch (error) {
      console.log(" ✗");
      console.error(`   Error processing batch ${batchNumber}:`, error);
      throw error;
    }
  }

  await client.end();
  console.log("\n🎉 Quran re-embedding complete!");
}

reembedQuran()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Error:", err);
    process.exit(1);
  });
