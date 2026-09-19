import { describe, it, expect } from 'vitest';
import { LruTtlCache } from './LruTtlCache';

describe('LruTtlCache Efficiency Engine', () => {
  it('stores and retrieves cached items with O(1) performance', () => {
    const cache = new LruTtlCache<string, string>(5, 10_000);
    cache.set('key1', 'val1');
    expect(cache.get('key1')).toBe('val1');
  });

  it('evicts least recently used items when max capacity is reached', () => {
    const cache = new LruTtlCache<string, number>(3, 60_000);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    // Access 'a' so it becomes most recently used; 'b' is now least recently used
    cache.get('a');

    // Add 'd', which triggers eviction of 'b'
    cache.set('d', 4);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);
    expect(cache.get('b')).toBeUndefined();
  });

  it('expires entries after their TTL has elapsed', () => {
    const cache = new LruTtlCache<string, string>(5, 1000);
    cache.set('temp', 'data', 500, 1000);

    // Unexpired at t=1200
    expect(cache.get('temp', 1200)).toBe('data');

    // Expired at t=1600
    expect(cache.get('temp', 1600)).toBeUndefined();
  });

  it('accurately tracks efficiency hit and miss ratios', () => {
    const cache = new LruTtlCache<string, string>(10, 5000);
    cache.set('known', 'yes');

    cache.get('known'); // Hit
    cache.get('known'); // Hit
    cache.get('missing'); // Miss

    const metrics = cache.getMetrics();
    expect(metrics.hits).toBe(2);
    expect(metrics.misses).toBe(1);
    expect(metrics.hitRatio).toBeCloseTo(0.666, 2);
  });
});
