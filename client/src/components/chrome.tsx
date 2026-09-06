import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  Ambulance, BatteryFull, Bell, Building2, Home as HomeIcon,
  MapPin, Search, Signal, User, Wifi,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

/* ------- toast ------- */
type Toast = { id: number; msg: string };
let seq = 0;
let activeToasts: Toast[] = [];
let listeners: Array<(t: Toast[]) => void> = [];

export function showToast(msg: string) {
  const id = ++seq;
  activeToasts = [...activeToasts, { id, msg }];
  listeners.forEach((l) => l(activeToasts));
  setTimeout(() => {
    activeToasts = activeToasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(activeToasts));
  }, 2600);
}

function useToasts() {
  const [list, setList] = useState<Toast[]>([]);
  useEffect(() => {
    listeners.push(setList);
    return () => {
      listeners = listeners.filter((l) => l !== setList);
    };
  }, []);
  return list;
}

/* ------- status bar (mobile only — desktop has real browser chrome) ------- */
function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function StatusBar() {
  const now = useClock();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return (
    <div className="flex h-11 shrink-0 items-center justify-between px-5 text-[13px] font-bold text-ink md:hidden">
      <span>{`${hh}:${mm}`}</span>
      <div className="flex items-center gap-1.5">
        <Wifi size={15} strokeWidth={2.5} />
        <Signal size={15} strokeWidth={2.5} />
        <BatteryFull size={18} strokeWidth={2.2} className="text-teal" />
      </div>
    </div>
  );
}

/* ------- floating action buttons ------- */
function FabWrap() {
  const navigate = useNavigate();
  return (
    <div className="pointer-events-none absolute bottom-24 right-4 z-30 flex flex-col gap-2.5 md:bottom-6">
      <button
        aria-label="Hospital map"
        onClick={() => navigate('/map')}
        className="pointer-events-auto grid h-12 w-12 place-items-center rounded-2xl bg-p text-white shadow-lg transition active:scale-90"
      >
        <MapPin size={21} />
      </button>
      <button
        aria-label="Emergency"
        onClick={() => navigate('/emergency')}
        className="pointer-events-auto grid h-12 w-12 place-items-center rounded-2xl bg-danger text-white shadow-lg transition active:scale-90"
      >
        <Ambulance size={21} />
      </button>
    </div>
  );
}

/* ------- phone frame: full-bleed on mobile, a centered device-like panel on desktop ------- */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const toasts = useToasts();
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-bg shadow-2xl md:h-[min(860px,100%)] md:max-w-4xl md:rounded-[28px] md:border md:border-line">
      <StatusBar />
      {children}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="rounded-xl bg-ink/95 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-xl">
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------- primary nav (5 tabs): bottom bar on mobile, sidebar on desktop ------- */
const TABS = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/hospital', label: 'Hospital', Icon: Building2, end: false },
  { to: '/search', label: 'Search', Icon: Search, end: false },
  { to: '/notices', label: 'Notices', Icon: Bell, end: false },
  { to: '/profile', label: 'Profile', Icon: User, end: false },
];

export function BottomNav() {
  return (
    <nav className="h-16 shrink-0 border-t border-line bg-white/95 backdrop-blur md:hidden">
      <div className="grid h-full grid-cols-5 px-1">
        {TABS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 rounded-xl text-[10.5px] font-bold transition ${
                isActive ? 'text-p' : 'text-soft'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={21} strokeWidth={isActive ? 2.4 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function SidebarNav() {
  return (
    <nav className="hidden w-64 shrink-0 flex-col border-r border-line bg-white/70 backdrop-blur md:flex">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-p text-white">
          <Building2 size={20} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-extrabold text-ink">GMC Kozhikode</div>
          <div className="truncate text-[11px] font-semibold text-soft">Hospital Portal</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3">
        {TABS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-bold transition ${
                isActive ? 'bg-plight text-p' : 'text-soft hover:bg-bg'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </div>
      <div className="flex flex-col gap-1 border-t border-line p-3">
        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-bold transition ${
              isActive ? 'bg-plight text-p' : 'text-p hover:bg-plight'
            }`
          }
        >
          <MapPin size={18} /> Hospital Map
        </NavLink>
        <NavLink
          to="/emergency"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-bold transition ${
              isActive ? 'bg-dlight text-danger' : 'text-danger hover:bg-dlight'
            }`
          }
        >
          <Ambulance size={18} /> Emergency
        </NavLink>
      </div>
    </nav>
  );
}

/* ------- app frame: sidebar (desktop) + centered phone panel ------- */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      <SidebarNav />
      <div className="grid min-w-0 flex-1 md:place-items-center md:bg-[linear-gradient(180deg,#e9f1fa,#dbe7f5)] md:p-6">
        {children}
      </div>
    </div>
  );
}

/* ------- layout: phone + tabs + FABs (only for the 5 root tabs) ------- */
export function Layout() {
  return (
    <AppFrame>
      <PhoneFrame>
        <Outlet />
        <FabWrap />
        <BottomNav />
      </PhoneFrame>
    </AppFrame>
  );
}

/* ------- standalone pages (no home tabs) ------- */
export function BlankPage({ children }: { children: ReactNode }) {
  return (
    <AppFrame>
      <PhoneFrame><Outlet />{children}</PhoneFrame>
    </AppFrame>
  );
}

export function Standalone({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[430px] bg-bg">
      <div className="no-scrollbar h-[100dvh] overflow-y-auto">{children}</div>
      <FabWrap />
    </div>
  );
}
