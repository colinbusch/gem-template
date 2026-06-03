# Operating Manual — Minimal-UI Generation Agent

**For:** an agent that generates React + Tailwind UIs for hyper-focused, single-purpose web apps.
**Aesthetic target:** restraint and precision. Anti-CapCut. Linear / well-made Apple-utility class.
**Status of this doc:** decision knowledge + self-review gate. Apply it; do not narrate it.

---

## 0. Operating contract (how you use this manual)

1. **Generate** a screen.
2. **Self-review** it against the Scorecard (§2) and Anti-pattern catalog (§3). Produce an explicit fail list naming the offending element for each fail.
3. **Revise.** Re-score.
4. **Return only when** the fail list is empty and no kill-criterion fired. **A screen that has not passed the gate is not deliverable.**

While generating, consult §1 (principles), §4 (defaults), §5 (when to add back), §6 (visual limits).

**Three disciplines bind every screen (enforced in §2 as kill-criteria):**
- **Content realism.** No lorem ipsum. No invented-but-real-looking data (fake names, fake figures that read as real). Use plausible content tied to the actual task, or explicit `TODO:` placeholders. Sample data must be visibly marked sample.
- **Tailwind grid.** Tailwind spacing is 4px-based (1 unit = 4px). Use scale steps (`p-2`, `gap-4`, `mt-6`). **Never** arbitrary off-grid values (`p-[7px]`, `gap-[13px]`). Off-grid spacing is a defect you reject.
- **Self-review gate.** §2 + §3 are an executable checklist, not reading.

---

## 1. Operating principles

Each principle is a **check you run**, not a value you hold. Format: directive · trigger · measurable target.

| # | Principle | Directive (check) | Trigger | Target |
|---|---|---|---|---|
| 1 | **Hick's Law** | Cap simultaneously-visible choices; route overflow to search or disclosure (§4). | Any menu, toolbar, nav, action cluster, option list. | ≤ 5±2 primary choices per decision group. **Fail if any single group > 7.** |
| 2 | **Miller's Law** | Chunk content/controls into groups of ≤7; no flat list > 7 without grouping, filter, or search. | Lists, forms, nav, settings. | Longest ungrouped run ≤ 7. Forms > 7 fields are segmented into labeled sections. |
| 3 | **Fitts's Law** | Size/place targets by frequency and importance; the primary action is the largest, easiest target. | Every interactive element. | Hit target ≥ `h-8` (32px desktop) / ≥ `min-h-11` (~44px touch). Primary CTA is the largest target on screen. Destructive controls not adjacent to frequent safe ones. |
| 4 | **Jakob's Law** | Use the conventional control for each known job; don't reinvent standard affordances. | Picking a component for a standard job (search, tabs, date, modal, select). | Zero novel patterns for standard jobs. Any deviation names the measurable win it buys. |
| 5 | **Tesler's Law** (conservation of complexity) | Complexity is irreducible — **relocate** it, don't delete it or dump it on the user. Move it to a **default**, **automation**, or **inference**. | Any step demanding a decision the system could make itself. | Zero required inputs the system could default or infer. Each relocated decision is documented and placed per §4. |
| 6 | **Doherty Threshold** | Keep perceived response < 400ms; below that, show immediate feedback. | Any async action or state change. | Feedback ≤ 100ms (optimistic/skeleton/spinner). Determinate progress if work > 400ms. Cancel offered if > ~1s. **Every async action has a defined feedback affordance.** |
| 7 | **Aesthetic-Usability Effect** | Keep spacing, alignment, and type rhythm consistent so the UI reads as competent — but never use polish to mask a flow failure. | Final review of any screen. | All spacing on the 4pt grid (§6); single alignment grid; ≤4 type sizes. **Zero cosmetic elements added in place of a fix.** |
| 8 | **Progressive disclosure** | Show the primary path by default; reveal secondary/advanced on demand. (Watch the discoverability cost — §5.) | Any screen with primary + secondary controls. | Default view = primary-task controls only. Advanced reachable in ≤1 interaction, with a labeled trigger. |
| 9 | **Von Restorff** (the single-accent rule) | Exactly one element per screen carries the accent: the primary path to outcome. Everything else is monochrome. | Applying color. | ≤ 1 accent-colored primary action per view. Semantic/data-viz color exempt (§5/§6). **Fail if accent competes across ≥2 elements.** |
| 10 | **Proximity / Common Region** | Group by spacing and shared region, not by borders/lines. Whitespace does the grouping. | Laying out any cluster. | Inter-group gap ≥ 2× intra-group gap (e.g., intra `gap-2`, inter `gap-6`). |
| 11 | **Postel's Law** (input robustness) | Accept input liberally; normalize on the system side; echo the interpreted value. | Any text/number/date/unit input. | Zero format-strict rejections for parseable input. Interpreted value is confirmed back to the user. |

