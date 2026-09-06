import path from 'path';
import fs from 'fs';
import express from 'express';
import type { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { createRouter } from './routes.js';
import type { Store } from './store.js';

export function createApp(store: Store, opts: { usingDb?: boolean } = {}): Express {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  app.use('/api', createRouter(store));
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, mode: opts.usingDb ? 'postgres' : 'memory', time: new Date().toISOString() });
  });

  /* serve the client build when running standalone (local / self-hosted).
     On Vercel the static files and routing are handled by Vercel itself. */
  if (process.env.VERCEL !== '1') {
    const DIST = path.resolve(import.meta.dirname, '../../client/dist');
    if (fs.existsSync(DIST)) {
      app.use(express.static(DIST));
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        return res.sendFile(path.join(DIST, 'index.html'));
      });
    }
  }

  return app;
}