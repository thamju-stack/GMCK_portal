import { useMemo, useState } from 'react';
import {
  Building2, CalendarDays, ChevronRight, Clock, MapPin, Search,
  Shield, Stethoscope, Users,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  AppBar, Chip, EmptyState, SampleBanner, ScreenContainer, SecTitle, Input,
} from '@/components/ui';
import { DeptCard, DocCard } from '@/components/cards';
import { useBootstrap } from '@/hooks/useBootstrap';

/* ============ DEPARTMENTS ============ */
const DEPT_CATS = ['All', 'Clinical', 'Super Speciality', 'Surgical', 'Diagnostic'];

export function DepartmentsScreen() {
  const navigate = useNavigate();
  const { data } = useBootstrap();
  const [cat, setCat] = useState('All');

  const list = cat === 'All' ? data.departments : data.departments.filter((d) => d.cat === cat);

  return (
    <ScreenContainer>
      <AppBar title="Departments" sub="Clinical, surgical & diagnostic" />
      <div className="p-4 pb-24">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {DEPT_CATS.map((c) => <Chip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />)}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {list.map((d) => (
            <DeptCard key={d.name} d={d} onClick={() => navigate(`/department?dept=${encodeURIComponent(d.name)}`)} />
          ))}
        </div>
        <div className="mt-4"><SampleBanner /></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ DEPARTMENT DETAIL ============ */
export function DepartmentScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data } = useBootstrap();
  const name = params.get('dept') ?? '';
  const issue = params.get('issue');

  const dept = data.departments.find((d) => d.name === name);
  const docs = data.doctors.filter((d) => d.dept === name);

  if (!dept) {
    return (
      <ScreenContainer>
        <AppBar title="Department" />
        <div className="p-4"><EmptyState title="Department not found" /></div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AppBar title="Department" sub={dept.cat} />
      <div className="p-4 pb-24">
        <div className="flex items-center gap-3 rounded-2xl bg-p p-4 text-white shadow-md">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/25 bg-white/15">
            <Building2 size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[16px] font-extrabold">{dept.name}</div>
            <div className="text-[12px] font-medium text-white/75">{dept.desc}</div>
          </div>
        </div>

        {issue && (
          <div className="mt-3 rounded-xl bg-plight px-3.5 py-2.5 text-[12px] font-bold text-p">
            Recommended for: “{issue}”
          </div>
        )}

        <SecTitle>Services</SecTitle>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {dept.services.map((s) => (
            <div key={s} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-[12px] font-bold text-ink shadow-sm">
              <Shield size={14} className="shrink-0 text-teal" /> {s}
            </div>
          ))}
        </div>

        <SecTitle>Location</SecTitle>
        <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-plight text-p"><MapPin size={18} /></div>
            <div>
              <div className="text-[13.5px] font-bold text-ink">{dept.loc}</div>
              <div className="mt-0.5 text-[12px] text-soft">{dept.opd} • OPD</div>
            </div>
          </div>
        </div>

        <SecTitle>Doctors</SecTitle>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {docs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line bg-white px-4 py-3 text-center text-[12px] font-bold text-soft sm:col-span-2">
              Doctor list for this department coming soon (placeholder).
            </div>
          )}
          {docs.map((d) => (
            <DocCard key={d.name} doc={d} onClick={() => navigate(`/doctor?name=${encodeURIComponent(d.name)}&des=${encodeURIComponent(d.des)}&dept=${encodeURIComponent(d.dept)}&spec=${encodeURIComponent(d.spec)}`)} />
          ))}
        </div>

        <div className="mt-3 flex gap-2.5">
          <button onClick={() => navigate('/doctors')} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-pillbg py-3 text-[13px] font-bold text-p transition active:scale-[0.98]">
            <Stethoscope size={16} /> All doctors
          </button>
          <button onClick={() => navigate(`/appointment?dept=${encodeURIComponent(dept.name)}`)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal py-3 text-[13px] font-bold text-white transition active:scale-[0.98]">
            <CalendarDays size={16} /> Book OPD
          </button>
        </div>
      </div>
    </ScreenContainer>
  );
}

/* ============ DOCTORS ============ */
export function DoctorsScreen() {
  const navigate = useNavigate();
  const { data } = useBootstrap();
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('All');

  const depts = useMemo(() => ['All', ...Array.from(new Set(data.doctors.map((d) => d.dept)))], [data.doctors]);
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.doctors.filter(
      (d) =>
        (dept === 'All' || d.dept === dept) &&
        (!query ||
          d.name.toLowerCase().includes(query) ||
          d.dept.toLowerCase().includes(query) ||
          d.spec.toLowerCase().includes(query)),
    );
  }, [q, dept, data.doctors]);

  return (
    <ScreenContainer>
      <AppBar title="Doctor's Directory" sub="Find a doctor by department" />
      <div className="p-4 pb-24">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctors…" icon={<Search size={17} />} />
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {depts.map((c) => <Chip key={c} label={c} active={dept === c} onClick={() => setDept(c)} />)}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {list.length === 0 && <div className="sm:col-span-2"><EmptyState title="No doctors found" /></div>}
          {list.map((d) => (
            <DocCard key={d.name} doc={d} onClick={() => navigate(`/doctor?name=${encodeURIComponent(d.name)}&des=${encodeURIComponent(d.des)}&dept=${encodeURIComponent(d.dept)}&spec=${encodeURIComponent(d.spec)}`)} />
          ))}
        </div>
        <div className="mt-4"><SampleBanner /></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ DOCTOR PROFILE ============ */
export function DoctorScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data } = useBootstrap();
  const name = params.get('name') ?? '';
  const des = params.get('des') ?? '';
  const dept = params.get('dept') ?? '';
  const spec = params.get('spec') ?? '';

  const deptInfo = data.departments.find((d) => d.name === dept);
  const canBook = data.opd.length > 0;

  return (
    <ScreenContainer>
      <AppBar title="Doctor" />
      <div className="p-4 pb-24">
        <div className="flex items-center gap-3 rounded-2xl bg-teal p-4 text-white shadow-md">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20 text-lg font-extrabold">
            {(name.replace('Dr. ', '').trim()[0] ?? '?').toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[16px] font-extrabold">{name}</div>
            <div className="text-[12px] font-medium text-white/80">{des}</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-line bg-white p-3.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-soft"><Clock size={13} /> OPD</div>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] font-extrabold text-ink"><CalendarDays size={14} className="text-teal" /> {canBook ? 'Sample timing' : 'Mon–Sat'}</div>
          </div>
          <div className="rounded-2xl border border-line bg-white p-3.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-soft"><Building2 size={13} /> Department</div>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] font-extrabold text-ink"><Users size={14} className="text-teal" /> {dept}</div>
          </div>
        </div>

        <SecTitle>Specialisation</SecTitle>
        <div className="rounded-2xl border border-line bg-white p-4 shadow-sm text-[13px] font-semibold leading-relaxed text-ink">{spec}</div>

        {deptInfo && (
          <SecTitle>Department</SecTitle>
        )}
        {deptInfo && (
          <button onClick={() => navigate(`/department?dept=${encodeURIComponent(dept)}`)} className="w-full rounded-2xl border border-line bg-white p-4 text-left shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[14px] font-bold text-ink">{deptInfo.name}</div>
                <div className="mt-0.5 text-[11.5px] leading-snug text-soft">{deptInfo.loc} • {deptInfo.opd}</div>
              </div>
              <ChevronRight size={18} className="shrink-0 text-soft" />
            </div>
          </button>
        )}

        <div className="mt-5 flex flex-col gap-2.5">
          <button onClick={() => navigate(`/appointment?dept=${encodeURIComponent(dept)}`)} className="w-full rounded-xl bg-p py-3 text-[14px] font-bold text-white transition active:scale-[0.98]">
            Book Appointment
          </button>
          <button onClick={() => navigate('/opd')} className="w-full rounded-xl bg-pillbg py-3 text-[14px] font-bold text-p transition active:scale-[0.98]">
            View OPD Schedule
          </button>
        </div>
      </div>
    </ScreenContainer>
  );
}

