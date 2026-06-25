import { useState } from 'react';
import { ValidationResult } from '../types';

interface Props {
  validation: ValidationResult;
}

const checks: { key: keyof Omit<ValidationResult, 'llm_score'>; label: string }[] = [
  { key: 'agenda_coverage', label: 'Agenda Coverage' },
  { key: 'timing_ok', label: 'Timing Budget' },
  { key: 'code_ratio_ok', label: 'Code Ratio' },
  { key: 'prior_topics_ok', label: 'Prior Topics' },
];

export default function ValidationCard({ validation }: Props) {
  const [open, setOpen] = useState(false);
  const score = validation.llm_score;
  const allPassed = checks.every((c) => validation[c.key]);
  const scoreColor = score >= 4.5 ? 'text-emerald-600' : score >= 3.5 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${allPassed ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Validation</span>
          <div className="hidden sm:flex items-center gap-1">
            {checks.map((c) => (
              <CheckDot key={c.key} ok={validation[c.key]} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">LLM Score</span>
            <span className={`text-sm font-bold ${scoreColor}`}>{score.toFixed(1)}</span>
            <span className="text-xs text-slate-300">/5</span>
          </div>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {checks.map((c) => (
              <CheckRow key={c.key} label={c.label} ok={validation[c.key]} />
            ))}
          </div>
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">LLM Evaluation Score</span>
              <span className={`text-sm font-bold ${scoreColor}`}>{score.toFixed(1)} / 5</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    i <= Math.round(score) ? 'bg-emerald-400' : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckDot({ ok }: { ok: boolean }) {
  return (
    <div className={`w-2 h-2 rounded-full ${ok ? 'bg-emerald-400' : 'bg-red-400'}`} />
  );
}

function CheckRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${ok ? 'text-emerald-700' : 'text-red-600'}`}>
      {ok ? (
        <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l1.5 1.5 3.5-3.5" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : (
        <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M2.5 2.5l3 3M5.5 2.5l-3 3" stroke="#DC2626" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {label}
    </div>
  );
}
