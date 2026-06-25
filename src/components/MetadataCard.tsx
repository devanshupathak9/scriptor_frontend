import { ScriptMetadata } from '../types';

interface Props {
  topic: string;
  metadata: ScriptMetadata;
}

export default function MetadataCard({ topic, metadata }: Props) {
  const dt = new Date(metadata.generated_at);
  const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = dt.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 leading-tight truncate">{topic}</h2>
          <p className="text-xs text-slate-400 mt-1">Generated {date} at {time}</p>
        </div>
        <span className="flex-shrink-0 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Draft Ready
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        <StatBox label="Duration" value={`${metadata.duration} min`} />
        <StatBox label="Beginner" value={`${metadata.beginner_pct}%`} />
        <StatBox label="Advanced" value={`${metadata.advanced_pct}%`} />
        <StatBox label="Code" value={`${metadata.code_pct}%`} />
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600"
            style={{ width: `${metadata.beginner_pct}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">audience</span>
        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
            style={{ width: `${metadata.content_pct}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">content/code</span>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
      <div className="text-sm font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
    </div>
  );
}
