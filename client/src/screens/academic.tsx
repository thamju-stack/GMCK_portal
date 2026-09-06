import { useState } from 'react';
import {
  Award, BookOpen, CalendarDays, Download, FileText, GraduationCap,
  Library as LibraryIcon, Megaphone, Shield, User, Users, Video,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  AppBar, EmptyState, SampleBanner, ScreenContainer, SecTitle,
} from '@/components/ui';
import { AdmRow, Callout, NotifItem } from '@/components/cards';
import { ACADEMIC_CAL, ADM } from '@/lib/sampleData';
import { useBootstrap } from '@/hooks/useBootstrap';
import { showToast } from '@/components/chrome';

const topic = (label: string) => {
  showToast(`${label} — coming soon`);
};

/* ============ ADMISSIONS ============ */
export function AdmissionsScreen() {
  const [open, setOpen] = useState<string | null>('UG Admissions');
  return (
    <ScreenContainer>
      <AppBar title="Admissions" sub="Courses & eligibility" />
      <div className="p-4 pb-24">
        <div className="rounded-2xl bg-tv p-5 text-white shadow-md">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-white/70"><GraduationCap size={15} /> ADMISSIONS</div>
          <div className="mt-1.5 text-[18px] font-extrabold leading-tight">Join GMC Kozhikode</div>
          <div className="mt-1 text-[12px] font-medium text-white/80">UG • PG • Super Speciality &amp; more</div>
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          {ADM.map((a) => (
            <div key={a.t} onClick={() => setOpen(open === a.t ? null : a.t)}>
              <AdmRow a={a} open={open === a.t} />
            </div>
          ))}
        </div>
        <div className="mt-4"><Callout>Admission details shown are generic. Official prospectus and schedules come from the hospital.</Callout></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ ACADEMICS ============ */
const ACAD_GRID: Array<{ icon: typeof Award; t: string }> = [
  { icon: Award, t: 'Programmes' },
  { icon: CalendarDays, t: 'Academic Calendar' },
  { icon: Megaphone, t: 'Announcements' },
  { icon: Users, t: 'Faculties' },
  { icon: BookOpen, t: 'Research' },
  { icon: GraduationCap, t: 'Students' },
];

export function AcademicsScreen() {
  const navigate = useNavigate();
  return (
    <ScreenContainer>
      <AppBar title="Academics" sub="Education at GMC Kozhikode" />
      <div className="p-4 pb-24">
        <div className="rounded-2xl bg-teal p-5 text-white shadow-md">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-white/70"><BookOpen size={15} /> ACADEMICS</div>
          <div className="mt-1.5 text-[18px] font-extrabold leading-tight">Centre of Learning</div>
          <div className="mt-1 text-[12px] font-medium text-white/80">UG, PG &amp; super speciality courses</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ACAD_GRID.map((g) => (
            <button key={g.t} onClick={() => (g.t === 'Academic Calendar' ? navigate('/academic-calendar') : topic(g.t))}
              className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-4 shadow-sm transition active:scale-95">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-plight text-p"><g.icon size={20} /></div>
              <div className="text-center text-[12px] font-bold text-ink">{g.t}</div>
            </button>
          ))}
        </div>
        <div className="mt-5"><Callout>Page under construction — content from the hospital will be added.</Callout></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ ACADEMIC CALENDAR ============ */
export function AcademicCalendarScreen() {
  return (
    <ScreenContainer>
      <AppBar title="Academic Calendar" sub="Important academic dates" />
      <div className="p-4 pb-24">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {ACADEMIC_CAL.map(([term, range]) => (
            <div key={term} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-sm">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-100 text-purple-600"><CalendarDays size={18} /></div>
              <div>
                <div className="text-[13.5px] font-bold text-ink">{term}</div>
                <div className="text-[11.5px] text-soft">{range}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3"><SampleBanner /></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ LIBRARY ============ */
export function LibraryScreen() {
  return (
    <ScreenContainer>
      <AppBar title="Library" sub="Central Library" />
      <div className="p-4 pb-24">
        <div className="flex items-center gap-3 rounded-2xl bg-p p-5 text-white shadow-md">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/25 bg-white/15"><LibraryIcon size={22} /></div>
          <div>
            <div className="text-[16px] font-extrabold">Central Library</div>
            <div className="text-[12px] font-medium text-white/75">Books, journals &amp; study spaces</div>
          </div>
        </div>
        <SecTitle>Timings</SecTitle>
        <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-1 py-1 text-[12.5px]">
            <span className="font-bold text-soft">Weekdays</span><span className="font-extrabold text-ink">Sample: 8:00 AM – 8:00 PM</span>
          </div>
          <div className="grid grid-cols-2 gap-1 border-t border-dashed border-line py-3 text-[12.5px]">
            <span className="font-bold text-soft">Weekends</span><span className="font-extrabold text-ink">Sample: 9:00 AM – 5:00 PM</span>
          </div>
          <div className="grid grid-cols-2 gap-1 border-t border-dashed border-line py-3 text-[12.5px]">
            <span className="font-bold text-soft">Membership</span><span className="font-extrabold text-ink">Students &amp; staff</span>
          </div>
        </div>
        <SecTitle>Services</SecTitle>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {['Reference desk', 'Journals', 'Digital library', 'Reprography'].map((s) => (
            <div key={s} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-[12px] font-bold text-ink shadow-sm">
              <BookOpen size={14} className="shrink-0 text-teal" /> {s}
            </div>
          ))}
        </div>
        <div className="mt-4"><SampleBanner /></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ STUDENT ============ */
export function StudentScreen() {
  return (
    <ScreenContainer>
      <AppBar title="Student" sub="Student portal" />
      <div className="p-4 pb-24">
        <div className="rounded-2xl bg-amber p-5 text-white shadow-md">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-white/70"><GraduationCap size={15} /> STUDENT PORTAL</div>
          <div className="mt-1.5 text-[18px] font-extrabold leading-tight">Secure sign-in required</div>
          <div className="mt-1 text-[12px] font-medium text-white/80">Admission, results &amp; resources</div>
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          <button onClick={() => topic('Student sign-in')} className="flex items-center gap-3 rounded-2xl bg-p p-4 text-left text-white shadow-md transition active:scale-[0.98]">
            <Shield size={20} />
            <div className="flex-1">
              <div className="text-[14px] font-extrabold">Sign in / Register</div>
              <div className="text-[11px] font-medium opacity-75">Student credentials (sample)</div>
            </div>
            <FileText size={18} className="opacity-80" />
          </button>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[{ Icon: FileText, t: 'Results' }, { Icon: Download, t: 'Downloads' }, { Icon: Video, t: 'Classes' }, { Icon: User, t: 'Profile' }].map((g) => (
              <button key={g.t} onClick={() => topic(g.t)} className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-4 shadow-sm transition active:scale-95">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-plight text-p"><g.Icon size={20} /></div>
                <div className="text-center text-[12px] font-bold text-ink">{g.t}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4"><Callout>Sample portal — student sign-in is under development.</Callout></div>
      </div>
    </ScreenContainer>
  );
}

/* ============ NOTIFICATIONS ============ */
export function NotificationsScreen() {
  const { data } = useBootstrap();
  const [items, setItems] = useState(data.notifications);
  return (
    <ScreenContainer>
      <AppBar title="Notifications" sub="In-app alerts" right={
        <button onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))} className="rounded-xl bg-plight px-3 py-1.5 text-[11px] font-extrabold text-p">Mark all read</button>
      } />
      <div className="p-4 pb-24">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {items.length === 0 && <div className="sm:col-span-2"><EmptyState title="All caught up" /></div>}
          {items.map((n) => <NotifItem key={n.t} n={n} />)}
        </div>
        <div className="mt-3"><SampleBanner /></div>
      </div>
    </ScreenContainer>
  );
}