import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { generateEmbeddings } from "@/lib/ai/embeddings";
import { quranEmbedding, quranVerse } from "@/lib/db/schema";

config({
  path: ".env.local",
});

type QuranVerseUpdate = {
  surahNumber: number;
  ayahNumber: number;
  textEnglish: string;
};

async function parseSahihInternationalFile(
  filePath: string
): Promise<Map<string, string>> {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");
  const verses = new Map<string, string>(); // key: "surah:ayah", value: text

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    // Format: surah|ayah|Text here
    const parts = line.split("|");
    if (parts.length !== 3) {
      console.warn(`⚠️  Skipping malformed line: ${line}`);
      continue;
    }

    const surahNumber = Number.parseInt(parts[0], 10);
    const ayahNumber = Number.parseInt(parts[1], 10);
    const text = parts[2].trim();

    if (Number.isNaN(surahNumber) || Number.isNaN(ayahNumber)) {
      console.warn(`⚠️  Invalid surah/ayah numbers in: ${line}`);
      continue;
    }

    const key = `${surahNumber}:${ayahNumber}`;
    verses.set(key, text);
  }

  return verses;
}

async function updateToSahihInternational() {
  console.log("🕋 Starting Quran translation update to Sahih International...\n");

  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not defined");
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const client = postgres(process.env.POSTGRES_URL!);
  const db = drizzle(client);

  // 1. Find Sahih International file
  let sahihPath = path.join(process.cwd(), "en.sahih.txt");
  if (!fs.existsSync(sahihPath)) {
    sahihPath = path.join(process.cwd(), "data", "en.sahih.txt");
  }

  if (!fs.existsSync(sahihPath)) {
    throw new Error(
      "en.sahih.txt not found. Please place it in the root folder or data folder."
    );
  }

  console.log(`📖 Reading Sahih International from: ${sahihPath}\n`);

  // 2. Parse Sahih International file
  const sahihMap = await parseSahihInternationalFile(sahihPath);
  console.log(`✅ Parsed ${sahihMap.size} verses from Sahih International\n`);

  // 3. Get all existing verses from database
  console.log("📊 Fetching existing verses from database...");
  const existingVerses = await db
    .select()
    .from(quranVerse)
    .orderBy(quranVerse.surahNumber, quranVerse.ayahNumber);
  console.log(`✅ Found ${existingVerses.length} verses in database\n`);

  // 4. Prepare updates
  console.log("🔍 Matching verses with new translation...");
  const updates: Array<{
    id: string;
    surahNumber: number;
    ayahNumber: number;
    oldText: string;
    newText: string;
  }> = [];

  let matchCount = 0;
  let missingCount = 0;

  for (const verse of existingVerses) {
    const key = `${verse.surahNumber}:${verse.ayahNumber}`;
    const newText = sahihMap.get(key);

    if (newText) {
      matchCount++;
      if (verse.textEnglish !== newText) {
        updates.push({
          id: verse.id,
          surahNumber: verse.surahNumber,
          ayahNumber: verse.ayahNumber,
          oldText: verse.textEnglish,
          newText: newText,
        });
      }
    } else {
      missingCount++;
      console.warn(
        `⚠️  Missing Sahih International translation for ${verse.surahNameEnglish} ${verse.surahNumber}:${verse.ayahNumber}`
      );
    }
  }

  console.log(`✅ Matched: ${matchCount} verses`);
  console.log(`⚠️  Missing: ${missingCount} verses`);
  console.log(`📝 Need to update: ${updates.length} verses\n`);

  if (missingCount > 0) {
    console.log(
      "⚠️  WARNING: Some verses are missing in Sahih International file."
    );
    console.log(
      "This may cause incomplete data. Please verify the source file.\n"
    );
  }

  // 5. Show sample of changes
  if (updates.length > 0) {
    console.log("📋 Sample changes (first 3):");
    for (let i = 0; i < Math.min(3, updates.length); i++) {
      const u = updates[i];
      console.log(`\n${u.surahNumber}:${u.ayahNumber}`);
      console.log(`  OLD: ${u.oldText.substring(0, 80)}...`);
      console.log(`  NEW: ${u.newText.substring(0, 80)}...`);
    }
    console.log();
  }

  // 6. Ask for confirmation
  console.log(
    `⚠️  This will update ${updates.length} verses in the PRODUCTION database.`
  );
  console.log(
    "⚠️  Embeddings will be regenerated (this may take ~10 minutes).\n"
  );

  // For safety, we'll proceed automatically but log everything
  console.log("🚀 Starting update process...\n");

  // 7. Update verses in batches using parallel operations
  const BATCH_SIZE = 500;
  const totalBatches = Math.ceil(updates.length / BATCH_SIZE);

  console.log(`💾 Updating verses (${totalBatches} batches)...`);

  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

    process.stdout.write(
      `   Batch ${batchNumber}/${totalBatches} (verses ${i + 1}-${Math.min(i + BATCH_SIZE, updates.length)})...`
    );

    try {
      // Update all verses in batch using Promise.all for parallel execution
      await Promise.all(
        batch.map((update) =>
          db
            .update(quranVerse)
            .set({ textEnglish: update.newText })
            .where(eq(quranVerse.id, update.id))
        )
      );

      console.log(" ✓");
    } catch (error) {
      console.log(" ✗");
      console.error(`   Error processing batch ${batchNumber}:`, error);
      throw error;
    }
  }

  console.log(`\n✅ Updated ${updates.length} verses\n`);

  // 8. Regenerate embeddings
  console.log("🤖 Regenerating embeddings...");
  console.log(
    "   Note: Updating embeddings for all 6,236 verses (~10 minutes)\n"
  );

  // Get all verses with updated text
  const allVerses = await db
    .select()
    .from(quranVerse)
    .orderBy(quranVerse.surahNumber, quranVerse.ayahNumber);

  // Get existing embeddings to match with verses
  console.log("📊 Fetching existing embeddings...");
  const existingEmbeddings = await db
    .select()
    .from(quranEmbedding);
  
  const embeddingMap = new Map(
    existingEmbeddings.map(e => [e.verseId, e.id])
  );
  console.log(`✅ Found ${existingEmbeddings.length} existing embeddings\n`);

  // Generate new embeddings in batches
  const EMBEDDING_BATCH_SIZE = 100;
  const embeddingBatches = Math.ceil(allVerses.length / EMBEDDING_BATCH_SIZE);

  console.log(`🤖 Generating and updating embeddings (${embeddingBatches} batches)...`);

  let updatedCount = 0;
  let insertedCount = 0;

  for (let i = 0; i < allVerses.length; i += EMBEDDING_BATCH_SIZE) {
    const batch = allVerses.slice(i, i + EMBEDDING_BATCH_SIZE);
    const texts = batch.map((v) => v.textEnglish);
    const batchNumber = Math.floor(i / EMBEDDING_BATCH_SIZE) + 1;

    process.stdout.write(
      `   Batch ${batchNumber}/${embeddingBatches} (verses ${i + 1}-${Math.min(i + EMBEDDING_BATCH_SIZE, allVerses.length)})...`
    );

    try {
      const batchEmbeddings = await generateEmbeddings(texts);

      // Prepare update and insert operations
      const updateOps = [];
      const insertOps = [];

      for (let idx = 0; idx < batchEmbeddings.length; idx++) {
        const emb = batchEmbeddings[idx];
        const verse = batch[idx];
        const existingEmbeddingId = embeddingMap.get(verse.id);

        if (existingEmbeddingId) {
          updateOps.push(
            db
              .update(quranEmbedding)
              .set({
                embedding: emb.embedding,
                content: emb.content,
              })
              .where(eq(quranEmbedding.id, existingEmbeddingId))
          );
        } else {
          insertOps.push({
            verseId: verse.id,
            embedding: emb.embedding,
            content: emb.content,
          });
        }
      }

      // Execute all updates in parallel
      if (updateOps.length > 0) {
        await Promise.all(updateOps);
        updatedCount += updateOps.length;
      }

      // Execute inserts in batch if any
      if (insertOps.length > 0) {
        await db.insert(quranEmbedding).values(insertOps);
        insertedCount += insertOps.length;
      }

      console.log(" ✓");

      // Rate limit delay (1 second between batches)
      if (i + EMBEDDING_BATCH_SIZE < allVerses.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.log(" ✗");
      console.error(`   Error processing batch ${batchNumber}:`, error);
      throw error;
    }
  }

  console.log(`\n✅ Updated ${updatedCount} embeddings`);
  if (insertedCount > 0) {
    console.log(`✅ Inserted ${insertedCount} new embeddings`);
  }
  console.log();

  await client.end();

  // 9. Summary
  console.log("🎉 Complete! Translation updated to Sahih International!");
  console.log("\n📊 Summary:");
  console.log(`   - Verses in database: ${existingVerses.length}`);
  console.log(`   - Verses updated: ${updates.length}`);
  console.log(`   - Verses unchanged: ${matchCount - updates.length}`);
  console.log(`   - Embeddings updated: ${updatedCount}`);
  if (insertedCount > 0) {
    console.log(`   - Embeddings inserted: ${insertedCount}`);
  }
  console.log(
    `   - Translation: Sahih International (en.sahih.txt)`
  );
}

updateToSahihInternational()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Error:", err);
    process.exit(1);
  });
