"use client";

import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "sonner";

const DISCLAIMER_SEEN_KEY = "criterion-disclaimer-seen-v1";

export function useFirstVisitDisclaimer() {
  const [disclaimerSeen, setDisclaimerSeen] = useLocalStorage(
    DISCLAIMER_SEEN_KEY,
    false
  );

  useEffect(() => {
    if (!disclaimerSeen) {
      // Show disclaimer after a brief delay to let the page load
      const timer = setTimeout(() => {
        toast(
          "I'm an Quran based AI guide. Consult scholars for important matters.",
          {
            duration: 7000, // 7 seconds
            position: "bottom-right",
            action: {
              label: "Got it",
              onClick: () => {
                setDisclaimerSeen(true);
              },
            },
            onDismiss: () => {
              setDisclaimerSeen(true);
            },
            onAutoClose: () => {
              setDisclaimerSeen(true);
            },
            classNames: {
              toast: "sm text-sm text-gray-800 max-w-sm",
              title: "text-sm",
              description: "text-xs",
            },
          }
        );
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [disclaimerSeen, setDisclaimerSeen]);
}
