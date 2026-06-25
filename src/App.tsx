import { useState } from 'react';
import Header from './components/Header';
import BriefForm from './components/BriefForm';
import LoadingState from './components/LoadingState';
import ScriptViewer from './components/ScriptViewer';
import RegenerateModal from './components/RegenerateModal';
import { Brief, Script, Segment } from './types';
import * as api from './api/client';

interface RegenState {
  open: boolean;
  segmentId: string;
  segmentTitle: string;
}

export default function App() {
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalApproved, setFinalApproved] = useState(false);
  const [regen, setRegen] = useState<RegenState>({ open: false, segmentId: '', segmentTitle: '' });
  const [regenLoading, setRegenLoading] = useState(false);

  const handleGenerate = async (brief: Brief) => {
    setLoading(true);
    setError(null);
    setScript(null);
    setFinalApproved(false);
    try {
      const result = await api.generateScript(brief);
      setScript(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate script. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const patchSegment = (updated: Segment) => {
    if (!script) return;
    setScript({ ...script, segments: script.segments.map((s) => (s.id === updated.id ? updated : s)) });
  };

  const handleApproveSegment = (id: string) => {
    if (!script) return;
    setScript({ ...script, segments: script.segments.map((s) => (s.id === id ? { ...s, approved: true } : s)) });
  };

  const handleOpenRegen = (segmentId: string, segmentTitle: string) => {
    setRegen({ open: true, segmentId, segmentTitle });
  };

  const handleRegen = async (feedback: string) => {
    if (!script) return;
    setRegenLoading(true);
    try {
      const updated = await api.regenerateSegment(script.script_id, regen.segmentId, feedback);
      patchSegment(updated);
      setRegen({ open: false, segmentId: '', segmentTitle: '' });
    } catch (e) {
      console.error('Regeneration failed:', e);
    } finally {
      setRegenLoading(false);
    }
  };

  const handleFinalApprove = async () => {
    if (!script) return;
    try {
      await api.approveScript(script.script_id);
      setFinalApproved(true);
    } catch (e) {
      console.error('Approval failed:', e);
    }
  };

  const buildMarkdown = (s: Script): string => {
    const lines: string[] = [
      `# ${s.topic}`,
      '',
      `**Duration:** ${s.metadata.duration} min | **Audience:** ${s.metadata.beginner_pct}% Beginner / ${s.metadata.advanced_pct}% Advanced | **Content/Code:** ${s.metadata.content_pct}%/${s.metadata.code_pct}%`,
      '',
      '---',
      '',
    ];
    for (const seg of s.segments) {
      lines.push(`## ${seg.title} *(${seg.estimated_time} min)*`);
      lines.push('');
      lines.push(seg.content.trim());
      lines.push('');
      if (seg.checkpoint) {
        lines.push(`> **Checkpoint:** ${seg.checkpoint}`);
        lines.push('');
      }
      lines.push('---');
      lines.push('');
    }
    return lines.join('\n');
  };

  const handleDownload = () => {
    if (!script) return;
    const md = buildMarkdown(script);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.topic.toLowerCase().replace(/\s+/g, '-')}-script.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!script) return;
    navigator.clipboard.writeText(buildMarkdown(script)).catch(console.error);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — brief form */}
        <aside className="w-[340px] min-w-[300px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <BriefForm onGenerate={handleGenerate} loading={loading} />
        </aside>

        {/* Right panel — script viewer */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-slate-50">
          {error && (
            <div className="mx-6 mt-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-red-800 mb-0.5">Generation failed</p>
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            </div>
          )}

          {loading && <LoadingState />}

          {!loading && !script && !error && <EmptyState />}

          {!loading && script && (
            <ScriptViewer
              script={script}
              finalApproved={finalApproved}
              onApproveSegment={handleApproveSegment}
              onOpenRegen={handleOpenRegen}
              onSegmentEdit={patchSegment}
              onFinalApprove={handleFinalApprove}
              onDownload={handleDownload}
              onCopy={handleCopy}
            />
          )}
        </main>
      </div>

      {regen.open && (
        <RegenerateModal
          segmentTitle={regen.segmentTitle}
          loading={regenLoading}
          onClose={() => setRegen({ open: false, segmentId: '', segmentTitle: '' })}
          onRegenerate={handleRegen}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 select-none">
      <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-2">No script yet</h3>
      <p className="text-sm text-slate-400 max-w-[240px] leading-relaxed">
        Fill in the instructor brief and click{' '}
        <span className="font-semibold text-indigo-500">Generate Script</span> to get started.
      </p>

      <div className="mt-8 flex flex-col gap-2 text-left w-full max-w-xs">
        {['Fill in topic & agenda', 'Set audience split & duration', 'Click Generate Script', 'Review, edit & approve sections', 'Download final Markdown'].map(
          (step, i) => (
            <div key={i} className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-500 flex-shrink-0">
                {i + 1}
              </div>
              {step}
            </div>
          )
        )}
      </div>
    </div>
  );
}
