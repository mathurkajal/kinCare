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
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
});

// Origin & CSRF guard for state-mutating requests
export function originValidationMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.headers['origin'];
    const host = req.headers['host'];
    const forwardedHost = req.headers['x-forwarded-host'] as string | undefined;
    
    // If an Origin header is explicitly sent (e.g. from browsers in CORS or cross-origin attacks)
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const originHostname = originUrl.hostname.toLowerCase();
        const originHost = originUrl.host.toLowerCase();
        
        // Allowed target hosts include the direct host, forwarded host, or container localhosts
        const validHosts = [
          host?.toLowerCase(),
          forwardedHost?.split(',')[0]?.trim().toLowerCase(),
        ].filter((h): h is string => Boolean(h));

        const isLocalhost = originHostname === 'localhost' || originHostname === '127.0.0.1' || originHostname === '0.0.0.0';
        const isMatchingHost = validHosts.some(h => originHost === h || originHostname === h.split(':')[0]);
        const isTrustedCloudDomain = originHostname.endsWith('.run.app') || 
                                     originHostname.endsWith('.google.com') || 
                                     originHostname.endsWith('.googleusercontent.com') ||
                                     originHostname.endsWith('.ai.studio');

        if (!isMatchingHost && !isLocalhost && !isTrustedCloudDomain) {
          res.status(403).json({
            error: 'Forbidden',
            message: 'Cross-site request forgery protection: untrusted origin rejected.',
          });
          return;
        }
      } catch {
        res.status(400).json({ error: 'Bad Request', message: 'Invalid Origin header.' });
        return;
      }
    }
  }
  next();
}

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
