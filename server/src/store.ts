import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import type { InferSchemaType, Model } from 'mongoose';

const { model, models, Schema } = mongoose;

import { seedBootstrap } from './data.js';
import type {
  AdminUser, Appointment, AppointmentInput, BootstrapData, Department,
  Doctor, EmergencyConfig,
} from './types.js';

const str = { type: String, required: true };

const departmentSchema = new Schema({ name: str, desc: str, cat: str, loc: str, opd: str, services: [String] });
const doctorSchema = new Schema({ name: str, des: str, dept: str, spec: String });
const noticeSchema = new Schema({ t: str, cat: str, c: str, d: str, s: String });
const notificationSchema = new Schema({ t: str, s: str, time: str, unread: Boolean, b: String, col: String });
const opdSchema = new Schema({ day: str, morning: String, afternoon: String });
const emergencySchema = new Schema({ key: str, phone: String, helpdesk: String });
const appointmentSchema = new Schema({
  name: str, phone: str, department: str, preferred_date: str, message: String,
  created_at: { type: Date, default: Date.now },
});
const adminSchema = new Schema({ username: str, hash: str });

function m() {
  return {
    Department: (models.Department ?? model('Department', departmentSchema)) as Model<InferSchemaType<typeof departmentSchema>>,
    Doctor: (models.Doctor ?? model('Doctor', doctorSchema)) as Model<InferSchemaType<typeof doctorSchema>>,
    Notice: (models.Notice ?? model('Notice', noticeSchema)) as Model<InferSchemaType<typeof noticeSchema>>,
    Notification: (models.Notification ?? model('Notification', notificationSchema)) as Model<InferSchemaType<typeof notificationSchema>>,
    Opd: (models.OpdRow ?? model('OpdRow', opdSchema)) as Model<InferSchemaType<typeof opdSchema>>,
    Emergency: (models.Emergency ?? model('Emergency', emergencySchema)) as Model<InferSchemaType<typeof emergencySchema>>,
    Appointment: (models.Appointment ?? model('Appointment', appointmentSchema)) as Model<InferSchemaType<typeof appointmentSchema>>,
    Admin: (models.Admin ?? model('Admin', adminSchema)) as Model<InferSchemaType<typeof adminSchema>>,
  };
}

async function replace(model: Model<any>, docs: unknown[]): Promise<void> {
  await model.deleteMany({});
  await model.insertMany(docs as never[]);
}

/* ================= mongo-backed store ================= */
export class MongoStore implements Store {
  async bootstrap(): Promise<BootstrapData> {
    const M = m();
    const [departments, doctors, notices, notifications, opd, emergency] = await Promise.all([
      M.Department.find().lean(), M.Doctor.find().lean(), M.Notice.find().lean(),
      M.Notification.find().lean(), M.Opd.find().sort({ day: 1 }).lean(),
      M.Emergency.findOne({ key: 'default' }).lean(),
    ]);
    return {
      departments: departments.map((d) => ({ name: d.name, desc: d.desc, cat: d.cat, loc: d.loc, opd: d.opd, services: d.services })),
      doctors: doctors.map((d) => ({ name: d.name, des: d.des, dept: d.dept, spec: d.spec ?? '' })),
      notices: notices.map((n) => ({ t: n.t, cat: n.cat, c: n.c, d: n.d, s: n.s ?? '' })),
      notifications: notifications.map((n) => ({ t: n.t, s: n.s ?? '', time: n.time, unread: n.unread ?? false, b: n.b ?? '', col: n.col ?? '' })),
      opd: opd.map((o) => ({ day: o.day, morning: o.morning ?? '', afternoon: o.afternoon ?? '' })),
      emergency: emergency ? { phone: emergency.phone ?? '', helpdesk: emergency.helpdesk ?? '' } : { phone: '', helpdesk: '' },
    };
  }

  async saveDepartments(list: Department[]): Promise<void> {
    await replace(m().Department, list);
  }

  async saveDoctors(list: Doctor[]): Promise<void> {
    await replace(m().Doctor, list);
  }

  async saveEmergency(em: EmergencyConfig): Promise<void> {
    await m().Emergency.updateOne({ key: 'default' }, { $set: { phone: em.phone, helpdesk: em.helpdesk } }, { upsert: true });
  }

  async addAppointment(a: AppointmentInput): Promise<Appointment> {
    const doc = await m().Appointment.create(a);
    return { id: String(doc._id), ...a, created_at: new Date().toISOString() };
  }

  async listAppointments(): Promise<Appointment[]> {
    const docs = await m().Appointment.find().sort({ created_at: -1 }).lean();
    return docs.map((d) => ({
      id: String(d._id), name: d.name, phone: d.phone, department: d.department,
      preferred_date: d.preferred_date, message: d.message ?? '', created_at: new Date(d.created_at).toISOString(),
    }));
  }

  async getAdmin(username: string): Promise<AdminUser | null> {
    const doc = await m().Admin.findOne({ username }).lean();
    return doc ? { username: doc.username, hash: doc.hash } : null;
  }

  async setAdminPassword(username: string, hash: string): Promise<void> {
    await m().Admin.updateOne({ username }, { $set: { hash } }, { upsert: true });
  }

  /* Only seeds collections that are still empty — Mongo persists across
     restarts/cold starts, so re-seeding unconditionally would wipe out
     admin edits every time the serverless function cold-starts. */
  async seed(adminUsername: string, adminHash: string): Promise<void> {
    const seed = seedBootstrap();
    const M = m();
    if ((await M.Department.countDocuments()) === 0) await replace(M.Department, seed.departments);
    if ((await M.Doctor.countDocuments()) === 0) await replace(M.Doctor, seed.doctors);
    if ((await M.Notice.countDocuments()) === 0) await replace(M.Notice, seed.notices);
    if ((await M.Notification.countDocuments()) === 0) await replace(M.Notification, seed.notifications);
    if ((await M.Opd.countDocuments()) === 0) await replace(M.Opd, seed.opd);
    if ((await M.Emergency.countDocuments()) === 0) await this.saveEmergency(seed.emergency);
    if ((await M.Admin.countDocuments()) === 0) {
      await M.Admin.create({ username: adminUsername, hash: adminHash });
    }
  }
}

/* ================= in-memory store (no MongoDB on this machine) ================= */
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

export async function createStore(usingMongo: boolean, adminUsername: string, adminHash: string): Promise<Store> {
  const store: Store = usingMongo ? new MongoStore() : new MemoryStore();
  await store.seed(adminUsername, adminHash);
  return store;
}

export function hashPassword(pass: string): Promise<string> {
  return bcrypt.hash(pass, 10);
}

export type { Store };