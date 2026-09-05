import type { ReactNode } from 'react';
import {
  AlertCircle, Building2, CalendarDays, ChevronRight, Clock, Compass,
  FlaskConical, HeartPulse, MapPin, Megaphone, Phone, ScanLine, Stethoscope,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { PAADHA_URL } from '@/components/ui';
import type { AdmItem, Department, Doctor, NavRoute, Notice, NotificationItem, ServiceTile, TestItem } from '@/types';

const ICONS: Record<ServiceTile['icon'], ReactNode> = {
  nav: <Compass size={21} />,
  doctors: <Stethoscope size={21} />,
  opd: <Clock size={21} />,
  depts: <Building2 size={21} />,
  admissions: <User size={21} />,
};

const ICON_BG: Record<ServiceTile['icon'], string> = {
  nav: 'var(--color-p)',
  doctors: 'var(--color-teal)',
  opd: 'var(--color-danger)',
  depts: 'var(--color-amber)',
  admissions: 'var(--color-tv)',
};

export function ServiceTileCard({ s }: { s: ServiceTile }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(s.to)}
      className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white px-2 py-4 shadow-sm transition active:scale-95"
    >
      <div className="grid h-11 w-11 place-items-center rounded-2xl text-white" style={{ background: ICON_BG[s.icon] }}>
        {ICONS[s.icon]}
      </div>
      <div className="text-center text-[11px] font-bold leading-tight text-ink">{s.t}</div>
    </button>
  );
}

export function DeptCard({ d, onClick }: { d: Department; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-white p-3.5 text-left shadow-sm transition active:scale-[0.99]"
    >
      <div className="min-w-0">
        <div className="truncate text-[13.5px] font-bold text-ink">{d.name}</div>
        <div className="mt-0.5 truncate text-[11.5px] text-soft">{d.desc}</div>
        <div className="mt-1.5 inline-flex rounded-full bg-pillbg px-2 py-0.5 text-[10px] font-bold text-p">{d.cat}</div>
      </div>
      <ChevronRight size={18} className="shrink-0 text-soft" />
    </button>
  );
}

export function DocCard({ doc, onClick }: { doc: Doctor; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white p-3.5 text-left shadow-sm transition active:scale-[0.99]"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal text-[15px] font-extrabold text-white">
        {(doc.name.replace('Dr. ', '').trim()[0] ?? '?').toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-bold text-ink">{doc.name}</div>
        <div className="truncate text-[11.5px] text-soft">{doc.des} • {doc.dept}</div>
      </div>
      <ChevronRight size={18} className="shrink-0 text-soft" />
    </button>
  );
}

const CAT_BG: Record<string, string> = {
  'cat-hosp': 'hsl(206 96% 94%)',
  'cat-adm': 'hsl(42 96% 94%)',
  'cat-exam': 'hsl(252 96% 94%)',
  'cat-emo': 'hsl(0 60% 94%)',
  'cat-acad': 'hsl(171 70% 92%)',
};

export function NoticeCard({ n, onClick }: { n: Notice; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-line bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wide" style={{ background: CAT_BG[n.c] ?? 'var(--color-pillbg)', color: 'var(--color-teal)' }}>
          {n.cat}
        </span>
        <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-soft">
          <CalendarDays size={12} /> {n.d}
        </span>
      </div>
      <p className="mt-2.5 text-[13.5px] font-bold leading-snug text-ink">{n.t}</p>
      <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-soft">{n.s}</p>
    </button>
  );
}

export function TestItemRow({ test, onClick }: { test: TestItem; onClick: () => void }) {
  const Lab = test.type === 'Radiology' ? ScanLine : FlaskConical;
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-3.5 py-3 text-left shadow-sm transition active:scale-[0.99]"
    >
      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{ background: test.type === 'Radiology' ? 'var(--color-tl)' : 'var(--color-plight)', color: test.type === 'Radiology' ? 'var(--color-teal)' : 'var(--color-p)' }}
      >
        <Lab size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-bold text-ink">{test.title}</div>
        <div className="mt-0.5 text-[11.5px] text-soft">{test.type} &bull; View test details</div>
      </div>
      <ChevronRight size={17} className="shrink-0 text-soft" />
    </button>
  );
}

export function AdmRow({ a, open }: { a: AdmItem; open: boolean }) {
  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${open ? 'border-p' : 'border-line'}`}>
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-tl text-teal"><User size={19} /></div>
          <div>
            <div className="text-[14px] font-bold text-ink">{a.t}</div>
            <div className="mt-0.5 text-[11.5px] text-soft">{a.d}</div>
          </div>
        </div>
        <ChevronRight size={17} className={`shrink-0 text-soft transition-transform ${open ? 'rotate-90' : ''}`} />
      </div>
      {open && (
        <div className="border-t border-dashed border-line px-4 pb-4 pt-3 text-[12.5px] leading-relaxed text-soft">{a.o}</div>
      )}
    </div>
  );
}

export function NotifItem({ n }: { n: NotificationItem }) {
  return (
    <button className="flex w-full items-start gap-3 rounded-2xl border border-line bg-white p-3.5 text-left shadow-sm transition active:scale-[0.99]">
      <div
        className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{ background: n.b, color: n.col }}
      >
        <Megaphone size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-[13.5px] font-bold text-ink">{n.t}</div>
          {n.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-danger" />}
        </div>
        <p className="mt-0.5 text-[12px] leading-snug text-soft">{n.s}</p>
        <div className="mt-1 text-[10.5px] font-bold text-soft">{n.time}</div>
      </div>
    </button>
  );
}

export function RouteCard({ r }: { r: NavRoute }) {
  const [name, block, floor, point] = r;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-sm">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-plight text-p"><MapPin size={18} /></div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-bold text-ink">{name}</div>
        <div className="mt-0.5 truncate text-[11.5px] text-soft">{block} • {floor}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[11px] font-extrabold text-teal">{point}</div>
      </div>
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-alight px-3.5 py-3 text-[12px] font-semibold leading-snug text-amber">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function CalloutGeneric({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-pillbg px-3.5 py-3 text-[12px] font-semibold leading-snug text-p">
      {icon ?? <HeartPulse size={16} className="mt-0.5 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

export function PhoneAction({ number, title }: { number: string; title: string }) {
  const isReal = /^[\d+\s-]{6,}$/.test(number) && !number.toLowerCase().includes('placeholder');
  if (isReal) {
    return (
      <a href={`tel:${number.replace(/[^\d+]/g, '')}`} className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-extrabold active:scale-[0.98]" style={{ background: 'var(--color-teal)', color: '#fff' }}>
        <Phone size={16} /> {title}
      </a>
    );
  }
  return (
    <div className="rounded-xl border border-dashed border-soft/40 px-3 py-2.5 text-center text-[12px] font-bold leading-snug text-soft">{number}</div>
  );
}

export function MapCta() {
  return (
    <a
      href={PAADHA_URL}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-around gap-2 rounded-2xl bg-p p-4 text-white shadow-md transition active:scale-[0.99]"
    >
      <MapPin size={22} />
      <div className="flex-1">
        <div className="text-[14px] font-extrabold">Hospital Map</div>
        <div className="text-[11px] font-semibold opacity-80">Paadha • Digital indoor map</div>
      </div>
      <ChevronRight size={20} />
    </a>
  );
}