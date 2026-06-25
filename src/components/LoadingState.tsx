import { useState, useEffect } from 'react';

const STEPS = [
  { label: 'Parsing brief & agenda', ms: 700 },
  { label: 'Planning structure', ms: 1100 },
  { label: 'Generating sections', ms: 1800 },
  { label: 'Validating output', ms: 700 },
  { label: 'Finalizing script', ms: 500 },
];

export default function LoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i < STEPS.length - 1) {
        setTimeout(() => {
          i++;
          setStep(i);
          tick();
        }, STEPS[i].ms);
      }
    };
    tick();
  }, []);

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-xs px-8">
        <div className="flex items-center gap-3 mb-7">
          <div className="relative w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="animate-spin w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Generating Script</p>
            <p className="text-xs text-slate-400 mt-0.5">Drafting your class from the brief…</p>
          </div>
        </div>

        <div className="space-y-2.5 mb-6">
          {STEPS.map((s, idx) => {
            const done = idx < step;
            const active = idx === step;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  done ? 'opacity-100' : active ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {done ? (
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : active ? (
                    <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ${done ? 'text-emerald-700' : active ? 'text-slate-800' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
          <div
            className="bg-indigo-500 h-1 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2 text-right">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
