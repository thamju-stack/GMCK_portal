import { useState } from 'react';
import {
  Ambulance, Building2, CalendarDays, Clock, Compass, Download, FileText,
  LocateFixed, MapPin, Phone, ScanLine, Shield, Stethoscope,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  AppBar, Button, EmptyState, FieldLabel, InfoCard,
  SampleBanner, ScreenContainer, SecTitle, Select, TextArea, Input,
} from '@/components/ui';
import {
  Callout, MapCta, PhoneAction, RouteCard, TestItemRow,
} from '@/components/cards';
import { appointmentsApi } from '@/lib/api';
import { NAV_RESULTS, TESTS } from '@/lib/sampleData';
import { useBootstrap } from '@/hooks/useBootstrap';
import { showToast } from '@/components/chrome';

/* ============ EMERGENCY ============ */
export function EmergencyScreen() {
  const { data } = useBootstrap();
  const em = data.emergency;
  return (
    <ScreenContainer>
      <AppBar title="Emergency" sub="Emergency &amp; Trauma Centre" />
      <div className="p-4 pb-24">
        <div className="rounded-2xl bg-danger p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide opacity-80"><Ambulance size={18} /> Emergency &amp; Trauma</div>
          <div className="mt-2 text-[20px] font-black leading-tight">24×7 Emergency Care</div>
          <div className="mt-1 text-[12px] font-medium text-white/75">Casualty • Main Block • Ground Floor</div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-soft"><Phone size={13} /> EMERGENCY COUNTACT</div>
            <div className="mt-2"><PhoneAction number={em.phone} title="Call Emergency" /></div>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-soft"><Shield size={13} /> HELP DESK</div>
            <div className="mt-2 text-[12.5px] font-semibold text-ink">{em.helpdesk}</div>
          </div>
        </div>

        <SecTitle>What to do</SecTitle>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-sm">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-dlight text-danger"><MapPin size={17} /></div>
            <div className="text-[12.5px] leading-relaxed text-soft">Reach the casualty at the Main Block, Ground Floor. Ambulance bay is at the north gate.</div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-sm">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-alight text-amber"><Clock size={17} /></div>
            <div className="text-[12.5px] leading-relaxed text-soft">Carry referral notes, prior prescriptions and valid ID if available.</div>
          </div>
        </div>
        <div className="mt-4"><Callout>Sample data — official emergency numbers will be published by the hospital.</Callout></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ APPOINTMENT ============ */
function MinCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-white p-3.5 shadow-sm">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tl text-teal"><CalendarDays size={18} /></div>
      <div>
        <div className="text-[10.5px] font-bold text-soft">{label}</div>
        <div className="text-[13px] font-extrabold text-ink">{value}</div>
      </div>
    </div>
  );
}

