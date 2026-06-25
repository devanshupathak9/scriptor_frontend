import { Script, Segment } from '../types';
import MetadataCard from './MetadataCard';
import ValidationCard from './ValidationCard';
import SegmentCard from './SegmentCard';
import FooterActions from './FooterActions';

interface Props {
  script: Script;
  finalApproved: boolean;
  suggestion: string;
  onApproveSegment: (id: string) => void;
  onApproveAll: () => void;
  onOpenRegen: (id: string, title: string) => void;
  onSegmentEdit: (segment: Segment) => void;
  onFinalApprove: () => void;
  onRegenerateFull: () => void;
  onDownload: () => void;
  onCopy: () => void;
}

export default function ScriptViewer({
  script,
  finalApproved,
  suggestion,
  onApproveSegment,
  onApproveAll,
  onOpenRegen,
  onSegmentEdit,
  onFinalApprove,
  onRegenerateFull,
  onDownload,
  onCopy,
}: Props) {
  const approvedCount = script.segments.filter((s) => s.approved).length;
  const allApproved = approvedCount === script.segments.length;

  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      <MetadataCard topic={script.topic} metadata={script.metadata} />
      <ValidationCard validation={script.validation} />

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Script Sections ({script.segments.length})
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">
            {approvedCount}/{script.segments.length} approved
          </span>
          {!allApproved && (
            <button
              onClick={onApproveAll}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2 2 5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Approve All
            </button>
          )}
        </div>
      </div>

      {script.segments.map((seg, idx) => (
        <SegmentCard
          key={seg.id}
          segment={seg}
          index={idx}
          onApprove={onApproveSegment}
          onRegenerate={onOpenRegen}
          onEdit={onSegmentEdit}
        />
      ))}

      <FooterActions
        allApproved={allApproved}
        finalApproved={finalApproved}
        suggestion={suggestion}
        approvedCount={approvedCount}
        totalCount={script.segments.length}
        onFinalApprove={onFinalApprove}
        onRegenerateFull={onRegenerateFull}
        onDownload={onDownload}
        onCopy={onCopy}
      />
    </div>
  );
}
