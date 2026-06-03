# Rebuild task plan — HurrCut (minimal-UI)

Execute in order. **Each phase is "done" only when every touched screen passes the manual's §2 scorecard + §3 anti-pattern catalog** (`docs/minimal-ui-manual.md`). Check boxes as you go.

---

## Phase 0 — Scaffold & tooling
- [ ] `npm create vite@latest` → React + TypeScript. Add React Router (SPA).
- [ ] Install Tailwind; replace the generated config with `config/tailwind.config.ts` and `config/globals.css` from this bundle. Set `darkMode: 'class'`.
- [ ] Install `lucide-react`, a state lib (Zustand recommended), ESLint + Prettier, Vitest + Playwright.
- [ ] Create the `ProjectState` store skeleton from `docs/extraction.md` §6 (all top-level fields). Stub OPFS load/save behind a `storage` module interface.
- [ ] Verify dark/light toggle flips the `dark` class on `<html>` and the CSS variables resolve.
- **Done when:** app boots, theme toggles, lint/test runners green.

## Phase 1 — Tokens & UI primitives
- [ ] Confirm the neutral base, single accent, and `signal` data-viz palette resolve from the config.
- [ ] Build shared primitives in `src/components/ui/`: `Button` (primary uses accent — the *only* accent surface), `IconButton` (requires `aria-label`), `Toggle`, `Slider` (labeled, `tabular-nums` value), `Field`/`NumberField` (persistent label, validate on blur), `EmptyState`, `Toast` (bottom-right, ~4.5s, one action), `CommandPalette` (⌘K).
- [ ] Bake the rules into primitives: focus-visible ring on all interactives, min target `h-8` desktop / `min-h-11` touch.
- **Done when:** a primitives storybook/demo page passes the gate; no component allows off-grid spacing.

## Phase 2 — Editor shell `/web`
- [ ] Build the 5-row grid: MenuBar (48px) → WorkspaceBar (slim) → 3-col workspace (MediaBin · Stage · right-rail) → CommandBar (≈56px) → Timeline. Port structure from `reference/HurrCutEditor.prototype.jsx`, split into `src/components/editor/*`.
- [ ] CommandBar groups: Add (Import/Text/Shape/Hook/Lower-third) · Edit (Undo/Redo/Split/Merge/Duplicate/Delete) · Tail (zoom/snap/guides/**Export = the accent**). Transport lives under the Stage preview (convention).
- [ ] Wire the keyboard map and the ⌘K palette.
- **Done when:** shell renders in both themes, all groups present, gate passes.

## Phase 3 — Timeline (the hard part)
- [ ] Multi-track lanes by `Track.kind`; clips positioned by `start`/`dur`/`zoom`; colors from the `signal` namespace.
- [ ] Pointer interactions: move, trim-left (adjusts `start`+`in`), trim-right (adjusts `out`); ruler scrub; zoom (28–180 px/s); snapping. Start from the prototype's pointer math.
- [ ] 80-entry undo/redo over the clip model; one history entry per gesture.
- [ ] Virtualize long timelines; keep the playhead height robust (the old app used a fragile `calc` magic number — don't).
- **Done when:** drag/trim/scrub feel correct, undo granularity is per-gesture, gate passes.

## Phase 4 — Inspector + full clip model
- [ ] Sub-sections from `docs/extraction.md`: Details / Text / Shape / Transform / Effects / Motion / Audio. Cover the **full 40+ `TimelineClip` field set**, not the prototype's subset.
- [ ] Resolution preset chips (`RESOLUTION_PRESETS` — value list is a `docs/extraction.md` gap; define sensible presets and mark `TODO` if unconfirmed).
- [ ] Empty state when nothing selected.
- **Done when:** editing any field updates the clip + preview live; gate passes.

## Phase 5 — States everywhere (closes old gaps)
- [ ] Boot skeleton on `/web` (old app had none).
- [ ] Determinate **export progress** (old app: text-only).
- [ ] **Missing-media error**: block export, name the file(s), offer relink/remove — wired to `MediaAsset.missing?`.
- [ ] AI states: idle / running / result / **insufficient credits**.
- [ ] MediaBin empty + missing rows; catalog loading/empty/error for CreatorPacks.
- **Done when:** every state in `docs/extraction.md` §4 is implemented or explicitly `TODO`-marked; gate passes.

## Phase 6 — Media, packs, AI
- [ ] MediaBin: import via FSA file pick + drag-drop; thumbnails; search.
- [ ] CreatorPacks: catalog from `/api/catalog/*`; kind filters; Insert/Plan.
- [ ] AiAssistant: 6 jobs with credit costs; `attribution-summary` is scripted (no model); `project-assistant` calls the DeepSeek backend — stub the call behind an interface; never block the UI.
- **Done when:** import works, packs list, AI jobs round-trip (stubbed ok); gate passes.

## Phase 7 — Secondary routes
- [ ] `/` marketing, `/login` (mock OAuth + tier cards: free active / creator / studio future), `/settings` (account, OAuth connections, editor prefs), `/about` (principles + the auth-is-mock disclosure — keep it).
- [ ] Apply the minimal aesthetic — this is where the old glass/gradient marketing styling must NOT return.
- **Done when:** each route passes the gate; auth-mock disclosure present.

## Phase 8 — `/matrix` (security fix)
- [ ] Add an **auth guard** to `/matrix` (the old route was publicly accessible and exposed internal risk/gap data — `docs/extraction.md` obs. #9), or exclude it from the production build.
- **Done when:** unauthenticated access is blocked or the route is absent in prod.

## Phase 9 — Engine integration & persistence
- [ ] Integrate the Canvas 2D renderer + 3 Web Workers (effects/timeline/export). If the old engine exists, port it behind a clean interface; **do not rebuild from scratch.**
- [ ] MediaRecorder WebM export + `attributions.md` output. FFmpeg WASM scaffold.
- [ ] OPFS persistence for `ProjectState`; FSA folder sync to `.hurrcut/`.
- **Done when:** a real project exports a correct WebM and reloads from OPFS.

## Phase 10 — Responsive / mobile
- [ ] Define sub-1080px behavior (the old editor was unusable below 1080 and hid controls below 820 — fix both: relocate, don't delete). Graceful panel collapse minimum.
- [ ] A true mobile editor layout is a distinct design effort — scope it explicitly before building.
- **Done when:** the editor is usable (or gracefully reduced) below 1080px; no controls silently disappear.

## Phase 11 — A11y & QA
- [ ] Unified focus styles across all routes (old app had several inconsistent ones).
- [ ] `prefers-reduced-motion` respected everywhere (old app missed CommandBar/Timeline/Inspector).
- [ ] Run every route through the §2 / §3 gate one final time.
- [ ] Vitest for primitives + timeline math; Playwright for the primary flow (`/` → `/login` → `/web` → import → arrange → export).
- **Done when:** gate passes on all routes, tests green.
