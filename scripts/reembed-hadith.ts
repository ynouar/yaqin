import { config } from "dotenv";
import { asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { generateEmbeddings } from "../lib/ai/embeddings";
import { hadithEmbedding, hadithText } from "../lib/db/schema";

config({
  path: ".env.local",
});

const BATCH_SIZE = 100;
const RATE_LIMIT_MS = 1000;

async function reembedHadith() {
  console.log("🧠 Re-embedding Hadith texts with current model...\n");

  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not defined");
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const client = postgres(process.env.POSTGRES_URL!);
  const db = drizzle(client);

  const hadiths = await db
    .select({
      id: hadithText.id,
      englishText: hadithText.englishText,
    })
    .from(hadithText)
    .orderBy(asc(hadithText.collection), asc(hadithText.hadithNumber));

  console.log(`✅ Loaded ${hadiths.length} hadiths`);

  console.log("\n🗑️  Clearing existing Hadith embeddings...");
  await db.delete(hadithEmbedding);
  console.log("✅ Hadith embeddings cleared\n");

  const totalBatches = Math.ceil(hadiths.length / BATCH_SIZE);
  console.log(`🤖 Generating embeddings (${totalBatches} batches)...`);

  for (let i = 0; i < hadiths.length; i += BATCH_SIZE) {
    const batch = hadiths.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const texts = batch.map((h) => h.englishText);

    process.stdout.write(
      `   Batch ${batchNumber}/${totalBatches} (hadiths ${i + 1}-${Math.min(i + BATCH_SIZE, hadiths.length)})...`
    );

    try {
      const batchEmbeddings = await generateEmbeddings(texts);
      const rows = batchEmbeddings.map((emb, idx) => ({
        hadithId: batch[idx].id,
        embedding: emb.embedding,
        content: emb.content,
      }));

      await db.insert(hadithEmbedding).values(rows);
      console.log(" ✓");

      if (i + BATCH_SIZE < hadiths.length) {
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
      }
    } catch (error) {
      console.log(" ✗");
      console.error(`   Error processing batch ${batchNumber}:`, error);
      throw error;
    }
  }

  await client.end();
  console.log("\n🎉 Hadith re-embedding complete!");
}

reembedHadith()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Error:", err);
    process.exit(1);
  });
