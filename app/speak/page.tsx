import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { SpeakInterface } from "./speak-interface";

export const metadata = {
  title: "Speak - Criterion",
  description: "Have a voice conversation with Criterion to learn about Islam",
};

export default async function SpeakPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  return <SpeakInterface />;
}
