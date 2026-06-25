export interface Brief {
  topic: string;
  agenda: string[];
  beginner_pct: number;
  advanced_pct: number;
  duration: number;
  content_pct: number;
  code_pct: number;
  prior_topics: string[];
}

export interface Segment {
  id: string;
  title: string;
  estimated_time: number;
  content: string;
  rationale: string;
  checkpoint: string | null;
  approved: boolean;
}

export interface ValidationResult {
  agenda_coverage: boolean;
  timing_ok: boolean;
  code_ratio_ok: boolean;
  prior_topics_ok: boolean;
  llm_score: number;
}

export interface ScriptMetadata {
  duration: number;
  beginner_pct: number;
  advanced_pct: number;
  content_pct: number;
  code_pct: number;
  generated_at: string;
  total_time_generated?: number;
}

export interface Script {
  script_id: string;
  topic: string;
  metadata: ScriptMetadata;
  validation: ValidationResult;
  segments: Segment[];
}
