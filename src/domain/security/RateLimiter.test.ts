import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter } from './RateLimiter';

describe('RateLimiter Security Mechanism', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter({ windowMs: 1000, maxRequests: 3 });
  });

  it('allows requests within the configured threshold', () => {
    const r1 = limiter.check('192.168.1.1', 1000);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = limiter.check('192.168.1.1', 1100);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = limiter.check('192.168.1.1', 1200);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it('blocks excess requests once the threshold is exceeded', () => {
    limiter.check('10.0.0.1', 1000);
    limiter.check('10.0.0.1', 1100);
    limiter.check('10.0.0.1', 1200);

    const blocked = limiter.check('10.0.0.1', 1300);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetTimeMs).toBeGreaterThan(0);
  });

  it('slides the window and allows new requests after expiry', () => {
    limiter.check('10.0.0.2', 1000);
    limiter.check('10.0.0.2', 1100);
    limiter.check('10.0.0.2', 1200);

    // Blocked at 1500
    expect(limiter.check('10.0.0.2', 1500).allowed).toBe(false);

    // At 2001ms, timestamp 1000 has fallen outside the 1000ms window
    const allowed = limiter.check('10.0.0.2', 2001);
    expect(allowed.allowed).toBe(true);
  });

  it('tracks different client identities independently', () => {
    limiter.check('client-A', 1000);
    limiter.check('client-A', 1100);
    limiter.check('client-A', 1200);

    // Client A is blocked
    expect(limiter.check('client-A', 1300).allowed).toBe(false);

    // Client B has independent quota
    const clientB = limiter.check('client-B', 1300);
    expect(clientB.allowed).toBe(true);
    expect(clientB.remaining).toBe(2);
  });

  it('prunes inactive clients to avoid memory exhaustion', () => {
    const pruneLimiter = new RateLimiter({ windowMs: 500, maxRequests: 2 }, 1000);
    pruneLimiter.check('transient-1', 100);
    pruneLimiter.check('transient-2', 200);
    expect(pruneLimiter.trackedClientCount).toBe(2);

    // At time 1500 (> 1000ms cleanup interval), old clients should be pruned
    pruneLimiter.check('transient-3', 1500);
    expect(pruneLimiter.trackedClientCount).toBe(1);
  });
});