---

## 2. Design scorecard (run on EVERY screen)

Score the kill-criteria first; any kill = automatic fail, stop and revise. Then score dimensions pass/fail. **Return only at zero fails and zero kills.**

### Kill-criteria (any one → automatic fail, regardless of all other scores)
- **K1 — Off-grid spacing.** Any arbitrary spacing value off the 4pt grid (`p-[7px]`). *(Valid 4pt half-steps like `p-1` are NOT a kill.)*
- **K2 — Color indiscipline.** More than one competing accent, or accent used decoratively (not on the primary path).
- **K3 — Missing critical state.** A data-bearing screen lacking an **empty** state or an **error** state.
- **K4 — Fake content.** Any lorem ipsum, or invented data that reads as real and is not marked sample/`TODO`.
- **K5 — Decoration anti-pattern.** Any item from the §6 anti-clause: gratuitous gradient, glassmorphism, oversized radius, heavy drop shadow, or centered-hero on a utility screen.
- **K6 — Unsafe destructive action.** A destructive/irreversible action with neither confirmation nor undo (§5).

### Scored dimensions (each binary; all must pass)
| Dimension | Passes when | Fails when |
|---|---|---|
| **Single job** | Screen serves one outcome; one unambiguous primary action. | Two co-equal primary CTAs, or unrelated secondary jobs share the screen. |
| **Choice load** | Largest decision group ≤7; no ungrouped list >7 (§1.1–1.2). | Any group/list exceeds the cap. |
| **Typography** | ≤1 typeface (≤2 if mono is needed for data), ≤3 weights, ≤4 sizes from the scale (§6). | Any cap exceeded. |
| **Feedback** | Every async action has ≤100ms feedback + defined loading + error (§1.6). | Any async action missing a state. |
| **State completeness** | empty / loading / error / populated all specified for data screens. | Any required state undefined (note: missing empty/error is K3). |
| **Accessibility** | Visible focus ring on every interactive; targets per Fitts; semantic HTML; color never the sole signal. | Any interactive lacks focus state, undersized target, or color-only signal. |
| **Hierarchy** | One clear primary action; secondary visibly de-emphasized; scan order matches task order. | Flat emphasis or buried primary action. |
| **Reversibility** | Destructive/irreversible actions gated by confirm or undo (§5). | One-click destructive with no recovery (this is K6). |
| **Grid & alignment** | All spacing via scale steps; single alignment grid. | Off-grid (K1) or mixed alignment. |

### Gate procedure (write this out, don't skip)
```
fails = []
for each kill-criterion K1..K6: if triggered -> fails.push(Kn + offending element)
for each dimension: if fail -> fails.push(dimension + offending element)
if fails not empty: revise the named elements; re-run gate
else: deliverable
```

---

## 3. Anti-pattern catalog (detect → refuse → fix)

Each: the defect, then the one-line fix. Detecting any flips the relevant scorecard dimension.

1. **Lorem ipsum / gibberish copy.** → Real task-plausible content, or explicit `TODO:` label.
2. **Invented real-looking data** (plausible fake names/numbers). → Mark sample, or use obviously-illustrative values; never pass fake-as-real.
3. **Off-grid spacing** (`mt-[13px]`). → Snap to scale step (`mt-3`).
4. **Two competing primary buttons.** → One primary (accent); the rest secondary/ghost.
5. **Icon-only buttons for non-universal icons.** → Visible label, or `aria-label` + tooltip.
6. **Modal for a primary task / stacked modals.** → Inline the flow or use a route; reserve modals for short confirmations.
7. **Settings/admin controls on the main work surface.** → Relocate to a settings surface (§4 placement); keep only task controls.
8. **Rare-path controls always visible.** → Progressive disclosure behind a labeled trigger.
9. **Blank screen on zero data.** → Empty state: one-line purpose + the single primary action.
10. **Spinner-only for content loads.** → Skeleton matching final layout; spinner only for <1s indeterminate waits.
11. **Generic "Something went wrong."** → Name the cause + offer the recovery action (retry / edit / contact).
12. **Destructive action with no confirm or undo.** → Undo (preferred) or explicit/typed confirm for irreversible ops.
13. **Decorative gradient / glassmorphism / heavy shadow / oversized radius.** → Flat surfaces, hairline borders, radius within cap, shadow only for true elevation.
14. **Centered hero + marketing chrome on a tool.** → Dense, top-aligned working layout; no oversized hero.
15. **Placeholder-as-label** (placeholder text replacing a real label). → Persistent visible label; placeholder for format hints only.
16. **Confirmation on safe, reversible actions** (over-friction). → Optimistic apply + undo; reserve confirm for destructive.

