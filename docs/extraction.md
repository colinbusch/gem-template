# HurrCut — UI/UX State Extraction (Consolidated for Minimal-UI Rebuild)

**Doc version:** 0.4.0-consolidated  **Source extraction:** v0.3.4  **Schema:** hurrcut-project-v0.8.0
**Date:** 2026-06-03  **Prepared for:** new minimal-UI generation system (React + Tailwind)

---

## 0. Scope & Method — READ FIRST

This document is a **consolidation of an existing extraction**, not a fresh capture. No live walkthrough was performed because no walkable surface was reachable. Read the confidence tags before trusting any line.

**What I could access (3 documents):**

| Source | What it is | What it contributed here |
|---|---|---|
| `HurrCut_UI_UX_State_Extraction` (v0.3.4) | A prior **textual** UI/UX extraction. On disk it is **duplicated** — two near-identical copies spliced together mid-line. | The only product-state source. De-duplicated and reconciled below. |
| `minimal-ui-agent-prompt.md` | The operating manual spec for the **downstream rebuild agent** (target: React+Tailwind, Linear-style restraint). | Defines the rebuild target. Used only to flag current→target conflicts (§8), not as product evidence. |
| `UX_June02_Research_Report.md` (uploaded) | **Despite its filename, this is a general "Advanced Web UI/UX Handbook (2026)"** — motion libraries, layout techniques, etc. **It contains zero HurrCut-specific content.** | Background for the rebuild only. Contributed **nothing** to this extraction. |

**What I could NOT access (and therefore did not infer around):**
- **No live URL / running app.** The source states "No live URL"; a public-web check returned only *other* browser editors (OpenCut, BrowserCut, FlexClip, etc.), confirming HurrCut has no reachable public deployment.
- **No codebase / repository.** Nothing matching HurrCut or `.svelte` exists on disk. All component/route facts are second-hand via the v0.3.4 summary.
- **No screenshots.** The 8 PNGs are *referenced by filename* in the source but the image files are not present, so no visual state was observed directly.

**Honesty consequence for the states you asked for:** empty / loading / error / edge states are *mostly undocumented* in the only available source. Where the source (or the data model) supports a state, it is recorded and tagged. Where it does not, it is marked **`[GAP]`** rather than invented. The State Coverage Matrix (§4) is deliberately gap-heavy because that is the true state of the evidence — and that gap list is itself the most useful thing for a rebuild.

**Confidence legend (used throughout):**
- **`[V]` Verified** — stated explicitly in the v0.3.4 source.
- **`[I]` Inference** — reasoned from the data model or structure; not directly stated.
- **`[GAP]` Unreachable** — not captured by any available source; requires the live app, repo, or screenshots to resolve.

---

## 1. Product Summary `[V]`

HurrCut is a **browser-based, local-first video editor for solo creators.** Primary job: **import local media → arrange on a multi-track timeline → export WebM, with no cloud upload.** Processing is on-device (Canvas 2D renderer, Web Workers, MediaRecorder; FFmpeg WASM scaffolded). Authentication is **entirely mock/scaffolded** and paid tiers are **future placeholders** — the working product today is the free, local editor.

Three product surfaces: (1) marketing landing, (2) login / tier-preview, (3) the main editor at `/web`. Plus secondary routes for about, settings, an internal planning matrix, and a redirect stub.

---

## 2. Route & Screen Inventory

Reconciled from both copies of the source. "Auth guard" reflects what the source states; all auth is mock regardless.

