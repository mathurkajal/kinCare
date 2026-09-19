/**
 * Robust Input Sanitization and Injection Defense Engine
 * Prevents Cross-Site Scripting (XSS), Prototype Pollution, Control Character Exploits,
 * and Resource Exhaustion (Buffer / ReDoS attacks).
 */

export class Sanitizer {
  /**
   * Sanitizes arbitrary text input for safe storage, rendering, and LLM prompting.
   * Strips HTML/script tags, control characters, and enforces strict length limits.
   */
  public static cleanText(input: unknown, maxLength: number = 2000, fallback: string = ''): string {
    if (typeof input !== 'string') {
      return fallback;
    }

    let sanitized = input
      // Remove null bytes and non-printable control characters (except newline, tab, carriage return)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Strip script tags and content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Strip dangerous HTML event handler attributes and javascript: protocols
      .replace(/javascript\s*:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      // Strip raw HTML angle brackets to prevent DOM injection
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    sanitized = sanitized.trim();

    if (sanitized.length > maxLength) {
      sanitized = sanitized.slice(0, maxLength);
    }

    return sanitized || fallback;
  }

  /**
   * Defends against prototype pollution when parsing or traversing dynamic objects.
   * Disallows `__proto__`, `constructor`, and `prototype` keys.
   */
  public static isSafeObjectKey(key: string): boolean {
    if (!key || typeof key !== 'string') return false;
    const forbidden = ['__proto__', 'constructor', 'prototype'];
    return !forbidden.includes(key.trim().toLowerCase());
  }

  /**
   * Deeply sanitizes JSON-like payloads to eliminate prototype pollution vectors and XSS strings.
   */
  public static deepSanitizeObject<T>(obj: T): T {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return Sanitizer.cleanText(obj) as unknown as T;
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => Sanitizer.deepSanitizeObject(item)) as unknown as T;
    }

    const cleanObj: Record<string, unknown> = Object.create(null);
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (Sanitizer.isSafeObjectKey(key)) {
        cleanObj[key] = Sanitizer.deepSanitizeObject(value);
      }
    }

    return cleanObj as T;
  }
}
