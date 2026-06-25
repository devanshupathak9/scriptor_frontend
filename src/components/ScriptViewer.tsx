import { Script, Segment } from '../types';
import MetadataCard from './MetadataCard';
import ValidationCard from './ValidationCard';
import SegmentCard from './SegmentCard';
import FooterActions from './FooterActions';

interface Props {
  script: Script;
  finalApproved: boolean;
  onApproveSegment: (id: string) => void;
  onOpenRegen: (id: string, title: string) => void;
  onSegmentEdit: (segment: Segment) => void;
  onFinalApprove: () => void;
  onDownload: () => void;
  onCopy: () => void;
}

export default function ScriptViewer({
  script,
  finalApproved,
  onApproveSegment,
  onOpenRegen,
  onSegmentEdit,
  onFinalApprove,
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
        <span className="text-xs text-slate-400 font-medium">
          {approvedCount}/{script.segments.length} approved
        </span>
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
        approvedCount={approvedCount}
        totalCount={script.segments.length}
        onFinalApprove={onFinalApprove}
        onDownload={onDownload}
        onCopy={onCopy}
      />
    </div>
  );
}
