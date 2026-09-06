import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import type { NeonQueryFunction } from '@neondatabase/serverless';

import { seedBootstrap } from './data.js';
import type {
  AdminUser, Appointment, AppointmentInput, BootstrapData, Department,
  Doctor, EmergencyConfig, Notice, NotificationItem, OpdRow,
} from './types.js';

interface AppointmentRow {
  id: string; name: string; phone: string; department: string;
  preferred_date: string; message: string | null; created_at: string;
}

async function tableCount(sql: NeonQueryFunction<false, false>, table: string): Promise<number> {
  const rows = (await sql.query(`SELECT count(*)::int AS n FROM ${table}`)) as unknown as { n: number }[];
  return rows[0].n;
}

/* ================= postgres-backed store (Neon) ================= */
export class PostgresStore implements Store {
  private sql: NeonQueryFunction<false, false>;

  constructor() {
    this.sql = neon(process.env.DATABASE_URL as string);
  }

  async bootstrap(): Promise<BootstrapData> {
    const sql = this.sql;
    const [departments, doctors, notices, notifications, opd, emergency] = await Promise.all([
      sql`SELECT data FROM departments ORDER BY id`,
      sql`SELECT data FROM doctors ORDER BY id`,
      sql`SELECT data FROM notices ORDER BY id`,
      sql`SELECT data FROM notifications ORDER BY id`,
      sql`SELECT data FROM opd_rows ORDER BY id`,
      sql`SELECT phone, helpdesk FROM emergency WHERE key = 'default'`,
    ]);
    const deptRows = departments as unknown as { data: Department }[];
    const docRows = doctors as unknown as { data: Doctor }[];
    const noticeRows = notices as unknown as { data: Notice }[];
    const notifRows = notifications as unknown as { data: NotificationItem }[];
    const opdRows = opd as unknown as { data: OpdRow }[];
    const emergencyRows = emergency as unknown as EmergencyConfig[];
    return {
      departments: deptRows.map((r) => r.data),
      doctors: docRows.map((r) => r.data),
      notices: noticeRows.map((r) => r.data),
      notifications: notifRows.map((r) => r.data),
      opd: opdRows.map((r) => r.data),
      emergency: emergencyRows[0] ?? { phone: '', helpdesk: '' },
    };
  }

  async saveDepartments(list: Department[]): Promise<void> {
    const sql = this.sql;
    await sql`DELETE FROM departments`;
    await Promise.all(list.map((item) => sql`INSERT INTO departments (data) VALUES (${JSON.stringify(item)})`));
  }

  async saveDoctors(list: Doctor[]): Promise<void> {
    const sql = this.sql;
    await sql`DELETE FROM doctors`;
    await Promise.all(list.map((item) => sql`INSERT INTO doctors (data) VALUES (${JSON.stringify(item)})`));
  }

  async saveEmergency(em: EmergencyConfig): Promise<void> {
    await this.sql`
      INSERT INTO emergency (key, phone, helpdesk) VALUES ('default', ${em.phone}, ${em.helpdesk})
      ON CONFLICT (key) DO UPDATE SET phone = excluded.phone, helpdesk = excluded.helpdesk`;
  }

