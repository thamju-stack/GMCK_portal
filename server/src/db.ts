import { neon } from '@neondatabase/serverless';
import type { NeonQueryFunction } from '@neondatabase/serverless';

async function ensureSchema(sql: NeonQueryFunction<false, false>): Promise<void> {
  await sql`CREATE TABLE IF NOT EXISTS departments (id serial PRIMARY KEY, data jsonb NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS doctors (id serial PRIMARY KEY, data jsonb NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS notices (id serial PRIMARY KEY, data jsonb NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS notifications (id serial PRIMARY KEY, data jsonb NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS opd_rows (id serial PRIMARY KEY, data jsonb NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS emergency (key text PRIMARY KEY, phone text NOT NULL, helpdesk text NOT NULL)`;
  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id text PRIMARY KEY, name text NOT NULL, phone text NOT NULL, department text NOT NULL,
      preferred_date text NOT NULL, message text, created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`CREATE TABLE IF NOT EXISTS admins (username text PRIMARY KEY, hash text NOT NULL)`;
}

export async function tryConnect(uri: string | undefined): Promise<boolean> {
  if (!uri) return false;
  try {
    const sql = neon(uri);
    await sql`SELECT 1`;
    await ensureSchema(sql);
    console.log('[db] connected to Postgres (Neon)');
    return true;
  } catch {
    console.warn('[db] Postgres unreachable — falling back to in-memory store');
    return false;
  }
}
