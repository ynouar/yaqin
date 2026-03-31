import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { quranVerse, quranTranslation } from "@/lib/db/schema";

config({ path: ".env.local" });

const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("POSTGRES_URL is not defined");
}

const client = postgres(dbUrl);
const db = drizzle(client);

async function main() {
  const filePath = path.join(process.cwd(), "data", "fr.hamidullah.txt");
  const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");

  console.log(`📖 ${lines.length} versets Hamidullah à importer...`);

  // Supprimer les entrées Hamidullah existantes pour repartir propre
  await db
    .delete(quranTranslation)
    .where(eq(quranTranslation.translatorSlug, "hamidullah"));
  console.log("🗑️  Anciennes entrées supprimées");

  let inserted = 0;
  let skipped = 0;

  for (const line of lines) {
    const parts = line.split("|");
    if (parts.length < 3) continue;

    const surahNumber = parseInt(parts[0]);
    const ayahNumber = parseInt(parts[1]);
    const textFrench = parts.slice(2).join("|").trim();

    if (!textFrench) continue;

    // Trouver le verset correspondant
    const [verse] = await db
      .select({ id: quranVerse.id })
      .from(quranVerse)
      .where(
        and(
          eq(quranVerse.surahNumber, surahNumber),
          eq(quranVerse.ayahNumber, ayahNumber)
        )
      )
      .limit(1);

    if (!verse) {
      skipped++;
      continue;
    }

    await db.insert(quranTranslation).values({
      verseId: verse.id,
      language: "fr",
      text: textFrench,
      translatorName: "Muhammad Hamidullah",
      translatorSlug: "hamidullah",
      edition: "Centre Culturel Islamique",
      publishedYear: 1959,
      isDefault: true,
    });

    inserted++;
    if (inserted % 500 === 0) {
      console.log(`  ✅ ${inserted} versets insérés...`);
    }
  }

  console.log(`\n✅ Import terminé : ${inserted} versets insérés, ${skipped} ignorés`);
  await client.end();
}

main().catch((err) => {
  console.error("❌ Erreur :", err);
  process.exit(1);
});
