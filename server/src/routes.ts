import { Router } from 'express';
import type { Request } from 'express';
import bcrypt from 'bcryptjs';

import { requireAdmin, signToken } from './auth.js';
import type { Store } from './store.js';
import { hashPassword } from './store.js';
import type { AppointmentInput, Department, Doctor, EmergencyConfig } from './types.js';

const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const COOKIE = { httpOnly: true, sameSite: 'lax' as const, secure: isProd, maxAge: 7 * 24 * 3600 * 1000 };

export function createRouter(store: Store): Router {
  const r = Router();

  r.get('/bootstrap', async (_req, res) => {
    res.json(await store.bootstrap());
  });

  r.post('/appointments', async (req, res) => {
    const body = (req.body ?? {}) as Partial<AppointmentInput>;
    if (!body.name || !body.phone || !body.department || !body.preferred_date) {
      res.status(400).json({ ok: false, error: 'missing fields' });
      return;
    }
    const appt = await store.addAppointment(body as AppointmentInput);
    res.status(201).json({ ok: true, appointment: appt });
  });

  /* ---------- admin ---------- */
  r.post('/admin/login', async (req, res) => {
    const { username, password } = (req.body ?? {}) as { username?: string; password?: string };
    if (!username || !password) {
      res.status(400).json({ ok: false, error: 'credentials required' });
      return;
    }
    const admin = await store.getAdmin(username);
    if (!admin || !(await bcrypt.compare(password, admin.hash))) {
      res.status(401).json({ ok: false, error: 'invalid credentials' });
      return;
    }
    res.cookie('token', signToken(admin.username), COOKIE);
    res.json({ ok: true, username: admin.username });
  });

  r.post('/admin/logout', (_req, res) => {
    res.clearCookie('token');
    res.json({ ok: true });
  });

  r.get('/admin/me', requireAdmin, (req, res) => {
    res.json({ ok: true, username: (req as Request & { admin?: string }).admin });
  });

  r.put('/admin/password', requireAdmin, async (req, res) => {
    const username = (req as Request & { admin?: string }).admin ?? '';
    const { current, next } = (req.body ?? {}) as { current?: string; next?: string };
    if (!current || !next) {
      res.status(400).json({ ok: false, error: 'current and next required' });
      return;
    }
    const admin = await store.getAdmin(username);
    if (!admin || !(await bcrypt.compare(current, admin.hash))) {
      res.status(401).json({ ok: false, error: 'current password is wrong' });
      return;
    }
    await store.setAdminPassword(username, await hashPassword(next));
    res.json({ ok: true });
  });

  r.post('/admin/departments', requireAdmin, async (req, res) => {
    await store.saveDepartments((req.body?.departments ?? []) as Department[]);
    res.json({ ok: true });
  });

  r.post('/admin/doctors', requireAdmin, async (req, res) => {
    await store.saveDoctors((req.body?.doctors ?? []) as Doctor[]);
    res.json({ ok: true });
  });

  r.put('/admin/emergency', requireAdmin, async (req, res) => {
    await store.saveEmergency((req.body ?? {}) as EmergencyConfig);
    res.json({ ok: true });
  });

  return r;
}