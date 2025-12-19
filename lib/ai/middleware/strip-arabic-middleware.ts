import type { LanguageModelV2Middleware } from "@ai-sdk/provider";

/**
 * Middleware that strips Arabic text from tool results before they reach the LLM.
 *
 * **Why this matters:**
 * - Reduces chances of hallucinations due to complex Arabic text
 * - Improves LLM reasoning (English is more effective for comprehension)
 * - Keeps Arabic in original tool output
 *
 * **How it works:**
 * 1. Tool executes → returns full output with Arabic + English
 * 2. Output stored in message parts (UI can access both languages)
 * 3. Middleware strips Arabic before sending to LLM for reasoning
 * 4. LLM generates response using clean English-only context
 */
export const stripArabicMiddleware: LanguageModelV2Middleware = {
  transformParams: async ({ params }) => {
    if (!params.prompt || !Array.isArray(params.prompt)) {
      return params;
    }

    const modifiedPrompt = params.prompt.map((message) => {
      // Process tool messages (contain actual tool results)
      if (message.role === "tool" && Array.isArray(message.content)) {
        const modifiedContent = message.content.map((part) => {
          if (part.type !== "tool-result") return part;

          // Tool results can be in 'result' or 'output' field
          const resultField = (part as any).result ? "result" : "output";
          const originalResult = (part as any)[resultField];

          if (!originalResult || typeof originalResult !== "object") {
            return part;
          }

          // Only process if Arabic text is present
          const resultStr = JSON.stringify(originalResult);
          if (!resultStr.includes('"arabic"')) {
            return part;
          }

          const processedResult = stripArabicFromObject(originalResult);
          return { ...part, [resultField]: processedResult } as any;
        });

        return { ...message, content: modifiedContent };
      }

      return message;
    });

    return { ...params, prompt: modifiedPrompt };
  },
};

/**
 * Recursively strips Arabic-related fields from an object.
 *
 * Removes: arabic, arabicText, surahArabic, textArabic
 * Keeps: english, textEnglish, englishText, reference, etc.
 */
function stripArabicFromObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(stripArabicFromObject);
  }

  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip Arabic-related fields
    if (["arabic", "arabicText", "surahArabic", "textArabic"].includes(key)) {
      continue;
    }

    // Recursively process nested objects/arrays
    cleaned[key] = stripArabicFromObject(value);
  }

  return cleaned;
}
