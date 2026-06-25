# Drafter Frontend — Claude Code Context

## Stack
- React 18 + TypeScript
- Vite (dev server on port 3000)
- Tailwind CSS v3
- react-markdown + remark-gfm (markdown rendering)

## Run
```bash
npm install      # first time only
npm run dev      # http://localhost:3000
npm run build    # production build
```

Backend must be running on `http://localhost:8000` (or set `VITE_API_URL` env var).

## Src Structure
```
src/
├── App.tsx              # Root — all app state lives here, passes props down
├── main.tsx             # React DOM entry point
├── index.css            # Tailwind directives + .input / .btn-* / .field-label component classes
├── types/
│   └── index.ts         # All shared TS types: Brief, Segment, Script, ValidationResult, ScriptMetadata
├── api/
│   └── client.ts        # fetch wrappers: generateScript, regenerateSegment, approveScript
└── components/
    ├── Header.tsx            # Top nav bar (dark, 56px)
    ├── BriefForm.tsx         # Left panel — all form fields, linked sliders, submit
    ├── LoadingState.tsx      # Animated 5-step progress while generating
    ├── ScriptViewer.tsx      # Right panel wrapper — renders all section cards
    ├── MetadataCard.tsx      # Topic + stats (duration, audience, ratio)
    ├── ValidationCard.tsx    # Expandable — 4 checks + LLM score bar
    ├── SegmentCard.tsx       # Per-section: markdown view, edit mode, regen, approve
    ├── RegenerateModal.tsx   # Centered modal — feedback textarea + suggestion chips
    └── FooterActions.tsx     # Progress bar, final approve gate, download + copy
```

## State Management
All state lives in `App.tsx` using `useState`. No external state library.

Key state:
- `script: Script | null` — the full generated script object
- `loading: boolean` — controls LoadingState vs ScriptViewer
- `finalApproved: boolean` — gates download button
- `regen: { open, segmentId, segmentTitle }` — controls RegenerateModal

Segment updates use `patchSegment(updated: Segment)` — replaces the matching segment in `script.segments` by id.

## Global CSS Classes (defined in index.css)
```
.input          — standard form input / textarea styling
.field-label    — uppercase xs label above inputs
.btn-primary    — indigo filled button
.btn-secondary  — white bordered button
```

## Key Patterns

### Linked sliders
`beginnerPct` is the source of truth. `advancedPct = 100 - beginnerPct`. Same for `contentPct` / `codePct`.

### Markdown rendering (SegmentCard)
Uses `ReactMarkdown` with custom `components`. Override `pre` to unwrap (avoids double nesting), override `code` to detect block vs inline by checking for `language-*` className or `\n` in content.

```tsx
pre({ children }) { return <>{children}</>; }
code({ children, className }) {
  const isBlock = Boolean(className) || String(children).includes('\n');
  // isBlock → dark pre block; else → inline code span
}
```

### Segment card edit mode
Local `editing` boolean + `draft` string. On Save → calls `onEdit(segment)` which calls `patchSegment` in App. On Cancel → resets draft to `segment.content`.

## Types Reference
```typescript
Brief           { topic, agenda[], beginner_pct, advanced_pct, duration, content_pct, code_pct, prior_topics[] }
Segment         { id, title, estimated_time, content, rationale, checkpoint | null, approved }
Script          { script_id, topic, metadata: ScriptMetadata, validation: ValidationResult, segments[] }
ScriptMetadata  { duration, beginner_pct, advanced_pct, content_pct, code_pct, generated_at }
ValidationResult { agenda_coverage, timing_ok, code_ratio_ok, prior_topics_ok, llm_score }
```

## API Calls (src/api/client.ts)
```
generateScript(brief)                          POST /generate
regenerateSegment(scriptId, segmentId, feedback) POST /regenerate
approveScript(scriptId)                         POST /approve
```
Download is handled client-side — builds markdown from `script.segments` and triggers a blob download (no API call needed).