/* ============ OPD ============ */
export function OpdScreen() {
  const { data } = useBootstrap();
  const navigate = useNavigate();
  return (
    <ScreenContainer>
      <AppBar title="OPD Schedule" sub="Outdoor patient timings" />
      <div className="p-4 pb-24">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="grid grid-cols-[1.3fr_1fr_1fr] bg-p px-4 py-2.5 text-[11px] font-extrabold text-white">
            <span>Day</span><span>Morning</span><span>Afternoon</span>
          </div>
          {data.opd.map((row) => (
            <div key={row.day} className="grid grid-cols-[1.3fr_1fr_1fr] items-center border-t border-line px-4 py-2.5 text-[12.5px]">
              <span className="font-bold text-ink">{row.day}</span>
              <span className="text-soft" dangerouslySetInnerHTML={{ __html: row.morning }} />
              <span className="text-soft" dangerouslySetInnerHTML={{ __html: row.afternoon }} />
            </div>
          ))}
        </div>

        <div className="mt-3"><SampleBanner /></div>
        <SecTitle>Details</SecTitle>
        <div className="rounded-2xl border border-line bg-white p-3.5 shadow-sm text-[12.5px] leading-relaxed text-soft">
          <div className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-p" /> OPD Block, Ground Floor — arrive 15 minutes before registration.</div>
          <div className="mt-2 flex items-start gap-2"><Clock size={15} className="mt-0.5 shrink-0 text-p" /> Registration closes 30 minutes before OPD ends.</div>
        </div>
        <button onClick={() => navigate('/appointment')} className="mt-4 w-full rounded-xl bg-teal py-3 text-[14px] font-bold text-white transition active:scale-[0.98]">
          Book an Appointment
        </button>
      </div>
    </ScreenContainer>
  );
}