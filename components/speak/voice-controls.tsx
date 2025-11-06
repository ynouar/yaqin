"use client";

import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceControlsProps {
  isSessionActive: boolean;
  onClick: () => void;
  status?: string;
  toolExecutionStatus?: string | null;
}

export function VoiceControls({ 
  isSessionActive, 
  onClick, 
  status,
  toolExecutionStatus,
}: VoiceControlsProps) {
  // Tool execution status takes priority over regular status
  const displayStatus = toolExecutionStatus || status;
  
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
      
      {displayStatus && (
        <p className={`text-sm ${toolExecutionStatus ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
          {displayStatus}
        </p>
      )}
      
      {!isSessionActive && !displayStatus && (
        <p className="text-sm text-muted-foreground">
          Speak to learn about Islam
        </p>
      )}
    </div>
  );
}
