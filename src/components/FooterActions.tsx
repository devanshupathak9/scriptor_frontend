import { useState } from 'react';

interface Props {
  allApproved: boolean;
  finalApproved: boolean;
  approvedCount: number;
  totalCount: number;
  onFinalApprove: () => void;
  onDownload: () => void;
  onCopy: () => void;
}

export default function FooterActions({
  allApproved,
  finalApproved,
  approvedCount,
  totalCount,
  onFinalApprove,
  onDownload,
  onCopy,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const remaining = totalCount - approvedCount;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-4 mb-8">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              {finalApproved ? 'Script Approved' : 'Final Review'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {approvedCount} of {totalCount} sections approved
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-800">
              {Math.round((approvedCount / totalCount) * 100)}%
            </div>
            <div className="text-xs text-slate-400">complete</div>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalCount }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                i < approvedCount ? 'bg-emerald-400' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-3">
        {!finalApproved ? (
          <button
            onClick={onFinalApprove}
            disabled={!allApproved}
            className={`w-full py-3 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              allApproved
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {allApproved ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Approve Final Script
              </>
            ) : (
              `${remaining} section${remaining !== 1 ? 's' : ''} remaining — approve all to continue`
            )}
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3.5">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.5 9l4 4 7-7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Script Approved</p>
              <p className="text-xs text-emerald-600">Ready to download and use in class</p>
            </div>
          </div>
        )}

        {finalApproved && (
          <div className="flex gap-2">
            <button
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8M4 6l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download .md
            </button>
            <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                copied
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1.5" y="4" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M4 4V2.5A1.5 1.5 0 015.5 1h7A1.5 1.5 0 0114 2.5v7A1.5 1.5 0 0112.5 11H11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Copy Markdown
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
