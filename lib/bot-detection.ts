/**
 * Comprehensive bot/crawler detection for SEO and metadata crawling
 * Used by middleware and page components to allow bots to access content
 */

export const BOT_USER_AGENTS = [
  // Search engines
  'googlebot',
  'bingbot',
  'slurp', // Yahoo
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  
  // Social media crawlers
  'facebookexternalhit',
  'facebookcatalog',
  'twitterbot',
  'linkedinbot',
  'pinterestbot',
  'whatsapp',
  'telegrambot',
  'discordbot',
  'slackbot',
  'skypeuripreview',
  
  // Other important crawlers
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'vkShare',
  'W3C_Validator',
  'redditbot',
  'applebot',
  'rogerbot', // Moz
  
  // Development/testing
  'lighthouse',
  'gtmetrix',
  'pingdom',
  'uptimerobot',

  // AI bots
  'GPTBot',
'OAI-SearchBot',
'ChatGPT-User',
'PerplexityBot',
'Perplexity-User',
'ClaudeBot',
'Claude-User',
'Claude-SearchBot',
'Claude-Web',
'anthropic-ai',
'CCBot',
'FacebookBot',
'meta-externalagent',
'Meta-ExternalFetcher',
'YouBot',
'Amazonbot',
'cohere-ai',
'cohere-training-data-crawler',
'Webzio',
'Webzio-Extended',
'omgili',
'Omgilibot',
'Diffbot',
'Bytespider',
'Google-Extended',
'Gemini-Deep-Research',
'Google-CloudVertexBot',
'Applebot-Extended',
'DuckAssistBot',
'MistralAI-User',
'AI2Bot',
'Kangaroo Bot',
'PanguBot',
'PetalBot',
'SemrushBot-OCOB',
] as const;

/**
 * Check if a user agent string belongs to a known bot/crawler
 * @param userAgent - The User-Agent header string
 * @returns true if the user agent matches a known bot pattern
 */
export function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(pattern => ua.includes(pattern));
}

/**
 * Check if a pathname represents a static asset that should always be public
 * @param pathname - The URL pathname
 * @returns true if the path is a static asset
 */
export function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/videos/') ||
    pathname.includes('opengraph-image') ||
    pathname.includes('twitter-image') ||
    pathname.includes('apple-icon') ||
    pathname.includes('icon') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.ttf') ||
    pathname.endsWith('.eot')
  );
}
