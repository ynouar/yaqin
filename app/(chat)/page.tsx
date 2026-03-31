import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { isBot } from "@/lib/bot-detection";
import { auth } from "../(auth)/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

// Metadata for home page
export const metadata = createPageMetadata({
  title: "Yaqin — Assistant Islamique IA",
  description: "Ask questions about Islam, the Quran, and Hadith. Get authentic answers from Islamic sources with an AI-powered guide. Search 6,236 Quran verses and 21,641 authentic Hadiths from 6 major collections.",
  path: "/",
  keywords: [
    "Quran search",
    "Islamic questions",
    "learn about Islam",
    "Quran AI",
    "Islamic teachings",
    "understanding Islam",
    "authentic Hadith",
    "Islamic guidance",
  ],
});

export default async function Page() {
  // Access dynamic data sources BEFORE using Math.random() (Next.js 15 requirement)
  const userAgent = (await headers()).get('user-agent') || '';
  const cookieStore = await cookies();
  
  const isBotRequest = isBot(userAgent);
  
  // Only check auth for real users, not bots/crawlers
  if (!isBotRequest) {
    const session = await auth();
    if (!session) redirect("/api/auth/guest");
  }

  const modelId = cookieStore.get("chat-model")?.value || DEFAULT_CHAT_MODEL;
  const id = generateUUID();

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
