import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Authentic Hadith",
  description:
    "Search 21,641 authentic hadiths from 6 major collections including Bukhari, Muslim, Tirmidhi, Abu Dawud, Nawawi40, and Riyadussalihin. Find hadiths about any topic using semantic search.",
  keywords: [
    "hadith search",
    "search hadith",
    "authentic hadith",
    "Bukhari hadith",
    "Muslim hadith",
    "Islamic hadith",
    "Prophet Muhammad sayings",
    "Sunnah search",
  ],
  openGraph: {
    title: "Search Authentic Hadith - Yaqin",
    description:
      "Search 21,641 authentic hadiths from 6 major collections. Find hadiths about any topic.",
    type: "website",
  },
};

export default function HadithSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
