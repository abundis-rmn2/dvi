import { unstable_cache } from 'next/cache';
import { logger } from '@/utils/logger';

// RAM memory cache layer for 0ms instant responses
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const RAM_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours TTL for read-only static dataset

/**
 * Retrieves cached data using dual-layer cache (RAM Memory Cache -> Next.js Data Cache -> SQLite Fetcher)
 * Handles oversized payloads (> 2MB) gracefully by falling back to direct fetch + RAM cache.
 */
export async function getCachedData<T>(
  keyParts: string[],
  fetcher: () => Promise<T> | T,
  tags: string[] = ['sqlite-data']
): Promise<T> {
  const cacheKey = keyParts.join('_');

  // Layer 1: Check In-Memory RAM Cache (0 ms response)
  const memoryCached = memoryCache.get(cacheKey);
  if (memoryCached && Date.now() - memoryCached.timestamp < RAM_CACHE_TTL_MS) {
    logger.log('CACHE:HIT_RAM', `[0ms] Serving ${cacheKey} from RAM cache`);
    return memoryCached.data as T;
  }

  // Layer 2: Try Next.js unstable_cache, fallback gracefully if payload > 2MB
  try {
    const cachedFetcher = unstable_cache(
      async () => {
        logger.log('CACHE:MISS_DB', `Executing SQLite query for ${cacheKey}`);
        const data = await fetcher();
        return data;
      },
      keyParts,
      { revalidate: 86400, tags }
    );

    const result = await cachedFetcher();
    memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (err: any) {
    logger.log(
      'CACHE:OVERSIZE_FALLBACK',
      `Bypassing Next.js data cache for ${cacheKey}: ${err?.message || err}. Serving via direct fetch + RAM cache.`
    );
    const directResult = await fetcher();
    memoryCache.set(cacheKey, { data: directResult, timestamp: Date.now() });
    return directResult;
  }
}

export function clearMemoryCache() {
  memoryCache.clear();
}
