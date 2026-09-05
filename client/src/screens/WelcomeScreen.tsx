import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setSplash(false), 2200);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="relative min-h-screen min-h-[100dvh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/gmc-logo.webp')" }}
      />
      <div className="welcome-fade absolute inset-0" />

      {splash && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#071c33]">
          <div className="animate-wfade flex flex-col items-center">
            <div className="text-2xl font-black tracking-widest text-teal">GMC</div>
            <div className="mt-1 text-[10px] font-bold tracking-[0.4em] text-white/60">KOZHIKODE</div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex min-h-screen min-h-[100dvh] flex-col justify-between p-6 pb-9">
        <div className="animate-wfade" style={{ animationDelay: '0.2s' }}>
          <div className="mt-4 w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[0.25em] text-white/80 backdrop-blur">
            GOVT. &bull; DEPT. OF HEALTH
          </div>
        </div>

        <div className="animate-wfade">
          <h1 className="text-[13px] font-extrabold leading-relaxed tracking-[0.3em] text-white/90">
            GOVERNMENT MEDICAL COLLEGE
            <br />
            KOZHIKODE
          </h1>
          <div className="mt-3 text-4xl font-black leading-none tracking-wide text-white">
            GMC
            <span className="text-teal"> KOZHIKODE</span>
          </div>
          <p className="mt-3 text-[13px] font-semibold leading-relaxed text-white/70">
            One Home for GMC Kozhikode
          </p>
          <p className="mt-1 text-[11.5px] font-semibold tracking-wide text-white/50">
            Healthcare &bull; Education &bull; Research
          </p>

          <button
            onClick={() => navigate('/language')}
            className="mt-8 w-full rounded-2xl bg-teal py-3.5 text-[14px] font-extrabold text-white shadow-lg shadow-teal/30 transition active:scale-[0.98]"
          >
            Continue
          </button>
          <p className="mt-3 text-center text-[10.5px] font-medium text-white/50">
            First visit &bull; choose your preferred language
          </p>
        </div>
      </div>
    </div>
  );
}