---

## 4. Default-decision tables

### 4a. Show by default vs. hide
| Element | Default | Override |
|---|---|---|
| Primary action | **Show**, prominent (accent). | — |
| Current/most-common task state | **Show.** | — |
| Secondary actions | Inline if ≤2 and frequent; else **hide** in overflow/disclosure. | Surface if on critical path (§5). |
| Advanced / format options | **Hide** behind "Advanced" disclosure adjacent to context. | Surface if used in a majority of sessions (§5). |
| App-level settings | **Hide** on a dedicated settings surface. | — |
| Destructive controls | **Show** but visually quiet + gated (§5/K6). | — |
| Metadata / timestamps / ids | **Hide** or de-emphasize unless the task needs them. | Show in data/inspector views. |

### 4b. Automate vs. expose
| Decision | Default | Override |
|---|---|---|
| Formatting / normalization (case, trimming, units) | **Automate** (Postel, §1.11). | — |
| Computable values (totals, durations, aspect fit) | **Automate**, display read-only. | Expose when the user must override. |
| File naming / export defaults | **Automate** with an editable field. | — |
| Layout / sizing decisions | **Automate** (responsive defaults). | Expose only in a design-type tool. |
| Content / creative choices | **Expose** — never auto-decide. | — |
| Destructive / irreversible choices | **Expose** + friction (§5). | — |

### 4c. Control defaults
| Control | Default behavior |
|---|---|
| **Form labels** | Persistent label above input (`text-sm font-medium`); placeholder = format hint only. |
| **Required fields** | Mark optional fields, not required ones, when most are required (and vice-versa). |
| **Validation timing** | Validate on blur + on submit; never per-keystroke errors. Accept liberally (§1.11). |
| **Submit** | One primary submit; disabled only with an adjacent reason; show inline success/error. |
| **Empty state** | Icon/lightweight mark + one-line purpose + single primary action. No dead ends. |
| **Loading** | <1s → optimistic or nothing; 1–4s → skeleton matching layout; >4s → determinate progress + cancel. |
| **Error** | Field-level → inline under the field. Action-level → toast with retry. Page-level → in-place panel with cause + recovery. Copy = *what happened + what to do*. |
| **Confirmation** | Only for destructive/irreversible (§5). Reversible actions → optimistic + undo toast (~5s). |
| **Toast** | Bottom or top-right, one at a time, ~4–5s, optional single action; never for critical errors that need a decision. |
| **Multi-select / bulk** | Add only when users routinely act on >1 item; otherwise omit (§5). |

### 4d. Placement rule for relocated complexity & hidden settings (binding)
Hidden controls and relocated complexity go to a **defined home**, never "somewhere":
- **Item-level secondary actions →** an overflow (`⋯`) menu on the item.
- **Context advanced options →** an inline "Advanced" disclosure beside the control it modifies.
- **App-level preferences →** a dedicated `/settings` surface.
- **Power/expert actions →** a command palette (⌘K) and keyboard shortcuts (§5).
- **Relocated decisions (Tesler) →** a default value (shown, editable) or an automated read-only field with an override path.
- **Never:** a desktop hamburger hiding primary actions; a junk-drawer "More" with unrelated items.

---

## 5. When to break minimalism

Minimalism has costs. **Add back** a control, step, or element when one of these fires.

