"use client";

import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceControlsProps {
  isSessionActive: boolean;
  onClick: () => void;
  status?: string;
}

export function VoiceControls({ 
  isSessionActive, 
  onClick, 
  status,
}: VoiceControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant={isSessionActive ? "destructive" : "default"}
        size="lg"
        className="w-full max-w-xs h-14 text-base font-medium"
        onClick={onClick}
      >
        {isSessionActive ? (
          <>
            <MicOff className="w-5 h-5 mr-2" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="w-5 h-5 mr-2" />
            Start Listening
          </>
        )}
      </Button>
      
      {status && (
        <p className="text-sm text-muted-foreground">
          {status}
        </p>
      )}
      
      {!isSessionActive && !status && (
        <p className="text-sm text-muted-foreground">
          Speak to learn about Islam
        </p>
      )}
    </div>
  );
}
