/**
 * In-memory sliding window rate limiter.
 * Prevents Denial of Service (DoS), brute force, and API resource exhaustion.
 * Automatically evicts expired records to guarantee constant memory efficiency.
 */

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface ClientRecord {
  timestamps: number[];
}

export class RateLimiter {
  private clients: Map<string, ClientRecord> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private lastCleanupTime: number = -1;
  private readonly cleanupIntervalMs: number;

  constructor(config: RateLimitConfig, cleanupIntervalMs: number = 60_000) {
    this.windowMs = Math.max(1000, config.windowMs);
    this.maxRequests = Math.max(1, config.maxRequests);
    this.cleanupIntervalMs = cleanupIntervalMs;
  }

  /**
   * Evaluates whether an incoming request from an identifier (e.g. IP address) is permitted.
   * Returns { allowed: boolean, remaining: number, resetTimeMs: number }
   */
  public check(clientId: string, now: number = Date.now()): {
    allowed: boolean;
    remaining: number;
    resetTimeMs: number;
  } {
    this.autoPrune(now);

    const clientKey = clientId || 'anonymous';
    let record = this.clients.get(clientKey);

    if (!record) {
      record = { timestamps: [] };
      this.clients.set(clientKey, record);
    }

    // Filter out timestamps outside the sliding window
    const windowStart = now - this.windowMs;
    record.timestamps = record.timestamps.filter(t => t > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldestInWindow = record.timestamps[0];
      const resetTimeMs = Math.max(0, oldestInWindow + this.windowMs - now);
      return {
        allowed: false,
        remaining: 0,
        resetTimeMs,
      };
    }

    record.timestamps.push(now);
    const remaining = this.maxRequests - record.timestamps.length;
    const resetTimeMs = this.windowMs;

    return {
      allowed: true,
      remaining,
      resetTimeMs,
    };
  }

  /**
   * Resets limits for a specific client (e.g. after successful authentication or test teardown)
   */
  public reset(clientId: string): void {
    this.clients.delete(clientId);
  }

  /**
   * Clears all client tracking data
   */
  public clear(): void {
    this.clients.clear();
  }

  /**
   * Total number of currently tracked clients (for testing/telemetry)
   */
  public get trackedClientCount(): number {
    return this.clients.size;
  }

  /**
   * Periodic garbage collection of inactive client entries to prevent memory leaks
   */
  private autoPrune(now: number): void {
    if (this.lastCleanupTime === -1) {
      this.lastCleanupTime = now;
      return;
    }

    if (now - this.lastCleanupTime < this.cleanupIntervalMs && now >= this.lastCleanupTime) {
      return;
    }

    const windowStart = now - this.windowMs;
    for (const [key, record] of this.clients.entries()) {
      record.timestamps = record.timestamps.filter(t => t > windowStart);
      if (record.timestamps.length === 0) {
        this.clients.delete(key);
      }
    }
    this.lastCleanupTime = now;
  }
}