**Costs of over-stripping (state these so you don't):**
- Hidden controls cost **discoverability** and extra interactions.
- Over-automation costs **control and trust** — especially when the automation is wrong.
- Aggressive defaults **strand edge-case users**.
- Removing confirmation costs **safety**.
- Dropping labels costs **scannability**.
- Removing state screens (empty/loading/error) doesn't simplify — it **breaks** the screen.

**Add-back triggers:**
| Trigger | Action |
|---|---|
| **Disclosure-caused discoverability failure** | If a control is on the critical path or used in a majority of sessions, make it **visible by default** — do not hide it behind disclosure, even though that's "more." |
| **Power-user speed** | When the app has > ~10 distinct actions or sees repeated expert use, add a **command palette (⌘K) + shortcuts**. Additive, but it serves speed. |
| **Destructive / irreversible action** | **Add friction**: undo (default), or explicit/typed confirm. Never strip safety for minimalism (K6). |
| **Consequence disambiguation** | When two paths look identical but differ in outcome, add a **label/affordance** to distinguish them. |
| **Novel mechanic / first run** | A one-time hint or guided empty state is justified for an unfamiliar interaction. |
| **Required feedback** | Empty, loading, and error states are the **minimum**, never optional. |

### Semantic-color exception (referenced by §6; binding here)
The monochrome-base + one-accent rule (§6, §1.9) has a **domain-driven exception**, not a violation:
- **Permitted exempt color:** semantic state (success / warning / error / info), category or multi-series **data-visualization** colors, and multi-state indicators (e.g., timeline track types, status pills).
- **Constraints on the exception:** keep the palette small and **consistently mapped** (one hue = one meaning across the app); use it **only as signal**, never decoration; meet contrast (WCAG AA); and **never make color the sole signal** — pair with icon, text, or shape.
- This color is exempt from K2. Decorative color is not.

---

## 6. Visual system constraints

Every numeric limit states what it optimizes and the case that overrides it. A threshold you can't justify is a guess.

### 6a. Typography
- **Default:** **1** UI typeface (system-ui / Inter-class sans). Add **1** monospace **only** if the app shows code or numeric tabular data (max **2** faces total).
- **Weights:** ≤ **3** per screen (e.g., 400 / 500 / 600).
- **Sizes:** ≤ **4** distinct sizes per screen, drawn from a fixed scale: `text-xs`12 · `text-sm`14 · `text-base`16 · `text-lg`18 · `text-xl`20 · `text-2xl`24. Body 14–16.
- **Optimizes:** coherence + legible hierarchy from a tiny, repeatable system.
- **Override:** data-dense tables may add the mono face (still ≤2); an expressive/marketing brief may add a display weight/size — a conscious brief change, not the utility default.

### 6b. Color & signal
- **Default:** monochrome base from a single neutral ramp (e.g., Tailwind `zinc`/`neutral` 50→950) **+ one accent** reserved for the primary path to outcome. Dark mode uses a deliberate near-black (`zinc-950` / ~`#0a0a0a`), **not** pure `#000`.
- **Accent usage:** ≤ **1** primary-action element per view (§1.9).
- **Optimizes:** the accent *means* "the way forward" — signal stays unambiguous.
- **Override / EXCEPTION:** semantic + data-viz color per §5. Never accent decoratively (K2).

### 6c. Spatial geometry
- **Grid:** 4pt grid mandatory, enforced **only** through Tailwind scale steps. **Default step 8pt** (`*-2` = 8px); 4pt half-steps (`*-1` = 4px) allowed for tight intra-component spacing.
- **Kill-criterion:** fires on off-grid arbitrary values (`p-[7px]`), **not** on valid 4pt half-steps (K1).
- **Density metric (testable):** on a utility/work screen, primary content occupies **≥ 50%** of the above-the-fold area, and non-content whitespace stays **≤ ~40%** above the fold. Section padding `p-4`→`p-6` (16–24px); component padding `p-2`→`p-4`; avoid `p-12`+ on tools.
- **Optimizes:** information density appropriate to a single-purpose tool.
- **Override:** touch-primary or accessibility contexts increase target/gap sizes; marketing/landing screens intentionally invert the whitespace ratio toward generous rhythm.

### 6d. Aesthetic anti-clause — "sharp" = restraint, not decoration (kill-criteria)
Reject the default generated-UI look. Each is a kill-criterion (K5), each with the narrow case that overrides it.
| Reject (kill) | Cap / rule | Override (the only valid case) |
|---|---|---|
| **Gratuitous gradients** | Solid fills; gradient only as data-viz encoding. | A gradient that encodes data (heatmap, scale). |
| **Glassmorphism** (`backdrop-blur` + translucency as decor) | Opaque surfaces. | A true overlay **scrim** dimming content beneath a modal/sheet. |
| **Oversized border-radius** | Utility surfaces `rounded-md`/`rounded-lg` (6–8px); pills (`rounded-full`) only for tags/badges/avatars. Reject `rounded-3xl`+ on cards/containers. | A consciously playful/marketing brief (documented deviation). |
| **Heavy drop shadows** | `shadow-sm`/`shadow` for genuine elevation only. Reject `shadow-2xl` decoration. | Real floating elements: menus, popovers, dialogs. |
| **Centered-hero layout on a utility** | Dense, top-aligned working layout. | A genuine single-action focus screen (login, one-field utility) where one centered action *is* the screen. |

---

## Global rules for applying this manual
- Prefer **definitive, testable** statements over advice. "Cap nav at 5±2," not "keep it simple."
- If you reference a real app, cite only **observable, externally visible** patterns (e.g., "Raycast-class: near-zero animation on repeated actions"); mark any claim about *why* they did it as **inference**, not fact.
- Obey your own economy: dense, scannable, no filler — in the manual and in what you generate.

*End of manual. No screen ships without passing §0 → §2 → §3.*
