import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Segment } from '../types';

interface Props {
  segment: Segment;
  index: number;
  onApprove: (id: string) => void;
  onRegenerate: (id: string, title: string) => void;
  onEdit: (segment: Segment) => void;
}

export default function SegmentCard({ segment, index, onApprove, onRegenerate, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(segment.content);
  const [showRationale, setShowRationale] = useState(false);

  const save = () => {
    onEdit({ ...segment, content: draft });
    setEditing(false);
  };

  const cancel = () => {
    setDraft(segment.content);
    setEditing(false);
  };

  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden mb-4 transition-all duration-200 ${
        segment.approved
          ? 'border-emerald-200 shadow-sm shadow-emerald-50'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-5 py-3.5 border-b ${
          segment.approved ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              segment.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-600'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate">{segment.title}</h3>
            <p className="text-xs text-slate-400">{segment.estimated_time} min</p>
          </div>
        </div>

        {segment.approved && (
          <span className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Approved
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        {editing ? (
          <div className="space-y-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={14}
              className="w-full text-xs font-mono bg-slate-950 text-slate-100 border border-slate-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed"
              spellCheck={false}
            />
            <div className="flex gap-2">
              <button onClick={save} className="btn-primary text-xs px-3 py-1.5">
                Save Changes
              </button>
              <button onClick={cancel} className="btn-secondary text-xs px-3 py-1.5">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-700 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre({ children }) {
                  return <>{children}</>;
                },
                code({ children, className }) {
                  const hasLang = Boolean(className);
                  const content = String(children).replace(/\n$/, '');
                  if (hasLang || content.includes('\n')) {
                    return (
                      <pre className="bg-slate-950 text-emerald-300 rounded-xl px-4 py-3.5 overflow-x-auto text-xs font-mono my-3 leading-relaxed border border-slate-800">
                        <code>{content}</code>
                      </pre>
                    );
                  }
                  return (
                    <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded-md text-xs font-mono">
                      {children}
                    </code>
                  );
                },
                h2({ children }) {
                  return <h2 className="text-base font-bold text-slate-900 mt-0 mb-3">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-sm font-semibold text-slate-700 mt-4 mb-2">{children}</h3>;
                },
                p({ children }) {
                  return <p className="text-sm text-slate-600 mb-3 leading-relaxed">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="space-y-1 mb-3 pl-1">{children}</ul>;
                },
                li({ children }) {
                  return (
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-indigo-400 mt-1.5 flex-shrink-0">•</span>
                      <span>{children}</span>
                    </li>
                  );
                },
                ol({ children }) {
                  return <ol className="space-y-1 mb-3 pl-1 list-decimal list-inside">{children}</ol>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-indigo-300 bg-indigo-50 pl-4 pr-3 py-3 rounded-r-xl my-3 text-slate-600 text-sm italic">
                      {children}
                    </blockquote>
                  );
                },
                strong({ children }) {
                  return <strong className="font-semibold text-slate-800">{children}</strong>;
                },
                hr() {
                  return <hr className="border-slate-100 my-4" />;
                },
              }}
            >
              {segment.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Rationale */}
      {!editing && segment.rationale && (
        <div className="px-5 pb-3">
          <button
            onClick={() => setShowRationale(!showRationale)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              className={`w-3 h-3 transition-transform ${showRationale ? 'rotate-90' : ''}`}
              viewBox="0 0 12 12"
              fill="none"
            >
              <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Author's rationale
          </button>
          {showRationale && (
            <div className="mt-2 text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 italic leading-relaxed">
              {segment.rationale}
            </div>
          )}
        </div>
      )}

      {/* Checkpoint */}
      {!editing && segment.checkpoint && (
        <div className="px-5 pb-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#6366F1" strokeWidth="1.5" />
                <path d="M7 4.5v3" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="9.5" r="0.5" fill="#6366F1" />
              </svg>
              <span className="text-xs font-semibold text-indigo-700">Comprehension Check</span>
            </div>
            <p className="text-xs text-indigo-600 leading-relaxed">{segment.checkpoint}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      {!editing && (
        <div className="flex items-center gap-2 px-5 py-3.5 bg-slate-50 border-t border-slate-100">
          <ActionBtn
            onClick={() => setEditing(true)}
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8.5 1.5l2 2L4 10H2v-2L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="Edit"
          />
          <ActionBtn
            onClick={() => onRegenerate(segment.id, segment.title)}
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M10 6a4 4 0 11-7-2.65M2 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="Regenerate"
          />
          {!segment.approved && (
            <button
              onClick={() => onApprove(segment.id)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 active:bg-emerald-200 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Approve
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}
