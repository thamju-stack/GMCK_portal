import { useEffect, useMemo, useState } from 'react';
import {
  Ambulance, BellRing, BookOpen, Building2, ChevronRight, Clock,
  Compass, GraduationCap, Library, LocateFixed, MapPin, Megaphone, Phone,
  Search, Stethoscope, User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  Card, Chip, EmptyState, InfoRow, SampleBanner, SecTitle, ScreenContainer, Input,
} from '@/components/ui';
import { MapCta, NoticeCard, ServiceTileCard } from '@/components/cards';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useLanguage } from '@/hooks/useLanguage';
import { HOME_SERVICES, PROBLEM_MAP } from '@/lib/sampleData';

/* ============ HOME ============ */
export function HomeScreen() {
  const navigate = useNavigate();
  const { data } = useBootstrap();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setSplash(false), 1600);
    return () => clearTimeout(id);
  }, []);

  return (
    <ScreenContainer>
      {splash && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#071c33]">
          <div className="animate-wfade flex flex-col items-center">
            <div className="text-2xl font-black tracking-widest text-teal">GMC</div>
            <div className="mt-1 text-[10px] font-bold tracking-[0.4em] text-white/60">KOZHIKODE</div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden p-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/gmc-logo.webp')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,50,.55),rgba(8,18,38,.62))]" />
        <div className="relative flex items-center gap-3 py-6">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/25 bg-white/10 text-white backdrop-blur">
            <Building2 size={22} />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-white">GMC Kozhikode</div>
            <div className="text-[10.5px] font-semibold text-white/65">One Home for GMC Kozhikode</div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-28">
        <div className="-mt-5 mb-2 flex items-center gap-2">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-danger shadow-md"><Ambulance size={20} /></div>
          <button onClick={() => navigate('/emergency')} className="flex min-w-0 flex-1 items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-left shadow-md">
            <span className="text-[13px] font-bold text-ink">Emergency &amp; Trauma</span>
            <ChevronRight size={16} className="text-soft" />
          </button>
        </div>

        <SecTitle>Hospital Services</SecTitle>
        <div className="grid grid-cols-3 gap-2.5">
          {HOME_SERVICES.slice(0, 3).map((s) => <ServiceTileCard key={s.to} s={s} />)}
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {HOME_SERVICES.slice(3).map((s) => <ServiceTileCard key={s.to} s={s} />)}
        </div>

        <SecTitle right={<button onClick={() => navigate('/notices')} className="flex items-center gap-0.5 text-[11.5px] font-bold text-p"><Megaphone size={13} /> More</button>}>
          Notice Board
        </SecTitle>
        <div className="flex flex-col gap-2.5">
          {data.notices.slice(0, 3).map((n) => <NoticeCard key={n.t} n={n} onClick={() => navigate('/notices')} />)}
        </div>

        <div className="mt-5">
          <MapCta />
        </div>
        <div className="mt-3"><SampleBanner /></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ HOSPITAL ============ */
const HOSP_ROWS: Array<{ icon: typeof Compass; t: string; s: string; to: string }> = [
  { icon: MapPin, t: 'About GMC Kozhikode', s: 'Government Medical College, Kozhikode', to: '/hospital' },
  { icon: Stethoscope, t: "Doctor's Directory", s: 'Find a doctor by department', to: '/doctors' },
  { icon: Clock, t: 'OPD Schedule', s: 'Outpatient department timings', to: '/opd' },
  { icon: Building2, t: 'Departments', s: 'Department & service directory', to: '/departments' },
  { icon: Megaphone, t: 'Notices & Updates', s: 'Hospital announcements', to: '/notices' },
];

export function HospitalScreen() {
  const navigate = useNavigate();
  return (
    <ScreenContainer>
      <div className="h-28 bg-cover bg-bottom" style={{ backgroundImage: "url('/gmc-logo.webp')" }} />
      <div className="-mt-16 px-4 pb-10">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-p text-white shadow-lg">
          <Building2 size={26} />
        </div>
        <h1 className="mt-3 text-[22px] font-black text-ink">GMC Kozhikode</h1>
        <p className="mt-1 max-w-[330px] text-[13px] leading-relaxed text-soft">
          Government Medical College, Kozhikode — a premier teaching hospital in Kerala delivering
          healthcare, education and research. (Placeholder description — official details from the
          hospital will replace this.)
        </p>
        <SecTitle>Quick Links</SecTitle>
        <div className="flex flex-col gap-2.5">
          {HOSP_ROWS.map((r) => (
            <InfoRow
              key={r.t}
              icon={<r.icon size={19} />}
              title={r.t}
              sub={r.s}
              iconBg="var(--color-pillbg)"
              iconColor="var(--color-p)"
              onClick={() => navigate(r.to)}
            />
          ))}
        </div>
        <div className="mt-5"><MapCta /></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ SEARCH ============ */
const SEARCH_CATS = ['All', 'Departments', 'Doctors', 'Services'];

export function SearchScreen() {
  const navigate = useNavigate();
  const { data } = useBootstrap();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const deptHits = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.departments.filter((d) => {
      const inCat = cat === 'All' || cat === 'Departments';
      if (!query) return inCat;
      return (
        inCat &&
        (d.name.toLowerCase().includes(query) ||
          d.desc.toLowerCase().includes(query) ||
          d.services.some((s) => s.toLowerCase().includes(query)))
      );
    });
  }, [q, cat, data.departments]);

  const docHits = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.doctors.filter((d) => {
      const inCat = cat === 'All' || cat === 'Doctors';
      if (!query) return inCat;
      return (
        inCat &&
        (d.name.toLowerCase().includes(query) ||
          d.dept.toLowerCase().includes(query) ||
          d.spec.toLowerCase().includes(query))
      );
    });
  }, [q, cat, data.doctors]);

  const resolvedDept = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return null;
    const hit = PROBLEM_MAP[query] ?? Object.keys(PROBLEM_MAP).find((k) => query.includes(k));
    return hit ? data.departments.find((d) => d.name.toLowerCase() === hit.toLowerCase()) ?? null : null;
  }, [q, data.departments]);

  const noHit = !q.trim() && cat === 'All';
  const empty = q.trim() && deptHits.length === 0 && docHits.length === 0;

  return (
    <ScreenContainer>
      <div className="p-4 pb-28">
        <h1 className="text-[22px] font-black text-ink">Search</h1>
        <p className="mt-0.5 text-[12.5px] text-soft">Departments, doctors &amp; services</p>

        <div className="relative mt-4">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soft" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try “chest pain”, “Cardiology”…"
            className="pl-10"
          />
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {SEARCH_CATS.map((c) => (
            <Chip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
          ))}
        </div>

        {noHit && (
          <div className="mt-6">
            <EmptyState title="Search the hospital" sub="Type a symptom, doctor or department to find care at GMC Kozhikode." />
            <SecTitle>Popular</SecTitle>
            <div className="flex flex-col gap-2.5">
              {HOSP_ROWS.slice(1).map((r) => (
                <InfoRow key={r.t} icon={<r.icon size={19} />} title={r.t} sub={r.s} onClick={() => navigate(r.to)} />
              ))}
            </div>
          </div>
        )}

        {resolvedDept && (
          <>
            <SecTitle>Recommended Department</SecTitle>
            <Card
              title={resolvedDept.name}
              subtext={`${resolvedDept.desc} • ${resolvedDept.loc}`}
              icon={<Building2 size={20} />}
              onClick={() => navigate(`/department?dept=${encodeURIComponent(resolvedDept.name)}&issue=${encodeURIComponent(q.trim())}`)}
            />
          </>
        )}

        {deptHits.length > 0 && (
          <>
            <SecTitle>Departments ({deptHits.length})</SecTitle>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {deptHits.map((d) => (
                <Card key={d.name} title={d.name} subtext={d.desc} icon={<Building2 size={19} />}
                  onClick={() => navigate(`/department?dept=${encodeURIComponent(d.name)}`)} />
              ))}
            </div>
          </>
        )}

        {docHits.length > 0 && (
          <>
            <SecTitle>Doctors ({docHits.length})</SecTitle>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {docHits.map((d) => (
                <Card key={d.name} title={d.name} subtext={`${d.des} • ${d.dept}`} icon={<Stethoscope size={19} />}
                  onClick={() => navigate(`/doctor?name=${encodeURIComponent(d.name)}&des=${encodeURIComponent(d.des)}&dept=${encodeURIComponent(d.dept)}&spec=${encodeURIComponent(d.spec)}`)} />
              ))}
            </div>
          </>
        )}

        {empty && <div className="mt-6"><EmptyState title="No results found" sub="Try a different symptom or department name." /></div>}
      </div>
    </ScreenContainer>
  );
}

