/**
 * High-Performance In-Memory LRU + TTL Cache
 * Provides O(1) reads and writes, strict capacity bounds, and automatic time-to-live expiration.
 * Drastically improves compute and network efficiency by avoiding redundant LLM queries and expensive operations.
 */

interface CacheEntry<V> {
  value: V;
  expiresAt: number;
}

export class LruTtlCache<K, V> {
  private cache: Map<K, CacheEntry<V>> = new Map();
  private readonly maxCapacity: number;
  private readonly defaultTtlMs: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(maxCapacity: number = 200, defaultTtlMs: number = 300_000) {
    this.maxCapacity = Math.max(1, maxCapacity);
    this.defaultTtlMs = Math.max(1, defaultTtlMs);
  }

  /**
   * Retrieves an item from cache if it exists and has not expired.
   * Promotes the key to most-recently used (MRU) status.
   */
  public get(key: K, now: number = Date.now()): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return undefined;
    }

    if (entry.expiresAt <= now) {
      // Expired entry
      this.cache.delete(key);
      this.misses++;
      return undefined;
    }

    // Refresh position in Map for LRU order
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;
    return entry.value;
  }

  /**
   * Inserts or updates an entry in the cache with a specified or default TTL.
   * Evicts least recently used items if capacity is exceeded.
   */
  public set(key: K, value: V, ttlMs?: number, now: number = Date.now()): void {
    const ttl = ttlMs !== undefined ? Math.max(1, ttlMs) : this.defaultTtlMs;
    const expiresAt = now + ttl;

    // Delete existing key first so re-insertion places it at the end (MRU)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxCapacity) {
      // Evict oldest entry (the first item in Map keys iterator)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Checks whether a key is present and unexpired without updating LRU order.
   */
  public has(key: K, now: number = Date.now()): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expiresAt <= now) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Clears the entire cache
   */
  public clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Current number of stored elements
   */
  public get size(): number {
    return this.cache.size;
  }

  /**
   * Performance metrics for telemetry & efficiency validation
   */
  public getMetrics(): { hits: number; misses: number; hitRatio: number } {
    const total = this.hits + this.misses;
    const hitRatio = total > 0 ? this.hits / total : 0;
    return { hits: this.hits, misses: this.misses, hitRatio };
  }
}
