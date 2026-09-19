import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import {
  originValidationMiddleware,
  sanitizationMiddleware,
  createRateLimitMiddleware,
  safeErrorHandler,
} from './security';
import { RateLimiter } from '../../domain/security/RateLimiter';

describe('Server Security Middleware Layer', () => {
  it('allows safe requests without cross-origin mismatch in originValidationMiddleware', () => {
    const req = {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
        host: 'localhost:3000',
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    originValidationMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('blocks untrusted cross-origin POST attacks in originValidationMiddleware', () => {
    const req = {
      method: 'POST',
      headers: {
        origin: 'http://malicious-attacker-site.com',
        host: 'kincare.app',
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    originValidationMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Forbidden' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('allows trusted cloud run and forwarded host origins in originValidationMiddleware', () => {
    const req = {
      method: 'POST',
      headers: {
        origin: 'https://ais-dev-app-1234.asia-east1.run.app',
        host: 'localhost:3000',
        'x-forwarded-host': 'ais-dev-app-1234.asia-east1.run.app',
      },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    originValidationMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('sanitizes dangerous XSS payloads in sanitizationMiddleware', () => {
    const req = {
      body: {
        userInput: '<script>alert("pwned")</script>Hello',
        nested: {
          harmful: '<img src=x onerror=alert(1)>World',
        },
      },
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    sanitizationMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body.userInput).not.toContain('<script>');
    expect(req.body.nested.harmful).not.toContain('<img');
  });

  it('enforces rate limits in createRateLimitMiddleware', () => {
    const limiter = new RateLimiter({ windowMs: 60_000, maxRequests: 2 });
    const middleware = createRateLimitMiddleware(limiter);

    const req = {
      headers: { 'x-forwarded-for': '192.168.1.50' },
      ip: '192.168.1.50',
      socket: { remoteAddress: '192.168.1.50' },
    } as unknown as Request;

    const res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    // Request 1: Allowed
    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    // Request 2: Allowed
    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);

    // Request 3: Blocked (rate limit exceeded)
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Too Many Requests' }));
  });

  it('safely shields internal stack traces in safeErrorHandler', () => {
    const err = new Error('Sensitive database connection string leaked in /var/data/secrets');
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    safeErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred. Request was safely contained.',
    });

    consoleSpy.mockRestore();
  });
});
