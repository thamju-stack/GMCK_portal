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

/* ------- status bar ------- */
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
    <div className="flex h-11 shrink-0 items-center justify-between px-5 text-[13px] font-bold text-ink">
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
    <div className="pointer-events-none absolute bottom-24 right-4 z-30 flex flex-col gap-2.5">
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

/* ------- phone frame ------- */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const toasts = useToasts();
  return (
    <div className="relative mx-auto flex h-full max-w-[430px] flex-col overflow-hidden bg-bg shadow-2xl">
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

/* ------- bottom navigation (5 tabs) ------- */
const TABS = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/hospital', label: 'Hospital', Icon: Building2, end: false },
  { to: '/search', label: 'Search', Icon: Search, end: false },
  { to: '/notices', label: 'Notices', Icon: Bell, end: false },
  { to: '/profile', label: 'Profile', Icon: User, end: false },
];

export function BottomNav() {
  return (
    <nav className="h-16 shrink-0 border-t border-line bg-white/95 backdrop-blur">
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

/* ------- layout: phone + tabs + FABs (only for the 5 root tabs) ------- */
export function Layout() {
  return (
    <PhoneFrame>
      <Outlet />
      <FabWrap />
      <BottomNav />
    </PhoneFrame>
  );
}

/* ------- standalone pages (no home tabs) ------- */
export function BlankPage({ children }: { children: ReactNode }) {
  return <PhoneFrame><Outlet />{children}</PhoneFrame>;
}

export function Standalone({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[430px] bg-bg">
      <div className="no-scrollbar h-[100dvh] overflow-y-auto">{children}</div>
      <FabWrap />
    </div>
  );
}