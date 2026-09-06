import type { Request, Response } from 'express';

import { createApp } from '../server/src/app.js';
import { createStore, hashPassword } from '../server/src/store.js';
import { tryConnect } from '../server/src/db.js';

const ADMIN_USERNAME = process.env.ADMIN_USER ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASS ?? 'admin123';

let cached: ReturnType<typeof createApp> | null = null;

async function getApp() {
  if (!cached) {
    /* `cached` survives across invocations on the same warm lambda instance.
       When MONGODB_URI is set this connects to real, persistent MongoDB
       (same as the standalone server); otherwise it falls back to the
       in-memory store, which resets on every cold start. */
    const usingMongo = await tryConnect(process.env.MONGODB_URI);
    const adminHash = await hashPassword(ADMIN_PASSWORD);
    const store = await createStore(usingMongo, ADMIN_USERNAME, adminHash);
    cached = createApp(store, { usingMongo });
  }
  return cached;
}

export default async function handler(req: Request, res: Response) {
  const app = await getApp();
  return app(req, res);
}