export function AppointmentScreen() {
  const [params] = useSearchParams();
  const { data } = useBootstrap();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(params.get('dept') ?? data.departments[0]?.name ?? '');
  const [preferred_date, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !department || !preferred_date) {
      showToast('Please fill the required fields');
      return;
    }
    setBusy(true);
    try {
      await appointmentsApi.create({ name, phone, department, preferred_date, message });
      showToast('Appointment request submitted (sample)');
      navigate('/opd');
    } catch {
      showToast('Could not submit right now — try again');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenContainer>
      <AppBar title="Book Appointment" sub="OPD appointment request" />
      <div className="p-4 pb-24 md:mx-auto md:max-w-md">
        <div className="grid grid-cols-2 gap-2.5">
          <MinCard label="OPD Block" value="Ground Floor" />
          <MinCard label="Registration" value="Mon–Sat" />
        </div>
        <SecTitle>Patient Details</SecTitle>
        <div className="flex flex-col gap-3">
          <div>
            <FieldLabel>Full name *</FieldLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <FieldLabel>Phone number *</FieldLabel>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" />
          </div>
          <div>
            <FieldLabel>Department *</FieldLabel>
            <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
              {data.departments.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
            </Select>
          </div>
          <div>
            <FieldLabel>Preferred date *</FieldLabel>
            <Input type="date" value={preferred_date} onChange={(e) => setPreferredDate(e.target.value)} />
          </div>
          <div>
            <FieldLabel>Message (optional)</FieldLabel>
            <TextArea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your concern" />
          </div>
        </div>
        <div className="mt-5"><Button onClick={submit} disabled={busy}>{busy ? 'Submitting…' : 'Submit Request'}</Button></div>
        <div className="mt-3"><Callout>Sample flow — appointments are recorded and must be confirmed by the hospital.</Callout></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ NAVIGATION ============ */
const NAV_SECTIONS: Array<{ title: string; icon: typeof Compass; rows: typeof NAV_RESULTS }> = [
  { title: 'Ground Floor', icon: Compass, rows: NAV_RESULTS.slice(0, 4) },
  { title: 'Other Floors', icon: Building2, rows: NAV_RESULTS.slice(4) },
];

export function NavigationScreen() {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const all = NAV_RESULTS.filter((r) => !query || r.join(' ').toLowerCase().includes(query));

  return (
    <ScreenContainer>
      <AppBar title="Hospital Navigation" sub="Find rooms, wards & services" />
      <div className="p-4 pb-24">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a place…" icon={<LocateFixed size={17} />} />
        {NAV_SECTIONS.map((sec) => (
          <div key={sec.title}>
            <SecTitle>{sec.title}</SecTitle>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {all.filter((r) => sec.rows.includes(r)).length === 0 && query && <div className="sm:col-span-2"><EmptyState title="No places match" /></div>}
              {all.filter((r) => sec.rows.includes(r)).map((r) => <RouteCard key={r[0]} r={r} />)}
            </div>
          </div>
        ))}
        <div className="mt-5"><MapCta /></div>
        <div className="mt-3"><SampleBanner /></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ MAP ============ */
export function MapScreen() {
  return (
    <ScreenContainer>
      <AppBar title="Map" sub="Digital indoor map" />
      <div className="p-4 pb-24">
        <div className="relative h-64 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(180deg,#eaf3fb,#f2f6fb)]">
          <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: "url('/gmc-logo.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/90 px-5 py-4 text-center shadow-lg backdrop-blur">
              <MapPin size={26} className="text-p" />
              <div className="text-[13px] font-extrabold text-ink">GMC Kozhikode Campus</div>
              <div className="text-[11px] font-semibold text-soft">Open the interactive map for room-level directions</div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-[13px] font-extrabold text-ink"><Compass size={16} className="text-teal" /> Interactive indoor map</div>
          <MapCta />
        </div>
        <div className="mt-4"><Callout>Opens map.paadha.com in a new tab. Not embedded here.</Callout></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ TESTS ============ */
export function TestsScreen() {
  const navigate = useNavigate();
  const lab = TESTS.filter((t) => t.type === 'Laboratory');
  const rad = TESTS.filter((t) => t.type === 'Radiology');
  return (
    <ScreenContainer>
      <AppBar title="Tests &amp; Reports" sub="Laboratory &amp; Radiology" />
      <div className="p-4 pb-24">
        <SecTitle>Laboratory</SecTitle>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {lab.map((t) => <TestItemRow key={t.title} test={t} onClick={() => navigate(`/test?title=${encodeURIComponent(t.title)}&type=${encodeURIComponent(t.type)}&sample=${encodeURIComponent(t.sample)}&prep=${encodeURIComponent(t.prep)}`)} />)}
        </div>

        <SecTitle>Sample Collection</SecTitle>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <InfoCard icon={FileText} title="Sample Collection Points" rows={[
            ['Central Laboratory', 'Ground Floor'],
            ['Collection Timing', 'Sample (08:00–11:00)'],
            ['Fasting Tests', 'Morning hours'],
          ]} />
          <InfoCard icon={Download} title="Report Collection" rows={[
            ['Report Counter', 'Ground Floor'],
            ['Turnaround', 'Same day (most)'],
            ['Online Reports', 'Not available yet'],
          ]} />
        </div>

        <SecTitle>Radiology</SecTitle>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {rad.map((t) => (
            <button key={t.title} onClick={() => navigate(`/test?title=${encodeURIComponent(t.title)}&type=${encodeURIComponent(t.type)}&sample=${encodeURIComponent(t.sample)}&prep=${encodeURIComponent(t.prep)}`)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-4 shadow-sm transition active:scale-95">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-tl text-teal"><ScanLine size={20} /></div>
              <div className="text-center text-[11.5px] font-bold text-ink">{t.title}</div>
            </button>
          ))}
        </div>

        <div className="mt-4"><Callout>Online report access is not integrated yet. Reports are available at the hospital counters.</Callout></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ TEST DETAIL ============ */
export function TestDetailScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const title = params.get('title') ?? '';
  const test = TESTS.find((t) => t.title === title);

  if (!test) {
    return <ScreenContainer><AppBar title="Test" /><div className="p-4"><EmptyState title="Test not found" /></div></ScreenContainer>;
  }

  return (
    <ScreenContainer>
      <AppBar title="Test Details" />
      <div className="p-4 pb-24">
        <div className="rounded-2xl bg-p p-5 text-white shadow-md">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-white/70"><FileText size={14} /> {test.type}</div>
          <div className="mt-1.5 text-[18px] font-extrabold leading-tight">{test.title}</div>
        </div>
        <SecTitle>Test Info</SecTitle>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-sm">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tl text-teal"><Stethoscope size={18} /></div>
            <div>
              <div className="text-[10.5px] font-bold text-soft">Sample</div>
              <div className="text-[13.5px] font-extrabold text-ink">{test.sample}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-sm">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-plight text-p"><Clock size={18} /></div>
            <div>
              <div className="text-[10.5px] font-bold text-soft">Preparation</div>
              <div className="text-[13px] font-semibold leading-relaxed text-ink">{test.prep}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-sm">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-alight text-amber"><MapPin size={18} /></div>
            <div>
              <div className="text-[10.5px] font-bold text-soft">Location</div>
              <div className="text-[13px] font-semibold text-ink">{test.type === 'Radiology' ? 'Radiology Wing, Ground Floor' : 'Central Laboratory, Ground Floor'}</div>
            </div>
          </div>
        </div>
        <div className="mt-5"><Button variant="teal" onClick={() => navigate('/tests')}>Back to Tests</Button></div>
        <div className="mt-3"><Callout>Sample data — actual preparation rules may vary. Confirm with the lab.</Callout></div>
      </div>
    </ScreenContainer>
  );
}