| Route | Job (what it's for) | Auth guard | Capture status |
|---|---|---|---|
| `/` | Marketing home; CTA → `/login?redirect=/web` | None | Structure `[V]`, states `[GAP]` |
| `/about` | Principles + **auth disclosure** (states auth is mock) | None | Exists `[V]`; content/states `[GAP]` |
| `/login` | **Mock** OAuth + tier cards | None | Exists `[V]`; states `[GAP]` |
| `/app` | Redirect → `/web` (no UI) | n/a | `[V]` — flagged as unnecessary (§8) |
| `/web` ★ | **MAIN EDITOR** | (mock) | Best-documented; sub-surfaces in §3 |
| `/settings` | Account, OAuth connections, editor prefs | (mock) | Exists `[V]`; content/states `[GAP]` |
| `/matrix` | Internal feature-planning dashboard (risk/gap data) | **None — publicly accessible** `[V]` | Exists `[V]`; content/states `[GAP]`; **security flag (§8)** |

**API surface `[V]`** (server routes; UI bindings mostly uncaptured):
`/api/billing/tier` · `/api/ai/jobs/[kind]` · `/api/auth/session` · `/api/catalog/{media,packs,receipts}` · `/auth/[provider]/start` · `/auth/[provider]/callback`

---

## 3. Per-Screen Functional Surface

### 3.1 `/web` — Editor shell `[V]`
Five-row CSS grid, top→bottom: **MenuBar → WorkspaceBar → 3-column workspace → CommandBar → Timeline.**
The 3-column workspace = **MediaBin (left) · Stage (center) · Right-rail (Inspector → CreatorPacks → AiAssistant → StatusRail).**

> **Component-count discrepancy `[GAP]`:** 10 editor surfaces are named below, but the source says the repo holds **9** editor component files. The surface→file mapping is unspecified (two surfaces may share a file, e.g. Stage/StatusRail). Resolve against the repo.

| Surface | Job | Content shown | Key controls `[V]` |
|---|---|---|---|
| **MenuBar** (48px) | App-level commands & identity | File/Edit/Project menus, project chips, account | `details/summary` dropdowns; theme controls (Win/Mac/Dark/Light); collapses to brand+account **<820px** |
| **WorkspaceBar** (72px) | Storage scope | OPFS workspace (left) + FSA folder sync (right) | Entrance animation `hurrcut-workspace-reveal` 320ms (the only animation in the editor — anomalous) |
| **MediaBin** (220–280px, left) | Source media library | Thumbnail list, search | Search field; **drop zone** for import |
| **Stage** (center) | Preview / playback | Canvas with letterboxing, toolbar, status bar | Canvas nudge; canvas transition 160ms |
| **Inspector** (right-rail top) | Edit selected clip | Sub-sections: **Details / Text / Shape / Transform / Effects / Motion / Audio**; resolution preset chips | Inline HTML inputs; `max-height:70%` (can clip content — §8) |
| **CreatorPacks** (right-rail, collapsible) | Insert pack assets / plan | Kind filters; pack items (from `/api/catalog/*`) | Insert / Plan buttons; max 280px scroll |
| **AiAssistant** (right-rail, collapsible) | Run AI jobs | 6 job types; Notes textarea; **Result `pre` output** | Job select; run; (states uncaptured — §4) |
| **StatusRail** (right-rail bottom) | System status | **3 worker-lane pills** + export row + tier row | Read-out; **export status is text here, no progress bar** |
| **CommandBar** (52px) | Primary editing actions | 4 groups (below) | Collapses **<1120px** |
| **Timeline** (`minmax(220px,31vh)`) | Arrange clips in time | Ruler, playhead, multi-track lanes | **Pointer drag = move + trim** |

**CommandBar groups `[V]`:**
- **Add:** Import · Text · Shape · Hook · Lower-third
- **Edit:** Undo · Redo · Split · Merge · Duplicate · Delete
- **Transport:** Play · Pause · scrub · time display
- **Tail:** zoom · snap · guides · **Export**

**Timeline clip colors `[V]`** (functional/data-viz signal, not decoration — preserve semantics in rebuild): video `#58d3ff`, audio `#86e89f`, text `#f2cf67`, shape `#c7a5ff`, playhead `#ff856f`.

### 3.2 Secondary screens — known surface only
- **`/` Marketing `[V]`:** hero + CTA to `/login`; uses fluid `clamp()` typography and (per §9) glass/gradient cards. Section inventory, copy, and CTAs beyond the primary one are **`[GAP]`**. `MarketingFooter` exists but was **not extracted `[GAP]`**.
- **`/about` `[V]`:** carries the auth-is-mock disclosure + product principles. Exact content **`[GAP]`**.
- **`/login` `[V]`:** mock OAuth entry + tier cards (free/creator/studio). Provider buttons (google/microsoft/github) implied by the auth model. Layout/copy/error states **`[GAP]`**.
- **`/settings` `[V]`:** account, OAuth connections, editor prefs. Field list, toggles, and states **`[GAP]`**.
- **`/matrix` `[V]`:** internal planning board with reactive filters and a graduated risk palette (low→critical). Exact data, columns, and the fact that it has **no auth guard** make its full contents a combined functional + **security** gap (§8).

---

## 4. State Coverage Matrix (empty / loading / error / edge)

**This is the section you specifically asked for, and it is mostly gaps — honestly so.** The source is a structural summary; it documents very few non-happy-path states. Cells marked `[GAP]` were **not invented**. Resolve them against the live app or repo.

| Screen / surface | Empty | Loading | Error | Notable edge |
|---|---|---|---|---|
| `/web` (shell) | `[V]` opens to empty project (see Stage/MediaBin/Timeline rows) | **`[V]` NO loading skeleton** on `/web` | `[GAP]` | `[GAP]` |
| MediaBin | `[I]` no-media list state (UI undescribed) | `[GAP]` thumbnail-gen / decode | `[GAP]` import-failure / unsupported codec | **`[V]`** `MediaAsset.missing?` flag → an **unresolved/missing-asset** state is modeled; its UI is `[GAP]` |
| Stage / Canvas | `[I]` empty canvas when no clips | `[GAP]` | `[GAP]` render error | `[V]` letterbox for aspect mismatch; `[V]` `isPlaying` playback state |
| Inspector | `[I]` empty when `selectedClipId` is null (UI undescribed) | `[GAP]` | `[GAP]` invalid-input handling | `[V]` `max-height:70%` clips content on short viewports |
| Timeline | `[I]` empty (no clips/tracks) | `[GAP]` | `[GAP]` | `[V]` drag move/trim; `[V]` snap on/off; playhead height via fragile `calc(100vh - 80px)` |
| Export (Tail → StatusRail) | n/a | **`[V]` exporting state exists** (`isExporting`, `exportState`) but **NO progress bar — text only** | **`[GAP]` export-failure state not captured** | `[GAP]` cancel-export, large-file/memory limits |
| CreatorPacks | `[GAP]` no-results for filters | `[GAP]` catalog fetch (`/api/catalog/*`) | `[GAP]` catalog fetch failure | `[V]` collapsible; `[V]` kind filters |
| AiAssistant | `[V]` idle (empty `pre` result) | **`[GAP]`** job-running / spinner | **`[GAP]`** job failure | **`[GAP]`** insufficient-credits state (jobs cost credits — §6) |
| `/login` | n/a | `[GAP]` | **`[GAP]`** OAuth cancel/deny/error (esp. since auth is mock) | `[GAP]` already-signed-in redirect |
| `/settings` | `[GAP]` | `[GAP]` | `[GAP]` connect/disconnect OAuth failure | `[GAP]` |
| `/`, `/about` | n/a | `[GAP]` | `[GAP]` | `[V]` reduced-motion respected on marketing |
| `/matrix` | `[GAP]` | `[GAP]` | `[GAP]` | `[V]` reactive filters; data/columns `[GAP]` |

**Cross-cutting state facts `[V]`:** no loading skeleton on `/web`; no export progress bar; `details/summary` collapsibles have **no open/close animation**.

---

## 5. User Flows

Lettered A–E per source `[V]`; per-state annotations added where evidence exists, gaps marked.

- **A (primary):** `/` → CTA → `/login` → **mock** OAuth → `/web` → import → arrange → **export WebM**. Output includes an `attributions.md` alongside the WebM `[V]`. Failure/error branches at each hop are **`[GAP]`**.
- **B (return):** `/web` → load project from **OPFS** `[V]`. Project-not-found / corrupt-project handling **`[GAP]`**.
- **C (export):** Tail → Export → WebM download **+ `attributions.md`** `[V]`. Progress is text-only; **export-failure path `[GAP]`**.
- **D (AI job):** select job type → run → DeepSeek backend (for `project-assistant`); `attribution-summary` is **scripted, not a model call** `[V]`. Failure / credit-exhaustion branches **`[GAP]`**.
- **E (FSA sync):** pick folder → sync project JSON into a `.hurrcut/` subfolder `[V]`. Permission-denied / folder-revoked handling **`[GAP]`**.

---

## 6. Data Model `[V]` (persists across the restyle — high-value, keep intact)

The visual system is being replaced, but **the data model is framework-agnostic and should survive the rebuild largely unchanged.**

**`ProjectState`:** `settings{name,width,height,fps,bg}`, `theme{platform,scheme}`, `assets[]`, `clips[]`, `tracks[]`, `markers[]`, `selectedClipId`, `playhead`, `zoom` (28–180 px/s), `snap`, `safeGuides`, `isPlaying`, `isExporting`, `tier`, `workers[]`, `exportState`.

**`TimelineClip`** (40+ fields):
- *Identity/timing:* `id`, `kind`, `trackId`, `start`, `in`, `out`, `speed`, `assetId`, `name`
- *Spatial:* `x`, `y`, `scale`, `rotate`, `opacity`
- *Visual:* `volume`, `muted`, `fit`, `blend`, `brightness`, `contrast`, `saturate`, `blur`, `hue`, `grayscale`, `sepia`, `cropL/R/T/B`, `fadeIn`, `fadeOut`, `chroma`, `keyColor`, `keyThreshold`
- *Text* fields · *Shape* fields · *Motion:* `preset`, `strength`, `easing`

**`MediaAsset`:** `id`, `name`, `type` (video|audio|image), `mime`, `size`, `duration`, `width?`, `height?`, `url?`, `sourceName?`, **`missing?`** (← drives the missing-asset state in §4).

**`Track`:** `id` (number), `label`, `kind` (text|overlay|video|audio), `accepts[]`.

**`Auth`:** `provider` (google|microsoft|github), `displayName`, `email`, `tier`.

**Tiers:** `free` ($0, **active**), `creator` (future), `studio` (future).

**AI jobs (6)** — credits per run:

| Job | Cost | Backend |
|---|---|---|
| caption-cleanup | 5 cr | — |
| rough-cut-plan | 12 cr | — |
| publish-package | 10 cr | — |
| broll-search-prompts | 5 cr | — |
| attribution-summary | 4 cr | **scripted** (no model) |
| project-assistant | 6 cr | **DeepSeek** |

> **Credits `[GAP]`:** jobs are priced in credits, but how credits are granted, where the balance is shown, and the insufficient-credits UX are not captured. `RESOLUTION_PRESETS` (the Inspector preset chips) and worker-message internals were **not extracted `[GAP]`**.

---

## 7. Interaction & Input Model `[V]` (must-preserve behaviors)

These functional behaviors should be retained regardless of styling:
- **Timeline pointer drag** = move **and** trim (edge-vs-body hit zones).
- **Media drag-and-drop** import into MediaBin.
- **Canvas nudge** on Stage; inline HTML inputs in Inspector.
- **`details/summary` collapsibles** (no animation today).
- **RAF playback loop** for transport.
- **Undo/redo: 80-entry history, `Ctrl+Z` / `Ctrl+Y`.**
- **One Tap demo overlay** (a guided/demo affordance — UI states **`[GAP]`**).
- **Reactive filters** on `/matrix`.

**Reduced-motion `[V]`:** respected on marketing + Stage + WorkspaceBar; **NOT** respected in CommandBar / Timeline / Inspector (rebuild should fix — §8).

---

## 8. Known Problems → Rebuild Targets

The source's 14 observations, reframed as actionable items for the minimal-UI rebuild and grouped by type. Severity is my assessment `[I]`.

**Responsive / layout (high):**
- Editor is **unusable below 1080px — no tablet/mobile layout** `[V]`. The rebuild must define sub-1080 behavior.
- MenuBar **hides all file/export controls below 820px** `[V]` — controls disappear rather than relocating.
- CommandBar collapses <1120px `[V]`; Inspector `max-height:70%` clips content on short viewports `[V]`; Timeline playhead height uses fragile `calc(100vh - 80px)` magic number `[V]`.

**Missing feedback states (high — ties to §4):**
- No loading skeleton on `/web` `[V]`; no export progress bar (text only) `[V]`; `details/summary` panels have no animation `[V]`.

**Privacy / security (high):**
- **`/matrix` is publicly accessible and exposes internal risk/gap planning data** `[V]`. Add an auth guard or remove from the shipped build.
- Auth is **entirely mock** `[V]` (disclosed on `/about` and `/login`) — real auth is a rebuild prerequisite if tiers go live.

**Consistency / system (medium):**
- **No shared design-token file** — variables re-declared per component `[V]`.
- **Light mode is partial** — Timeline/Inspector/MediaBin use hardcoded hex and aren't themed `[V]`.
- **Multiple inconsistent focus styles** across pages `[V]` (the rebuild's a11y baseline should unify these).
- WorkspaceBar entrance animation is anomalous (only animated editor element) `[V]`; `/app` is an unnecessary redirect `[V]`.

**Conflicts with the new minimal-UI manual `[I]`** (current pattern → manual rule it violates or satisfies):
- Marketing **glass cards, gradients, large radii (1.2–2rem), heavy canvas shadow** → the rebuild manual names glassmorphism / gratuitous gradients / oversized radius / heavy drop shadows / centered-hero as **kill-criteria**. Do not port these.
- Ad-hoc 8–24px spacing with **no shared scale** `[V]` → violates the manual's **4pt-grid / Tailwind-scale-only** rule. Re-grid on rebuild.
- **Timeline clip palette, worker/status pills, tier & risk colors** → these are legitimate **semantic / data-visualization color**, which the manual explicitly carves out as a sanctioned exception. **Preserve these signals** even under a monochrome+1-accent base.

---

## 9. Legacy Visual System — REFERENCE ONLY, DO NOT PORT `[V]`

Recorded for traceability; the rebuild replaces this wholesale. Kept compact because styling fidelity is explicitly out of scope.

- **Type:** Inter / system-ui, weights 700–950, no explicit scale. Editor 10–16px; marketing `clamp(0.72rem, …, 8rem)`.
- **Editor dark tokens:** surface-0 `#070b10`, surface-1 `#0c131b`, surface-2 `#101821`, accent `#58d3ff`, text `#f6f8fb`, border `#202a35`.
- **Light (partial):** surface-0 `#f4f7fb`, accent `#087cc9`, text `#13202d` — Timeline/Inspector/MediaBin not covered.
- **Marketing palette:** blue `#006eff`, blue-hot `#12a9ff`, cyan `#68dcff`, purple `#6b3dff`, orange `#ff7a18`.
- **Status palette:** implemented=green, partial=amber, planned/future=blue, risk low→critical graduated.
- **Depth:** marketing glass gradient + inset shadow; editor flat; nav `backdrop-filter: blur(16px)`; canvas `box-shadow: 0 28px 80px rgba(0,0,0,.42)`; radii 7–10px (editor) / 1.2–2rem (marketing).
- **Icons:** lucide (27 icons, 15–16px); brand = CSS gradient circle.
- **17 animations:** workspace-reveal 320ms · soft-rise 360–640ms · shield-pulse 2.8s∞ · title-shimmer 4.5s∞ · sky-breathe 9s∞ · preview-drift 12s∞ · cursor-drift 5.6s∞ · pill-pop 2.8s∞ · timeline-scan 2.6s∞ · video-card-in 760ms · menu-open 240ms · canvas 160ms · hover-lift 160ms. *(The source labels this "17" but lists 13 named entries — minor `[GAP]`.)*

---

## 10. Tech Stack & Rebuild Constraint `[V]`

**Current:** SvelteKit v2.56 + Svelte 5.55 (runes: `$state/$derived/$effect/$props`), Vite v8, TypeScript v5.6, adapter-node v5.5, Bun. **Plain scoped CSS — no Tailwind, no CSS-in-JS.** lucide-svelte v1, modern-normalize v3. `@ffmpeg/ffmpeg` v0.12 WASM (scaffolded). **MediaRecorder API** (primary WebM path). **3 Web Workers** (effects / timeline / export). **Canvas 2D** custom renderer. **OPFS + FSA** storage. Bun test + Playwright. OAuth scaffolded (mock only).

> **Rebuild reality `[I]`:** the target stack is **React + Tailwind** (per the minimal-UI manual). This is a **full reimplementation, not a restyle** — Svelte components and scoped CSS don't carry over. **What does carry over:** the data model (§6), the renderer architecture (Canvas 2D + Web Workers), the storage layer (OPFS/FSA), the MediaRecorder export path, and the interaction model (§7). Plan the rebuild around preserving those while replacing the component/styling layer.

---

## 11. Gaps & Unreachable Sources (consolidated register)

Every unresolved item in one place, with what would close it. Nothing below was inferred around.

**Whole screens never captured (need live app or repo):** `/about` content, `/login` layout/states, `/settings` fields/states, `/matrix` data & columns, marketing section/copy inventory, `MarketingFooter`.

**States never captured (need live app):** all loading states except "no skeleton on /web"; all error states (import failure, unsupported codec, render error, **export failure**, OAuth cancel/deny, catalog fetch failure, AI job failure, **insufficient credits**); empty-state UI for MediaBin / Inspector / CreatorPacks; One Tap demo overlay states; export-in-progress visuals; export cancel; large-file/memory limits.

**Model/internal gaps (need repo):** surface→component-file mapping (10 vs 9); `RESOLUTION_PRESETS` values; worker message contracts; how credits are granted/displayed; the "17 vs 13" animation discrepancy.

**Artifacts referenced but not present:** the 8 screenshots (`01-login`, `02-editor-empty-1920x1080`, `03-editor-with-project-inspector`, `04-timeline-multitrack`, `05-responsive-{1366,1920,2560,3840}`) — filenames only, images not available.

**To close these:** provide (a) a running URL or build, (b) read access to `hurrcut/web/src/`, and/or (c) the screenshot PNGs. With any one of these, §4 and §3.2 can be filled in directly rather than left as gaps.

---

## 12. Source Provenance

- **Primary (de-duplicated):** `HurrCut_UI_UX_State_Extraction` v0.3.4 — sole product-state evidence; appeared twice on disk and was reconciled (minor wording differences only; the fuller variants and the complete API list were retained).
- **Rebuild target spec:** `minimal-ui-agent-prompt.md` — used only for §8 current→target mapping.
- **Not used (no HurrCut content):** `UX_June02_Research_Report.md` — a general React+Tailwind techniques handbook; relevant to the rebuild agent, not to this extraction.

*End of consolidated extraction. Gap-heavy by design: the gaps are the work the rebuild should commission next.*
