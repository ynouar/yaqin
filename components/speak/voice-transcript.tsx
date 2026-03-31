"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VoiceConversationItem } from "@/hooks/use-voice-session";

interface VoiceTranscriptProps {
  conversation: VoiceConversationItem[];
}

export function VoiceTranscript({ conversation }: VoiceTranscriptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, isOpen]);

  if (conversation.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        {isOpen ? (
          <>
            <ChevronDown className="w-4 h-4" />
            Hide Transcript
          </>
        ) : (
          <>
            <ChevronUp className="w-4 h-4" />
            Show Transcript ({conversation.length})
          </>
        )}
      </Button>

      {isOpen && (
        <div
          ref={scrollRef}
          className="mt-2 max-h-64 overflow-y-auto rounded-lg border bg-muted/30 p-4 space-y-3"
        >
          {conversation.map((item) => (
            <div
              key={item.id}
              className={cn(
                "text-sm",
                item.role === "user" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <span className="font-medium">
                {item.role === "user" ? "You: " : "Yaqin: "}
              </span>
              <span className={cn(!item.isFinal && "italic opacity-70")}>
                {item.text || "..."}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
