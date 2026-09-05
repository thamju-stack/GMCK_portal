import { useEffect, useState } from 'react';
import {
  Building2, LayoutDashboard, Lock, LogOut, Plus, Save, ShieldCheck,
  Stethoscope, Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/store';

import {
  AppBar, Button, FieldLabel, SampleBanner, ScreenContainer, SecTitle, Input, TextArea,
} from '@/components/ui';
import { Callout } from '@/components/cards';
import { adminApi } from '@/lib/api';
import type { Department } from '@/types';
import { useBootstrap } from '@/hooks/useBootstrap';
import { bootstrapFetch } from '@/store/bootstrapSlice';
import { showToast } from '@/components/chrome';

/* ============ ADMIN LOGIN ============ */
function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await adminApi.login(username, password);
      showToast('Signed in as admin');
      navigate('/admin');
    } catch {
      showToast('Invalid admin credentials');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenContainer>
      <AppBar title="Admin" sub="Restricted access" />
      <div className="p-4 pb-24">
        <div className="rounded-2xl bg-ink p-5 text-white shadow-md">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><ShieldCheck size={22} /></div>
          <div className="mt-3 text-[18px] font-extrabold">Hospital Administration</div>
          <div className="mt-1 text-[12px] font-medium text-white/70">Manage content shown across the portal</div>
        </div>
        <SecTitle>Sign in</SecTitle>
        <div className="flex flex-col gap-3">
          <div>
            <FieldLabel>Username</FieldLabel>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          </div>
          <div>
            <FieldLabel>Password</FieldLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
          </div>
        </div>
        <div className="mt-5"><Button onClick={submit} disabled={busy}>{busy ? 'Signing inâ€¦' : 'Sign in'}</Button></div>
        <div className="mt-3"><Callout>Default demo credentials (admin / admin123). The hospital should change these before launch.</Callout></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ ADMIN DASHBOARD ============ */
const TABS = [
  { key: 'content', label: 'Content', Icon: LayoutDashboard },
  { key: 'emergency', label: 'Emergency', Icon: ShieldCheck },
  { key: 'password', label: 'Password', Icon: Lock },
];

function DeptEditor() {
  const { data } = useBootstrap();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [depts, setDepts] = useState<Department[]>(data.departments);
  const [busy, setBusy] = useState(false);

  useEffect(() => setDepts(data.departments), [data.departments]);

  const patch = (i: number, k: keyof Department, v: string) =>
    setDepts((prev) => prev.map((d, idx) => (idx === i ? { ...d, [k]: v } : d)));

  const save = async () => {
    setBusy(true);
    try {
      await adminApi.saveDepartments(depts);
      void dispatch(bootstrapFetch());
      showToast('Departments saved');
      navigate('/admin');
    } catch {
      showToast('Save failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        {depts.map((d, i) => (
          <div key={d.name} className="rounded-2xl border border-line bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-[13px] font-extrabold text-ink"><Building2 size={15} className="text-p" /> {d.name}</span>
              <button onClick={() => setDepts((prev) => prev.filter((_, idx) => idx !== i))} className="grid h-8 w-8 place-items-center rounded-lg bg-dlight text-danger"><Trash2 size={15} /></button>
            </div>
            <div className="mt-2.5 flex flex-col gap-2">
              <Input value={d.desc} onChange={(e) => patch(i, 'desc', e.target.value)} placeholder="Description" />
              <Input value={d.loc} onChange={(e) => patch(i, 'loc', e.target.value)} placeholder="Location" />
              <Input value={d.opd} onChange={(e) => patch(i, 'opd', e.target.value)} placeholder="OPD timing" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2.5">
        <Button variant="ghost" onClick={() => setDepts((prev) => [...prev, { name: 'New Department', desc: '', cat: 'Clinical', loc: 'OPD Block', opd: 'Sample', services: [] }])}><Plus size={16} /> Add</Button>
        <Button onClick={save} disabled={busy}><Save size={16} /> Save all</Button>
      </div>
    </div>
  );
}

function DocEditor() {
  const { data } = useBootstrap();
  const dispatch = useAppDispatch();
  const [docs, setDocs] = useState(data.doctors);
  const [busy, setBusy] = useState(false);

  useEffect(() => setDocs(data.doctors), [data.doctors]);

  const patch = (i: number, k: string, v: string) =>
    setDocs((prev) => prev.map((d, idx) => (idx === i ? { ...d, [k]: v } : d)));

  const save = async () => {
    setBusy(true);
    try {
      await adminApi.saveDoctors(docs);
      void dispatch(bootstrapFetch());
      showToast('Doctors saved');
    } catch {
      showToast('Save failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        {docs.map((d, i) => (
          <div key={d.name} className="rounded-2xl border border-line bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-[13px] font-extrabold text-ink"><Stethoscope size={15} className="text-teal" /> {d.name}</span>
              <button onClick={() => setDocs((prev) => prev.filter((_, idx) => idx !== i))} className="grid h-8 w-8 place-items-center rounded-lg bg-dlight text-danger"><Trash2 size={15} /></button>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <Input value={d.des} onChange={(e) => patch(i, 'des', e.target.value)} placeholder="Designation" />
              <Input value={d.dept} onChange={(e) => patch(i, 'dept', e.target.value)} placeholder="Department" />
              <Input className="col-span-2" value={d.spec} onChange={(e) => patch(i, 'spec', e.target.value)} placeholder="Specialisation" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2.5">
        <Button variant="ghost" onClick={() => setDocs((prev) => [...prev, { name: 'Dr. New', des: 'Consultant', dept: 'General Medicine', spec: '' }])}><Plus size={16} /> Add</Button>
        <Button onClick={save} disabled={busy}><Save size={16} /> Save all</Button>
      </div>
    </div>
  );
}

function EmergencyEditor() {
  const { data } = useBootstrap();
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState(data.emergency.phone);
  const [helpdesk, setHelpdesk] = useState(data.emergency.helpdesk);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPhone(data.emergency.phone);
    setHelpdesk(data.emergency.helpdesk);
  }, [data.emergency]);

  const save = async () => {
    setBusy(true);
    try {
      await adminApi.saveEmergency({ phone, helpdesk });
      void dispatch(bootstrapFetch());
      showToast('Emergency info saved');
    } catch {
      showToast('Save failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <FieldLabel>Emergency phone</FieldLabel>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 â€¦" />
      </div>
      <div>
        <FieldLabel>Helpdesk info</FieldLabel>
        <TextArea rows={2} value={helpdesk} onChange={(e) => setHelpdesk(e.target.value)} />
      </div>
      <Button onClick={save} disabled={busy}><Save size={16} /> Save</Button>
    </div>
  );
}

function PasswordEditor() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (next !== confirm) {
      showToast('New passwords do not match');
      return;
    }
    setBusy(true);
    try {
      await adminApi.changePassword(current, next);
      showToast('Password updated');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch {
      showToast('Current password is wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <FieldLabel>Current password</FieldLabel>
        <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
      </div>
      <div>
        <FieldLabel>New password</FieldLabel>
        <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
      </div>
      <div>
        <FieldLabel>Confirm new password</FieldLabel>
        <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      <Button onClick={save} disabled={busy}><Save size={16} /> Update</Button>
    </div>
  );
}

export function AdminScreen() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState('content');

  useEffect(() => {
    adminApi.me().then(() => setAuthed(true)).catch(() => setAuthed(false)).finally(() => setChecking(false));
  }, []);

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch {
      /* noop */
    }
    setAuthed(false);
    navigate('/');
  };

  if (checking) return <ScreenContainer><AppBar title="Admin" /></ScreenContainer>;

  if (!authed) return <Login />;

  return (
    <ScreenContainer>
      <AppBar title="Admin" sub="Content management"
        right={
          <button onClick={logout} className="grid h-9 w-9 place-items-center rounded-xl bg-dlight text-danger"><LogOut size={17} /></button>
        }
      />
      <div className="p-4 pb-24">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition ${tab === t.key ? 'border-p bg-p text-white' : 'border-line bg-white text-soft'}`}>
              <t.Icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === 'content' && (
            <>
              <SecTitle>Doctors</SecTitle>
              <DocEditor />
              <SecTitle>Departments</SecTitle>
              <DeptEditor />
            </>
          )}
          {tab === 'emergency' && (<><SecTitle>Emergency &amp; Helpdesk</SecTitle><EmergencyEditor /></>)}
          {tab === 'password' && (<><SecTitle>Change Password</SecTitle><PasswordEditor /></>)}
        </div>

        <div className="mt-5"><SampleBanner text="Changes are stored on the server and reapplied on next visit. Demo backend may reset on restart." /></div>
      </div>
    </ScreenContainer>
  );
}

export function AdminRoute() {
  return <AdminScreen />;
}
