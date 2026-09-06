import dotenv from 'dotenv';

dotenv.config();

import { tryConnect } from './db.js';
import { createApp } from './app.js';
import { createStore, hashPassword } from './store.js';

const PORT = Number(process.env.PORT ?? 5001);
const ADMIN_USERNAME = process.env.ADMIN_USER ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASS ?? 'admin123';

async function main() {
  const usingDb = await tryConnect(process.env.DATABASE_URL);
  const adminHash = await hashPassword(ADMIN_PASSWORD);
  const store = await createStore(usingDb, ADMIN_USERNAME, adminHash);

  const app = createApp(store, { usingDb });

  app.listen(PORT, () => {
    console.log(`[gmc] API listening on http://127.0.0.1:${PORT} (mode: ${usingDb ? 'postgres' : 'memory'})`);
    if (!usingDb) {
      console.log('[gmc] NOTE: no database connected — in-memory data resets on restart.');
    }
    console.log(`[gmc] admin login: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD} (change me!)`);
  });
}

main().catch((err) => {
  console.error('[gmc] fatal:', err);
  process.exit(1);
});