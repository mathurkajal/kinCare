import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { RateLimiter } from '../../domain/security/RateLimiter';
import { Sanitizer } from '../../domain/security/Sanitizer';

// Production-ready Helmet configuration
export const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // Vite development & iframe compatibility
  crossOriginEmbedderPolicy: false,
  xContentTypeOptions: true,
  xFrameOptions: { action: 'sameorigin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

// Deep recursive payload sanitizer to prevent prototype pollution & XSS
export function sanitizationMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = Sanitizer.deepSanitizeObject(req.body);
  }
  next();
}

// Rate Limiter middleware factory
export function createRateLimitMiddleware(limiter: RateLimiter) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      'anonymous';

    const status = limiter.check(clientIp);

    res.setHeader('X-RateLimit-Remaining', status.remaining.toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(status.resetTimeMs / 1000).toString());

    if (!status.allowed) {
      res.setHeader('Retry-After', Math.ceil(status.resetTimeMs / 1000).toString());
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'High request frequency detected. Please pause for a moment to protect server resources.',
        retryAfterSeconds: Math.ceil(status.resetTimeMs / 1000),
      });
      return;
    }
    next();
  };
}

// Centralized safe error handler: prevents leaking stack traces or filesystem paths
export function safeErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Handled server exception:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred. Request was safely contained.',
  });
}
