import { config } from "dotenv";
config({ path: ".env.local" });

import { getHadithByCollectionAndNumber, getAdjacentHadiths, getCollectionStats } from "./lib/db/queries";

async function testQueries() {
  console.log("Testing hadith queries...\n");

  // Test 1: Get a specific hadith
  console.log("1. Getting Bukhari hadith #1:");
  const hadith = await getHadithByCollectionAndNumber({
    collection: "bukhari",
    hadithNumber: 1,
  });
  if (hadith) {
    console.log(`✅ Found: ${hadith.reference}`);
    console.log(`   Grade: ${hadith.grade}`);
    console.log(`   Text: ${hadith.englishText.slice(0, 100)}...`);
  } else {
    console.log("❌ Not found");
  }

  // Test 2: Get adjacent hadiths
  console.log("\n2. Getting adjacent hadiths for Bukhari #1:");
  const adjacent = await getAdjacentHadiths("bukhari", 1);
  console.log(`✅ Previous: ${adjacent.previous || "none"}`);
  console.log(`✅ Next: ${adjacent.next}`);

  // Test 3: Get collection stats
  console.log("\n3. Getting Bukhari collection stats:");
  const stats = await getCollectionStats("bukhari");
  if (stats) {
    console.log(`✅ Total hadiths: ${stats.total}`);
    console.log(`✅ Range: ${stats.minNumber} - ${stats.maxNumber}`);
  }

  process.exit(0);
}

testQueries().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
