import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';

import { RateLimiter } from './src/domain/security/RateLimiter';
import {
  helmetMiddleware,
  sanitizationMiddleware,
  createRateLimitMiddleware,
  safeErrorHandler,
} from './src/server/middleware/security';

import { companionRouter } from './src/server/routes/companion';
import { memoirRouter } from './src/server/routes/memoir';
import { safetyRouter } from './src/server/routes/safety';

dotenv.config();

const app = express();
const PORT = 3000;

// Security & Optimization Middleware Layer
app.use(helmetMiddleware);
app.use(compression());
app.use(express.json({ limit: '256kb' }));
app.use(sanitizationMiddleware);

// Rate Limiters for Resource Protection
const generalApiLimiter = new RateLimiter({ windowMs: 60_000, maxRequests: 80 });
const aiOperationLimiter = new RateLimiter({ windowMs: 60_000, maxRequests: 25 });

const generalRateLimit = createRateLimitMiddleware(generalApiLimiter);
const aiRateLimit = createRateLimitMiddleware(aiOperationLimiter);

// Health Check Endpoint
app.get('/api/health', generalRateLimit, (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mounted Modular Routers
app.use('/api/companion-chat', aiRateLimit, companionRouter);
app.use('/api/transcribe-memoir', aiRateLimit, memoirRouter);

// Safety, Scam Detection & Simplification Endpoints
app.use('/api/safety', aiRateLimit, safetyRouter);
// Backward-compatible direct mounts
app.post('/api/safety-audit', aiRateLimit, (req, res, next) => {
  req.url = '/audit';
  safetyRouter(req, res, next);
});
app.post('/api/check-scam', aiRateLimit, (req, res, next) => {
  req.url = '/check-scam';
  safetyRouter(req, res, next);
});
app.post('/api/simplify-text', aiRateLimit, (req, res, next) => {
  req.url = '/simplify-text';
  safetyRouter(req, res, next);
});

// Centralized Safe Error Handling Middleware
app.use(safeErrorHandler);

// Vite / Static SPA Middleware Layer
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { maxAge: '1d', etag: true }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KinCare server running securely on http://0.0.0.0:${PORT}`);
  });
}

startServer();
