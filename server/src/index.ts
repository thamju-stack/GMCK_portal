import path from 'path';
import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { tryConnect } from './db.js';
import { createRouter } from './routes.js';
import { createStore, hashPassword } from './store.js';

const PORT = Number(process.env.PORT ?? 5001);
const ADMIN_USERNAME = process.env.ADMIN_USER ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASS ?? 'admin123';
const DIST = path.resolve(import.meta.dirname, '../../client/dist');

async function main() {
  const usingMongo = await tryConnect(process.env.MONGODB_URI);
  const adminHash = await hashPassword(ADMIN_PASSWORD);
  const store = await createStore(usingMongo, ADMIN_USERNAME, adminHash);

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  app.use('/api', createRouter(store));
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, mode: usingMongo ? 'mongo' : 'memory', time: new Date().toISOString() });
  });

  /* serve client build in production */
  if (fs.existsSync(DIST)) {
    console.log(`[static] serving ${DIST}`);
    app.use(express.static(DIST));
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      return res.sendFile(path.join(DIST, 'index.html'));
    });
  } else {
    console.log('[static] client build not found (dev mode: run `npm run dev` in client)');
  }

  app.listen(PORT, () => {
    console.log(`[gmc] API listening on http://127.0.0.1:${PORT} (mode: ${usingMongo ? 'mongo' : 'memory'})`);
    if (!usingMongo) {
      console.log('[gmc] NOTE: MongoDB is not connected — in-memory data resets on restart.');
    }
    console.log(`[gmc] admin login: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD} (change me!)`);
  });
}

main().catch((err) => {
  console.error('[gmc] fatal:', err);
  process.exit(1);
});