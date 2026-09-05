import axios from 'axios';
import type { AppointmentInput, BootstrapData } from '@/types';

export const api = axios.create({ baseURL: '/api', withCredentials: true, timeout: 5000 });

export const bootstrapApi = {
  fetch: () => api.get<BootstrapData>('/bootstrap').then((r) => r.data),
};

export const appointmentsApi = {
  create: (a: AppointmentInput) => api.post('/appointments', a).then((r) => r.data),
};

export interface AdminUser {
  username: string;
}

export const adminApi = {
  login: (username: string, password: string) =>
    api.post<AdminUser>('/admin/login', { username, password }).then((r) => r.data),
  logout: () => api.post('/admin/logout').then((r) => r.data),
  me: () => api.get<AdminUser>('/admin/me').then((r) => r.data),
  changePassword: (current: string, next: string) =>
    api.put('/admin/password', { current, next }).then((r) => r.data),
  saveDepartments: (departments: unknown[]) =>
    api.post('/admin/departments', { departments }).then((r) => r.data),
  saveDoctors: (doctors: unknown[]) =>
    api.post('/admin/doctors', { doctors }).then((r) => r.data),
  saveEmergency: (emergency: unknown) =>
    api.put('/admin/emergency', emergency).then((r) => r.data),
};