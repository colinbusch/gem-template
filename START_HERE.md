# START HERE — HurrCut rebuild handoff for Claude Code

This bundle is a **drop-in repo seed**. It gives Claude Code the project's constitution, the design law, the full spec, a working reference prototype, and the token foundation — so it can execute the rebuild without re-doing discovery.

## What's in here
```
CLAUDE.md                      ← the behavioral contract (loads every session)
START_HERE.md                  ← this file
docs/
  extraction.md                ← current product: surface, data model, states, gaps
  minimal-ui-manual.md          ← the design ruleset (the "law" / per-screen gate)
  rebuild-tasks.md              ← phased, checkable backlog
reference/
  HurrCutEditor.prototype.jsx   ← rebuilt /web editor (sandbox prototype)
  README.md                     ← what to keep vs. undo when porting it
config/
  tailwind.config.ts            ← tokens: neutral base + 1 accent + signal palette
  globals.css                   ← light/dark variables, global focus + reduced-motion
```

## How to use it with Claude Code
1. Put these files at the **root of an empty repo**. `CLAUDE.md` must sit at the repo root — Claude Code auto-loads it into context at the start of every session, and it survives compaction. (Mechanism: Anthropic's Claude Code memory docs, https://docs.anthropic.com/en/docs/claude-code/memory.) The `@docs/...` lines in CLAUDE.md import the spec files so they ride along automatically.
2. Make sure Claude Code is installed (`npm i -g @anthropic-ai/claude-code`) and run `claude` from the repo root.
3. Give it this first prompt (it routes the rest off `docs/rebuild-tasks.md`):

> Read CLAUDE.md and the imported docs. Execute Phase 0 (scaffold + tooling) and Phase 1 (tokens + UI primitives) from docs/rebuild-tasks.md. Use config/tailwind.config.ts and config/globals.css as the token foundation. Stop after Phase 1 and show me the primitives demo before continuing.

Then proceed phase by phase. Don't let it skip the per-screen gate (manual §2/§3) — that's the quality bar.

## What's already decided (so Claude Code doesn't re-litigate)
- Greenfield **React + TS + Tailwind + Vite (SPA)** — not a port of the old SvelteKit code.
- **Export is the single accent**; monochrome neutral base; timeline colors are the sanctioned data-viz exception.
- The **data model is the contract** (preserve all `TimelineClip` fields).
- The **video engine is not regenerated from the prototype** — port the real one or integrate behind an interface.

## What's intentionally left to Claude Code
- The full app scaffold (let it run `npm create vite` fresh — don't hand it a stale package.json).
- All secondary routes (`/`, `/login`, `/settings`, `/about`) and the `/matrix` **auth guard** (the old route was public — see extraction obs. #9).
- Engine integration + OPFS/FSA persistence.
- Responsive/mobile behavior below 1080px (the old app lacked it; a true mobile editor is a separate design).

## Honest scope note
The prototype's preview, playback, and export are **simulated stand-ins** for the artifact demo. The real editing engine (Canvas 2D compositing, 3 Web Workers, MediaRecorder export, FFmpeg WASM, OPFS/FSA) is load-bearing and is Phase 9 work — carry it over from the existing app rather than rebuilding it naively.

## Optional refinements
- For large context budgets, you can move `docs/extraction.md` out of CLAUDE.md's imports and into Claude Code's `.claude/rules/` (scoped to load only when relevant files are touched), keeping the always-on contract lean. The manual should stay imported — it's the law.
- Claude Code's auto-memory (v2.1.59+) will accumulate build commands and architecture notes as it works; that's complementary to CLAUDE.md, not a replacement.
