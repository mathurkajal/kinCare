import { describe, it, expect } from 'vitest';
import { Sanitizer } from './Sanitizer';

describe('Sanitizer Security Engine', () => {
  it('strips dangerous HTML tags and script injections', () => {
    const malicious = '<script>alert("hacked")</script>Hello Grandma';
    const result = Sanitizer.cleanText(malicious);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert("hacked")');
    expect(result).toContain('Hello Grandma');
  });

  it('neutralizes raw angle brackets into safe HTML entities', () => {
    const input = '<b>Bold Alert</b> <img src="x" onerror="alert(1)">';
    const result = Sanitizer.cleanText(input);
    expect(result).toContain('&lt;b&gt;');
    expect(result).not.toContain('<img');
    expect(result).not.toContain('onerror=');
  });

  it('strips null bytes and control characters', () => {
    const exploit = 'Maggie\x00Higgins\x07Alert';
    const result = Sanitizer.cleanText(exploit);
    expect(result).toBe('MaggieHigginsAlert');
  });

  it('enforces maximum length bounds strictly to prevent buffer bloat', () => {
    const longString = 'A'.repeat(5000);
    const result = Sanitizer.cleanText(longString, 50);
    expect(result.length).toBe(50);
  });

  it('detects and disallows prototype pollution keys', () => {
    expect(Sanitizer.isSafeObjectKey('__proto__')).toBe(false);
    expect(Sanitizer.isSafeObjectKey('constructor')).toBe(false);
    expect(Sanitizer.isSafeObjectKey('prototype')).toBe(false);
    expect(Sanitizer.isSafeObjectKey('safeField')).toBe(true);
  });

  it('strips prototype pollution vectors during deep object sanitization', () => {
    const payload = JSON.parse('{"valid": "data", "__proto__": {"polluted": true}}');
    const sanitized = Sanitizer.deepSanitizeObject(payload);
    expect(sanitized.valid).toBe('data');
    expect((sanitized as Record<string, unknown>).__proto__).toBeUndefined();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});
