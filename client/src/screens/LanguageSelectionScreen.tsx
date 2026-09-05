import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ScreenContainer } from '@/components/ui';
import { useLanguage } from '@/hooks/useLanguage';

/* The exact globe glyph used across the portal */
export const GlobeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden
  >
    <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

function Card({
  title,
  subtext,
  icon,
  iconBg,
  iconColor,
  highlighted,
  onClick,
}: {
  title: string;
  subtext?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  highlighted?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
        highlighted ? 'border-2 border-p bg-pillbg' : 'border-line bg-white'
      }`}
    >
      {icon && (
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-bold ${highlighted ? 'text-p' : 'text-ink'}`}>{title}</div>
        {subtext && <div className="mt-0.5 text-xs text-soft">{subtext}</div>}
      </div>
      <span className="text-soft">›</span>
    </button>
  );
}

export default function LanguageSelectionScreen() {
  const navigate = useNavigate();
  const { setLanguage, completeOnboarding, t } = useLanguage();
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShowCta(true), 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="gradient-language flex min-h-screen min-h-[100dvh] flex-col">
      <ScreenContainer className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
          <div
            className={`transition-all duration-700 ${
              showCta ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <div className="text-2xl font-extrabold leading-tight tracking-wider text-white">
              {t('languageSelection.title')}
            </div>
            <div className="mx-auto mt-2 max-w-[250px] text-[13px] font-semibold text-white/70">
              {t('languageSelection.subtitle')}
            </div>
          </div>

          <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
            {(['en', 'ml', 'hi'] as const).map((code) => (
              <div key={code} className="animate-langin">
                <Card
                  title={t(`languageSelection.${code === 'en' ? 'english' : code === 'ml' ? 'malayalam' : 'hindi'}`)}
                  subtext={t(`languageSelection.${code === 'en' ? 'englishLabel' : code === 'ml' ? 'malayalamLabel' : 'hindiLabel'}`)}
                  icon={<GlobeIcon />}
                  iconBg="#fff"
                  iconColor="#1267b2"
                  highlighted={code === 'en'}
                  onClick={() => setLanguage(code)}
                />
              </div>
            ))}
          </div>

          <div
            className={`mt-10 transition-all duration-700 ${
              showCta ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <button
              onClick={() => {
                completeOnboarding();
                navigate('/');
              }}
              className="rounded-2xl bg-white px-8 py-3.5 text-sm font-extrabold text-p transition active:scale-95"
            >
              {t('languageSelection.continue')}
            </button>
            <button
              onClick={() => navigate('/welcome')}
              className="mx-auto mt-4 block text-xs font-semibold text-white/70"
            >
              {t('languageSelection.back')}
            </button>
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
}