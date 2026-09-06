import type { Request, Response } from 'express';

import { createApp } from '../server/src/app.js';
import { createStore, hashPassword } from '../server/src/store.js';

const ADMIN_USERNAME = process.env.ADMIN_USER ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASS ?? 'admin123';

let cached: ReturnType<typeof createApp> | null = null;

async function getApp() {
  if (!cached) {
    /* On Vercel the stateless serverless runtime is fine with the in-memory
       store — each lambda instance seeds itself and resets on cold start. */
    const adminHash = await hashPassword(ADMIN_PASSWORD);
    const store = await createStore(false, ADMIN_USERNAME, adminHash);
    cached = createApp(store);
  }
  return cached;
}

export default async function handler(req: Request, res: Response) {
  const app = await getApp();
  return app(req, res);
}