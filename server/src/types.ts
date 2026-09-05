export interface Department {
  name: string;
  desc: string;
  cat: string;
  loc: string;
  opd: string;
  services: string[];
}

export interface Doctor {
  name: string;
  des: string;
  dept: string;
  spec: string;
}

export interface Notice {
  t: string;
  cat: string;
  c: string;
  d: string;
  s: string;
}

export interface NotificationItem {
  t: string;
  s: string;
  time: string;
  unread: boolean;
  b: string;
  col: string;
}

export interface OpdRow {
  day: string;
  morning: string;
  afternoon: string;
}

export interface EmergencyConfig {
  phone: string;
  helpdesk: string;
}

export interface BootstrapData {
  departments: Department[];
  doctors: Doctor[];
  notices: Notice[];
  notifications: NotificationItem[];
  opd: OpdRow[];
  emergency: EmergencyConfig;
}

export interface AppointmentInput {
  name: string;
  phone: string;
  department: string;
  preferred_date: string;
  message: string;
}

export interface Appointment extends AppointmentInput {
  id: string;
  created_at: string;
}

export interface AdminUser {
  username: string;
  hash: string;
}