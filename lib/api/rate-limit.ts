import { NextRequest } from "next/server";

/**
 * Simple in-memory rate limiter for API endpoints
 * 
 * For production, consider using:
 * - Upstash Redis (@upstash/ratelimit)
 * - Vercel Edge Config
 * - Database-backed rate limiting
 */

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store (resets on deployment)
const store = new Map<string, RateLimitStore>();

// Rate limit configuration
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute per IP
};

/**
 * Check if request is within rate limit
 */
export async function checkApiRateLimit(
  request: NextRequest
): Promise<{ success: boolean; retryAfter?: number }> {
  // Get identifier (IP address or API key)
  const identifier = getIdentifier(request);
  const now = Date.now();

  // Get or create rate limit entry
  const entry = store.get(identifier);

  // Reset if window expired
  if (!entry || now > entry.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return { success: true };
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > RATE_LIMIT.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { success: false, retryAfter };
  }

  return { success: true };
}

/**
 * Get identifier for rate limiting (IP or API key)
 */
function getIdentifier(request: NextRequest): string {
  // Option 1: Use API key if provided
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) {
    return `key:${apiKey}`;
  }

  // Option 2: Use IP address
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return `ip:${ip}`;
}

/**
 * Cleanup old entries periodically (optional)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
