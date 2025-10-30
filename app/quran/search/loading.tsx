import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Searching verses...</p>
        </div>
      </div>
    </div>
  );
}