/* ============ NOTICES ============ */
const NOTICE_TABS = ['All', 'Hospital', 'Admission', 'Examination', 'Academics'];

export function NoticesScreen() {
  const navigate = useNavigate();
  const { data } = useBootstrap();
  const [tab, setTab] = useState('All');

  const list = tab === 'All' ? data.notices : data.notices.filter((n) => n.cat === tab);

  return (
    <ScreenContainer>
      <div className="p-4 pb-28">
        <h1 className="flex items-center gap-2 text-[22px] font-black text-ink"><BellRing size={22} className="text-p" /> Notices</h1>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {NOTICE_TABS.map((c) => <Chip key={c} label={c} active={tab === c} onClick={() => setTab(c)} />)}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {list.length === 0 && <div className="sm:col-span-2"><EmptyState title="No notices here" /></div>}
          {list.map((n) => <NoticeCard key={n.t} n={n} onClick={() => navigate('/notices')} />)}
        </div>
        <div className="mt-4"><SampleBanner /></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ PROFILE ============ */
export function ProfileScreen() {
  const navigate = useNavigate();
  const { resetOnboarding, language } = useLanguage();
  const LANG_LABEL = { en: 'English', ml: 'മലയാളം', hi: 'हिन्दी' }[language];

  return (
    <ScreenContainer>
      <div className="p-4 pb-28">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-teal text-xl font-black text-white">G</div>
          <div>
            <div className="text-[17px] font-extrabold text-ink">Guest</div>
            <div className="text-[12px] text-soft">Using GMC Kozhikode portal</div>
          </div>
        </div>

        <SecTitle>Preferences</SecTitle>
        <div className="flex flex-col gap-2.5">
          <InfoRow icon={<LocateFixed size={19} />} title="Language" sub={LANG_LABEL} onClick={() => navigate('/language')} />
        </div>

        <SecTitle>Explore</SecTitle>
        <div className="flex flex-col gap-2.5">
          <InfoRow icon={<BookOpen size={19} />} title="Academics" sub="Academic calendar & activities" onClick={() => navigate('/academics')} />
          <InfoRow icon={<Library size={19} />} title="Library" sub="Central Library services" onClick={() => navigate('/library')} />
          <InfoRow icon={<GraduationCap size={19} />} title="Student Portal" sub="Student services & resources" onClick={() => navigate('/student')} />
          <InfoRow icon={<Phone size={19} />} title="Notifications" sub="In-app alerts & updates" onClick={() => navigate('/notifications')} />
        </div>

        <SecTitle>About</SecTitle>
        <div className="flex flex-col gap-2.5">
          <InfoRow icon={<Building2 size={19} />} title="Hospital Administration" sub="Admin access (restricted)" onClick={() => navigate('/admin')} />
          <InfoRow icon={<User size={19} />} title="Reset onboarding" sub="Re-run language selection" onClick={() => { resetOnboarding(); navigate('/welcome'); }} />
        </div>
      </div>
    </ScreenContainer>
  );
}