import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { quranVerse, quranEmbedding } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

config({
  path: ".env.local",
});

async function verifySahihInternational() {
  console.log("🔍 Verifying Sahih International translation...\n");

  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const client = postgres(process.env.POSTGRES_URL!);
  const db = drizzle(client);

  // 1. Check total verse count
  const verseCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(quranVerse);
  console.log(`📊 Total verses: ${verseCount[0].count}`);

  // 2. Check total embedding count
  const embeddingCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(quranEmbedding);
  console.log(`📊 Total embeddings: ${embeddingCount[0].count}`);

  // 3. Check for orphaned embeddings
  const orphanedEmbeddings = await db
    .select({ count: sql<number>`count(*)` })
    .from(quranEmbedding)
    .leftJoin(quranVerse, eq(quranEmbedding.verseId, quranVerse.id))
    .where(sql`${quranVerse.id} IS NULL`);
  console.log(`📊 Orphaned embeddings: ${orphanedEmbeddings[0].count}`);

  // 4. Check for verses without embeddings
  const versesWithoutEmbeddings = await db
    .select({ count: sql<number>`count(*)` })
    .from(quranVerse)
    .leftJoin(quranEmbedding, eq(quranVerse.id, quranEmbedding.verseId))
    .where(sql`${quranEmbedding.id} IS NULL`);
  console.log(`📊 Verses without embeddings: ${versesWithoutEmbeddings[0].count}\n`);

  // 5. Check sample verses (known Sahih International markers)
  console.log("📋 Sample verses verification:\n");

  const sampleVerses = [
    { surah: 1, ayah: 1, expectedStart: "In the name of Allah" },
    { surah: 20, ayah: 50, expectedStart: "He said, \"Our Lord is He" },
    { surah: 2, ayah: 255, expectedStart: "Allah - there is no deity" },
    { surah: 112, ayah: 1, expectedStart: "Say, \"He is Allah" },
  ];

  for (const sample of sampleVerses) {
    const verse = await db
      .select()
      .from(quranVerse)
      .where(
        sql`${quranVerse.surahNumber} = ${sample.surah} AND ${quranVerse.ayahNumber} = ${sample.ayah}`
      )
      .limit(1);

    if (verse.length > 0) {
      const text = verse[0].textEnglish;
      const matches = text.startsWith(sample.expectedStart);
      const status = matches ? "✅" : "⚠️";
      console.log(`${status} ${sample.surah}:${sample.ayah}`);
      console.log(`   Expected: "${sample.expectedStart}..."`);
      console.log(`   Got: "${text.substring(0, 50)}..."`);
      console.log();
    }
  }

  // 6. Check embedding content matches verse text
  console.log("🔗 Checking embedding-verse consistency...\n");
  const sampleEmbedding = await db
    .select({
      verseText: quranVerse.textEnglish,
      embeddingContent: quranEmbedding.content,
    })
    .from(quranEmbedding)
    .innerJoin(quranVerse, eq(quranEmbedding.verseId, quranVerse.id))
    .limit(3);

  for (const row of sampleEmbedding) {
    const matches = row.verseText === row.embeddingContent;
    const status = matches ? "✅" : "⚠️";
    console.log(`${status} Embedding content matches verse text`);
    if (!matches) {
      console.log(`   Verse: "${row.verseText.substring(0, 50)}..."`);
      console.log(`   Embedding: "${row.embeddingContent.substring(0, 50)}..."`);
    }
  }

  await client.end();

  // 7. Final verdict
  console.log("\n" + "=".repeat(60));
  const isValid =
    verseCount[0].count === 6236 &&
    embeddingCount[0].count === 6236 &&
    orphanedEmbeddings[0].count === 0 &&
    versesWithoutEmbeddings[0].count === 0;

  if (isValid) {
    console.log("✅ VERIFICATION PASSED");
    console.log("   Translation successfully updated to Sahih International!");
  } else {
    console.log("⚠️  VERIFICATION ISSUES DETECTED");
    console.log("   Please review the output above for details.");
  }
  console.log("=".repeat(60));
}

verifySahihInternational()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Error:", err);
    process.exit(1);
  });
