# Drafter — Frontend

React + TypeScript frontend for the Class Script Authoring Pipeline.

---

## Setup & Run

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build
```

> Backend must be running at `http://localhost:8000`.  
> To point to a different URL: create a `.env` file with `VITE_API_URL=http://your-url`.

---

## What This App Does

One-page tool for instructors to:
1. Fill a class brief (topic, agenda, audience, duration, content/code split)
2. Generate a structured class script
3. Review each section — edit inline or request a regeneration with feedback
4. Approve sections one by one
5. Approve the final script and download it as Markdown

---

## Pages & Layout

Single page, two-panel layout:

```
┌──────────────────────────────────────────────────────┐
│  Header — Drafter                                    │
├─────────────────────┬────────────────────────────────┤
│  LEFT (340px)       │  RIGHT (flex)                  │
│                     │                                │
│  Instructor Brief   │  [Empty state]                 │
│  Form               │  OR                            │
│                     │  [Loading steps]               │
│  • Topic            │  OR                            │
│  • Agenda           │  Metadata Card                 │
│  • Audience split   │  Validation Card               │
│  • Duration         │  Segment Cards ×N              │
│  • Content/Code     │  Footer Actions                │
│  • Prior topics     │                                │
│                     │                                │
│  [Generate Script]  │                                │
└─────────────────────┴────────────────────────────────┘
```

---

## Components

### `BriefForm`
Left panel form. All fields in one component.

| Field | Type | Notes |
|---|---|---|
| Topic | Text input | Required |
| Agenda | Textarea | One item per line, shows count |
| Audience Split | Range slider | Beginner% drives it; Advanced = 100 - Beginner |
| Duration | Number input | Minutes, 15–240 |
| Content vs Code | Range slider | Content% drives it; Code = 100 - Content |
| Prior Topics | Textarea | Optional, one per line |

### `LoadingState`
Replaces the right panel while generating. Shows 5 animated steps with a progress bar.

Steps: *Parsing brief → Planning structure → Generating sections → Validating → Finalizing*

### `MetadataCard`
Shows topic name, generated timestamp, and four stat boxes (Duration, Beginner%, Advanced%, Code%).

### `ValidationCard`
Expandable card. Collapsed view shows 4 status dots and the LLM score. Expanded shows labelled check rows and a score bar.

Checks:
- Agenda Coverage
- Timing Budget
- Code Ratio
- Prior Topics

### `SegmentCard`
One card per script section (opening + agenda items + closing).

**Default view:**
- Section number badge + title + estimated time
- Rendered Markdown (dark code blocks, blockquote callouts, custom list bullets)
- Collapsible author's rationale
- Comprehension checkpoint badge (if present)
- Action bar: **Edit**, **Regenerate**, **Approve**

**Edit mode:**
- Switches content to a dark monospace textarea
- Save → updates the segment in app state
- Cancel → restores original

**Approved state:**
- Green border + green header background
- "Approved ✓" badge
- Approve button hidden

### `RegenerateModal`
Centered overlay modal. Opens when Regenerate is clicked on any segment.

- Feedback textarea (free text)
- Quick suggestion chips:
  - Make this more advanced
  - Simplify for beginners
  - Add more code examples
  - Add a real-world analogy
  - Include a comprehension exercise
  - Focus on production pitfalls
- Cancel / Regenerate buttons

Only the targeted segment is replaced when regeneration completes.

### `FooterActions`
Bottom of the right panel.

- Progress bar showing X/N sections approved
- **Approve Final Script** — enabled only when all sections are approved
- After final approval: **Download .md** + **Copy Markdown** buttons appear
- Copy button shows "Copied!" feedback for 2 seconds

---

## API Calls

All calls go to `http://localhost:8000` (configurable via `VITE_API_URL`).

| Action | Method | Endpoint | Payload |
|---|---|---|---|
| Generate script | POST | `/generate` | `Brief` object |
| Regenerate segment | POST | `/regenerate` | `{ script_id, segment_id, feedback }` |
| Approve script | POST | `/approve` | `{ script_id }` |
| Download | — | — | Built client-side from segment content |

Download does **not** call the backend — it builds Markdown from the segment array in memory and triggers a browser blob download.

---

## File Structure

```
scriptor_frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── index.ts
    ├── api/
    │   └── client.ts
    └── components/
        ├── Header.tsx
        ├── BriefForm.tsx
        ├── LoadingState.tsx
        ├── ScriptViewer.tsx
        ├── MetadataCard.tsx
        ├── ValidationCard.tsx
        ├── SegmentCard.tsx
        ├── RegenerateModal.tsx
        └── FooterActions.tsx
```

---

## Tech

- **React 18** + **TypeScript**
- **Vite** — dev server + bundler
- **Tailwind CSS v3** — utility styling
- **react-markdown** + **remark-gfm** — Markdown rendering with GFM support (tables, strikethrough)
- No router (single page), no external state library (React useState only)