  async addAppointment(a: AppointmentInput): Promise<Appointment> {
    const id = `ap-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const result = await this.sql`
      INSERT INTO appointments (id, name, phone, department, preferred_date, message)
      VALUES (${id}, ${a.name}, ${a.phone}, ${a.department}, ${a.preferred_date}, ${a.message ?? ''})
      RETURNING id, name, phone, department, preferred_date, message, created_at`;
    const rows = result as unknown as AppointmentRow[];
    const row = rows[0];
    return {
      id: row.id, name: row.name, phone: row.phone, department: row.department,
      preferred_date: row.preferred_date, message: row.message ?? '', created_at: new Date(row.created_at).toISOString(),
    };
  }

  async listAppointments(): Promise<Appointment[]> {
    const result = await this.sql`
      SELECT id, name, phone, department, preferred_date, message, created_at
      FROM appointments ORDER BY created_at DESC`;
    const rows = result as unknown as AppointmentRow[];
    return rows.map((row) => ({
      id: row.id, name: row.name, phone: row.phone, department: row.department,
      preferred_date: row.preferred_date, message: row.message ?? '', created_at: new Date(row.created_at).toISOString(),
    }));
  }

  async getAdmin(username: string): Promise<AdminUser | null> {
    const result = await this.sql`SELECT username, hash FROM admins WHERE username = ${username}`;
    const rows = result as unknown as AdminUser[];
    return rows[0] ?? null;
  }

  async setAdminPassword(username: string, hash: string): Promise<void> {
    await this.sql`
      INSERT INTO admins (username, hash) VALUES (${username}, ${hash})
      ON CONFLICT (username) DO UPDATE SET hash = excluded.hash`;
  }

  /* Only seeds tables that are still empty — Postgres persists across
     restarts/cold starts, so re-seeding unconditionally would wipe out
     admin edits every time the serverless function cold-starts. */
  async seed(adminUsername: string, adminHash: string): Promise<void> {
    const sql = this.sql;
    const seed = seedBootstrap();

    if ((await tableCount(sql, 'departments')) === 0) {
      await Promise.all(seed.departments.map((d) => sql`INSERT INTO departments (data) VALUES (${JSON.stringify(d)})`));
    }
    if ((await tableCount(sql, 'doctors')) === 0) {
      await Promise.all(seed.doctors.map((d) => sql`INSERT INTO doctors (data) VALUES (${JSON.stringify(d)})`));
    }
    if ((await tableCount(sql, 'notices')) === 0) {
      await Promise.all(seed.notices.map((n) => sql`INSERT INTO notices (data) VALUES (${JSON.stringify(n)})`));
    }
    if ((await tableCount(sql, 'notifications')) === 0) {
      await Promise.all(seed.notifications.map((n) => sql`INSERT INTO notifications (data) VALUES (${JSON.stringify(n)})`));
    }
    if ((await tableCount(sql, 'opd_rows')) === 0) {
      await Promise.all(seed.opd.map((o) => sql`INSERT INTO opd_rows (data) VALUES (${JSON.stringify(o)})`));
    }
    if ((await tableCount(sql, 'emergency')) === 0) {
      await this.saveEmergency(seed.emergency);
    }
    if ((await tableCount(sql, 'admins')) === 0) {
      await sql`INSERT INTO admins (username, hash) VALUES (${adminUsername}, ${adminHash})`;
    }
  }
}

/* ================= in-memory store (no database configured) ================= */
export class MemoryStore implements Store {
  private depts = seedBootstrap().departments;
  private docs = seedBootstrap().doctors;
  private notices = seedBootstrap().notices;
  private notifs = seedBootstrap().notifications;
  private opd = seedBootstrap().opd;
  private emergency = seedBootstrap().emergency;
  private appointments: Appointment[] = [];
  private admins: AdminUser[] = [];

  async seed(adminUsername: string, adminHash: string): Promise<void> {
    this.admins = [{ username: adminUsername, hash: adminHash }];
  }

  async bootstrap(): Promise<BootstrapData> {
    return {
      departments: this.depts, doctors: this.docs, notices: this.notices,
      notifications: this.notifs, opd: this.opd, emergency: this.emergency,
    };
  }

  async saveDepartments(list: Department[]): Promise<void> {
    this.depts = list;
  }

  async saveDoctors(list: Doctor[]): Promise<void> {
    this.docs = list;
  }

  async saveEmergency(em: EmergencyConfig): Promise<void> {
    this.emergency = em;
  }

  async addAppointment(a: AppointmentInput): Promise<Appointment> {
    const appt: Appointment = {
      id: `ap-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...a,
      created_at: new Date().toISOString(),
    };
    this.appointments.push(appt);
    return appt;
  }

  async listAppointments(): Promise<Appointment[]> {
    return [...this.appointments].reverse();
  }

  async getAdmin(username: string): Promise<AdminUser | null> {
    return this.admins.find((a) => a.username === username) ?? null;
  }

  async setAdminPassword(username: string, hash: string): Promise<void> {
    const idx = this.admins.findIndex((a) => a.username === username);
    if (idx >= 0) this.admins[idx] = { username, hash };
    else this.admins.push({ username, hash });
  }
}

interface Store {
  seed(adminUsername: string, adminHash: string): Promise<void>;
  bootstrap(): Promise<BootstrapData>;
  saveDepartments(list: Department[]): Promise<void>;
  saveDoctors(list: Doctor[]): Promise<void>;
  saveEmergency(em: EmergencyConfig): Promise<void>;
  addAppointment(a: AppointmentInput): Promise<Appointment>;
  listAppointments(): Promise<Appointment[]>;
  getAdmin(username: string): Promise<AdminUser | null>;
  setAdminPassword(username: string, hash: string): Promise<void>;
}

export async function createStore(usingDb: boolean, adminUsername: string, adminHash: string): Promise<Store> {
  const store: Store = usingDb ? new PostgresStore() : new MemoryStore();
  await store.seed(adminUsername, adminHash);
  return store;
}

export function hashPassword(pass: string): Promise<string> {
  return bcrypt.hash(pass, 10);
}

export type { Store };
