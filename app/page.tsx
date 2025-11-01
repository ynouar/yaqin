import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { auth } from "./(auth)/auth";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  if (!modelIdFromCookie) {
    return (
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={session?.user} />
        <SidebarInset>
          <DataStreamProvider>
            <Chat
              autoResume={false}
              id={id}
              initialChatModel={DEFAULT_CHAT_MODEL}
              initialMessages={[]}
              initialVisibilityType="private"
              isReadonly={false}
              key={id}
            />
          </DataStreamProvider>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <AppSidebar user={session?.user} />
      <SidebarInset>
        <DataStreamProvider>
          <Chat
            autoResume={false}
            id={id}
            initialChatModel={modelIdFromCookie.value}
            initialMessages={[]}
            initialVisibilityType="private"
            isReadonly={false}
            key={id}
          />
        </DataStreamProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
