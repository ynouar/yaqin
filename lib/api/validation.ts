import { z } from "zod";

/**
 * Zod schemas for API request validation
 */

// Quran Search API Schema
export const quranSearchSchema = z.object({
  q: z
    .string()
    .min(1, "Query cannot be empty")
    .max(500, "Query too long (max 500 characters)")
    .describe("Search query for semantic search"),
  limit: z
    .string()
    .optional()
    .default("7")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int()
        .min(1, "Limit must be at least 1")
        .max(20, "Limit cannot exceed 20")
    )
    .describe("Number of results to return (1-20)"),
  language: z
    .enum(["en", "sk"])
    .optional()
    .default("en")
    .describe("Language code: 'en' for English or 'sk' for Slovak"),
});

export type QuranSearchParams = z.infer<typeof quranSearchSchema>;

// Hadith Search API Schema
export const hadithSearchSchema = z.object({
  q: z
    .string()
    .min(1, "Query cannot be empty")
    .max(500, "Query too long (max 500 characters)")
    .describe("Search query for semantic and keyword search"),
  collections: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((c) => c.trim()) : undefined))
    .pipe(
      z
        .array(
          z.enum(["bukhari", "muslim", "nawawi40", "riyadussalihin"], {
            errorMap: () => ({
              message:
                "Invalid collection. Allowed: bukhari, muslim, nawawi40, riyadussalihin",
            }),
          })
        )
        .optional()
    )
    .describe("Comma-separated list of hadith collections to search"),
  grade: z
    .enum(["sahih-only", "sahih-and-hasan", "all"])
    .optional()
    .default("sahih-only")
    .describe("Authenticity grade filter"),
  limit: z
    .string()
    .optional()
    .default("5")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int()
        .min(1, "Limit must be at least 1")
        .max(15, "Limit cannot exceed 15")
    )
    .describe("Number of results to return (1-15)"),
});

export type HadithSearchParams = z.infer<typeof hadithSearchSchema>;

/**
 * Helper function to validate query parameters from NextRequest
 */
export function validateQueryParams<T extends z.ZodTypeAny>(
  searchParams: URLSearchParams,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  const params = Object.fromEntries(searchParams.entries());

  const result = schema.safeParse(params);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, error: result.error };
}

/**
 * Format Zod errors into user-friendly API error response
 */
export function formatValidationError(error: z.ZodError) {
  const firstError = error.errors[0];

  return {
    error: "Validation error",
    message: firstError.message,
    field: firstError.path.join("."),
    details: error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
      code: err.code,
    })),
  };
}
