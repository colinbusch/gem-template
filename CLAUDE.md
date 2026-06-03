# CLAUDE.md — HurrCut rebuild (minimal-UI)

Behavioral contract for this repo. Every rule here is binding. Imports below load the full spec.

@docs/extraction.md
@docs/minimal-ui-manual.md
@docs/rebuild-tasks.md

## What this is
Rebuild of **HurrCut** — a browser-based, local-first video editor for solo creators — under a new minimal-UI design system. Job: import local media → arrange on a multi-track timeline → export WebM, no cloud upload. The product surface, data model, and known problems are in `@docs/extraction.md`. The design ruleset is `@docs/minimal-ui-manual.md` and it is **law** (see "Per-screen gate"). The work plan is `@docs/rebuild-tasks.md`.

## Stack decision (greenfield — do NOT port the old code)
- The previous app is **SvelteKit + plain scoped CSS**. The rebuild is **React + TypeScript + Tailwind + Vite (SPA)**. Do not port Svelte components or the old scoped CSS. Re-implement against the manual.
- Routing: React Router (SPA; local-first, no SSR needed). State: a single `ProjectState` store (Zustand recommended). Icons: `lucide-react`.
- Apply the provided `config/tailwind.config.ts` and `config/globals.css` as the token foundation — do not invent a parallel palette.

## Non-negotiables (these are kill-criteria — a screen that breaks one is not done)
1. **4pt grid.** Spacing uses Tailwind scale steps (`p-2`, `gap-4`). Never off-grid spacing (`p-[7px]`). Arbitrary bracket values are allowed *only* for non-spacing one-offs (a specific data-viz color, a max-width) — never for spacing.
2. **One accent.** Monochrome neutral base + exactly one accent, reserved for the primary path to outcome = **Export**. The chosen accent must be visually distinct from the timeline `video` color so it never reads as track signal. No decorative accent.
3. **Data-viz color is the sanctioned exception**, not a violation (manual §5/§6b). Timeline track/clip colors + semantic state colors live in the `signal` namespace of the Tailwind config; one hue = one meaning; never the sole signal (pair with icon/text).
4. **No generated-UI decoration.** No gratuitous gradients, glassmorphism, oversized radius (cap surfaces at `rounded-lg`; `rounded-full` for badges only), heavy drop shadows (`shadow`/`shadow-md` for real elevation only), or centered-hero layouts on tool screens.
5. **Content realism.** No lorem ipsum. No invented-but-real-looking data. Use plausible task-tied content or explicit `TODO:` placeholders; mark sample data as sample.
6. **States are mandatory.** Every data-bearing screen ships empty + loading + error states. Every async action has ≤100ms feedback (manual §4). Reduced-motion is respected everywhere (the old app missed CommandBar/Timeline/Inspector — fix that).

## Data model is the contract — preserve it
Implement the full model from `@docs/extraction.md` §6: `ProjectState`, `TimelineClip` (all 40+ fields — spatial, visual, text, shape, motion), `MediaAsset` (incl. `missing?`), `Track`, `Auth`, `Tiers`, AI jobs. The prototype implements only a representative subset of clip fields; production must cover all. Do not rename or drop fields.

## Do NOT reimplement the engine from scratch
The Canvas 2D renderer, the 3 Web Workers (effects / timeline / export), MediaRecorder WebM export (+ `attributions.md`), FFmpeg WASM (scaffolded), and OPFS + FSA persistence are load-bearing subsystems (`@docs/extraction.md` §10). If the old Svelte app's engine is available, carry it over behind a clean interface. Treat preview/playback/export in the prototype as **simulated stand-ins** — real frame compositing, worker contracts, and export correctness are not regenerable from the prototype.

## The prototype is a reference, not production code
`reference/HurrCutEditor.prototype.jsx` is the rebuilt `/web` editor, built for the claude.ai artifact sandbox. Mine it for layout, interaction model, and state coverage — but **undo its sandbox-only constraints** when porting:
- It avoided *all* Tailwind bracket values (the sandbox has no JIT). In this repo JIT is on; rule #1 above is the real constraint.
- It fakes theming with a `tokens(dark)` class-map. **Delete that** — use `darkMode: 'class'` + the CSS variables in `config/globals.css`. Light mode must be fully themed (the old app's was partial).
- It uses only `useState` (artifacts forbid storage). The real app must persist `ProjectState` to **OPFS** and support **FSA** folder sync to a `.hurrcut/` subfolder.
- It is one file. Split into modules (see conventions).

## Per-screen gate (acceptance)
Before any screen/route is "done": run it against the manual's **§2 scorecard** and **§3 anti-pattern catalog**. List failures, fix, re-check. A screen that has not passed the gate is not deliverable. This applies to every route, not just the editor.

## Build order
Follow `@docs/rebuild-tasks.md`: scaffold + tokens → editor shell (`/web`) → timeline → inspector + full clip model → states → media/import + packs + AI → secondary routes (`/`, `/login`, `/settings`, `/about`) → `/matrix` **with an auth guard** (the old `/matrix` was public — gate or exclude it) → engine integration + persistence → responsive/mobile → a11y + tests.

## Repo conventions
- `src/routes/` per route; `src/components/editor/` for editor surfaces; `src/components/ui/` for shared primitives (Button, IconButton, Toggle, Slider, Field, EmptyState, Toast, CommandPalette) that bake in the rules so screens can't drift.
- One typeface for UI (system sans) + one mono for timecodes/data; ≤3 weights, ≤4 sizes per screen (manual §6a). Timecodes use `tabular-nums`.
- Keyboard map to preserve: Space = play/pause, Ctrl/Cmd+Z / +Y = undo/redo (80-entry history), Delete = remove clip, ⌘K = command palette (power-user escape hatch, manual §5).
- Remove the old `/app` redirect or make it intentional; don't carry dead routes.
- Tooling carryover from the old stack: Playwright + a unit runner (Vitest). Every primitive and the timeline get tests.
