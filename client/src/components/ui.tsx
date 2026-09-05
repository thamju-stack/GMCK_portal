import type { ReactNode } from 'react';
import { ArrowLeft, ChevronRight, Search, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* Phone-frame scroll area */
export function ScreenContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <main className={`no-scrollbar flex-1 min-h-0 overflow-y-auto ${className}`}>
      {children}
    </main>
  );
}

export const PAADHA_URL = 'https://maps.paadha.com/';

export function AppBar({
  title,
  sub,
  right,
  onBack,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  onBack?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white/90 px-4 pb-3 pt-2 backdrop-blur">
      <button
        aria-label="Back"
        onClick={onBack ?? (() => navigate(-1))}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-pillbg text-ink active:scale-95"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-bold text-ink">{title}</div>
        {sub && <div className="truncate text-[11px] font-medium text-soft">{sub}</div>}
      </div>
      {right ?? <div className="w-9" />}
    </header>
  );
}

export function SecTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2 mt-5 flex items-center justify-between px-1">
      <h2 className="text-[13px] font-bold tracking-wide text-soft">{children}</h2>
      {right}
    </div>
  );
}

export function Chip({
  label,
  active,
  onClick,
}: {
  label: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition active:scale-95 ${
        active
          ? 'border-p bg-p text-white'
          : 'border-line bg-white text-soft'
      }`}
    >
      {label}
    </button>
  );
}

export function Card({
  title,
  subtext,
  icon,
  iconBg,
  iconColor,
  highlighted,
  onClick,
  className,
  children,
}: {
  title: ReactNode;
  subtext?: ReactNode;
  icon?: ReactNode;
  iconBg?: string;
  iconColor?: string;
  highlighted?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
        highlighted
          ? 'border-p bg-plight shadow-sm'
          : 'border-line bg-white shadow-sm'
      } ${className ?? ''}`}
    >
      {icon && (
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
          style={{ background: iconBg ?? '#eef4fb', color: iconColor ?? '#1267b2' }}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[14.5px] font-bold text-ink">{title}</div>
        {subtext && <div className="mt-0.5 text-[12.5px] leading-snug text-soft">{subtext}</div>}
      </div>
      {children ??
        (onClick && <ChevronRight size={18} className="shrink-0 text-soft" />)}
    </Tag>
  );
}

export function InfoRow({
  icon,
  iconBg,
  iconColor,
  title,
  sub,
  onClick,
}: {
  icon?: ReactNode;
  iconBg?: string;
  iconColor?: string;
  title: ReactNode;
  sub?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-3.5 py-3 text-left shadow-sm transition active:scale-[0.99]"
    >
      {icon && (
        <div
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
          style={{ background: iconBg ?? 'var(--color-plight)', color: iconColor ?? 'var(--color-p)' }}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-bold text-ink">{title}</div>
        {sub && <div className="mt-0.5 truncate text-[11.5px] text-soft">{sub}</div>}
      </div>
      {onClick && <ChevronRight size={17} className="shrink-0 text-soft" />}
    </button>
  );
}

export function InfoCard({
  icon,
  title,
  rows,
}: {
  icon: LucideIcon;
  title: string;
  rows: Array<[string, string]>;
}) {
  const I = icon;
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[13.5px] font-bold text-ink">
        <span className="text-teal"><I size={17} /></span>
        {title}
      </div>
      <div className="mt-2.5 divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-3 py-2 text-[12.5px]">
            <span className="shrink-0 font-semibold text-soft">{k}</span>
            <span className="text-right font-bold text-ink">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-6 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pillbg text-p"><Search size={22} /></div>
      <div className="mt-2 text-[14px] font-bold text-ink">{title}</div>
      {sub && <div className="text-[12.5px] text-soft">{sub}</div>}
    </div>
  );
}

export function SampleBanner({ text }: { text?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-amber/50 bg-alight px-3.5 py-2.5 text-[11.5px] font-semibold leading-snug text-amber">
      {text ?? 'Showing placeholder / sample data. Official content is populated by the hospital through the admin portal.'}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-[12px] font-bold text-soft">{children}</label>;
}

export function Input({
  className = '',
  icon,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-soft">
          {icon}
        </span>
      )}
      <input
        {...rest}
        className={`w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none placeholder:text-soft/60 focus:border-p ${icon ? 'pl-10' : ''} ${className}`}
      />
    </div>
  );
}

export function Select({ className = '', ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...rest}
      className={`w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-p ${className}`}
    />
  );
}

export function TextArea({ className = '', ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...rest}
      className={`w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none placeholder:text-soft/60 focus:border-p ${className}`}
    />
  );
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'teal' }) {
  const styles = {
    primary: 'bg-p text-white active:bg-p/85',
    teal: 'bg-teal text-white active:bg-teal/85',
    ghost: 'bg-pillbg text-p active:bg-p/10',
  }[variant];
  return (
    <button
      {...rest}
      className={`w-full rounded-xl py-3 text-[14px] font-bold transition active:scale-[0.99] ${styles} ${className}`}
    >
      {children}
    </button>
  );
}