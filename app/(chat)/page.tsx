import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Chat } from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { isBot } from "@/lib/bot-detection";
import { auth } from "../(auth)/auth";

// Metadata for home page
export const metadata: Metadata = {
  title: "Criterion - Quran Powered AI Assistant",
  description: "Ask questions about Islam, the Quran, and Hadith. Get authentic answers from Islamic sources with an AI-powered guide. Search 6,236 Quran verses and 12,416 authentic Hadiths.",
  openGraph: {
    title: "Criterion - Quran Powered AI Assistant",
    description: "Ask questions about Islam, the Quran, and Hadith. Get authentic answers from Islamic sources.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Criterion - Quran Powered AI Assistant",
    description: "Ask questions about Islam, the Quran, and Hadith. Get authentic answers.",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const id = generateUUID();
  const userAgent = (await headers()).get('user-agent') || '';
  
  // Bots skip auth to see metadata
  if (!isBot(userAgent)) {
    const session = await auth();
    if (!session) redirect("/api/auth/guest");
  }

  const cookieStore = await cookies();
  const modelId = cookieStore.get("chat-model")?.value || DEFAULT_CHAT_MODEL;

  return (
    <Chat
      autoResume={false}
      id={id}
      initialChatModel={modelId}
      initialMessages={[]}
      initialVisibilityType="private"
      isReadonly={false}
      key={id}
    />
  );
}
