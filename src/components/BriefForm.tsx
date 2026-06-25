import { useState } from 'react';
import { Brief } from '../types';

interface Props {
  onGenerate: (brief: Brief) => void;
  loading: boolean;
}

export default function BriefForm({ onGenerate, loading }: Props) {
  const [topic, setTopic] = useState('PostgreSQL Indexing');
  const [agendaText, setAgendaText] = useState(
    'Why Indexes Exist\nB-Tree Internals\nHash Indexes\nComposite Indexes\nQuery Planner Basics'
  );
  const [beginnerPct, setBeginnerPct] = useState(70);
  const [duration, setDuration] = useState(90);
  const [contentPct, setContentPct] = useState(60);
  const [priorTopicsText, setPriorTopicsText] = useState('Basic SQL\nSELECT queries\nWHERE clauses\nJOINs');

  const advancedPct = 100 - beginnerPct;
  const codePct = 100 - contentPct;
  const agendaCount = agendaText.split('\n').filter((l) => l.trim()).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const agenda = agendaText.split('\n').map((s) => s.trim()).filter(Boolean);
    const prior_topics = priorTopicsText.split('\n').map((s) => s.trim()).filter(Boolean);
    onGenerate({
      topic,
      agenda,
      beginner_pct: beginnerPct,
      advanced_pct: advancedPct,
      duration,
      content_pct: contentPct,
      code_pct: codePct,
      prior_topics,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">Instructor Brief</h2>
        <p className="text-xs text-slate-400 mt-0.5">Fill in the details to generate a class script</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-5">
        {/* Topic */}
        <Field label="Topic" hint="The subject of this session">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. PostgreSQL Indexing"
            required
            className="input"
          />
        </Field>

        {/* Agenda */}
        <Field label="Agenda" hint={`${agendaCount} item${agendaCount !== 1 ? 's' : ''} · one per line`}>
          <textarea
            value={agendaText}
            onChange={(e) => setAgendaText(e.target.value)}
            placeholder={'Why Indexes\nB-Tree\nHash Index'}
            rows={6}
            required
            className="input resize-none"
          />
        </Field>

        {/* Audience Split */}
        <div>
          <label className="field-label">Audience Split</label>
          <div className="mt-2 space-y-2">
            <input
              type="range"
              min={0}
              max={100}
              value={beginnerPct}
              onChange={(e) => setBeginnerPct(Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 rounded-full"
            />
            <div className="grid grid-cols-2 gap-2">
              <Pill label="Beginner" value={beginnerPct} color="indigo" />
              <Pill label="Advanced" value={advancedPct} color="violet" />
            </div>
          </div>
        </div>

        {/* Duration */}
        <Field label="Duration" hint="Total session length in minutes">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={15}
              max={240}
              required
              className="input"
            />
            <span className="text-xs text-slate-400 whitespace-nowrap font-medium">min</span>
          </div>
        </Field>

        {/* Content vs Code */}
        <div>
          <label className="field-label">Content vs Code</label>
          <div className="mt-2 space-y-2">
            <input
              type="range"
              min={0}
              max={100}
              value={contentPct}
              onChange={(e) => setContentPct(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 rounded-full"
            />
            <div className="grid grid-cols-2 gap-2">
              <Pill label="Content" value={contentPct} color="blue" />
              <Pill label="Code" value={codePct} color="purple" />
            </div>
          </div>
        </div>

        {/* Prior Topics */}
        <Field label="Prior Topics" hint="Optional · topics already covered" optional>
          <textarea
            value={priorTopicsText}
            onChange={(e) => setPriorTopicsText(e.target.value)}
            placeholder={'Basic SQL\nSELECT\nWHERE'}
            rows={4}
            className="input resize-none"
          />
        </Field>
      </div>

      <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 text-white text-sm font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate Script
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="field-label">
          {label}
          {optional && <span className="ml-1 text-slate-400 font-normal normal-case tracking-normal">optional</span>}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Pill({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-700',
    violet: 'bg-violet-50 text-violet-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${colors[color]}`}>
      <span className="text-xs font-medium">{label}</span>
      <span className="text-sm font-bold">{value}%</span>
    </div>
  );
}
