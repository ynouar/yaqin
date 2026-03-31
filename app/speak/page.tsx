import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { SpeakInterface } from "./speak-interface";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Speak - Voice Conversation with Yaqin",
  description: "Have a voice conversation with Yaqin to learn about Islam. Ask questions using your voice and get authentic answers from the Quran and Hadith.",
  path: "/speak",
  keywords: [
    "voice AI Islam",
    "speak to Islamic assistant",
    "voice Quran search",
    "talk to AI about Islam",
    "voice chatbot Islam",
  ],
});

export default async function SpeakPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  return <SpeakInterface />;
}
