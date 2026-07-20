# reference/ — the editor prototype

`HurrCutEditor.prototype.jsx` is the rebuilt `/web` editor, generated for the **claude.ai artifact sandbox**. It is a faithful reference for the *target* look and interaction model — mine it, don't paste it.

## Keep (the intent)
- The 5-row editor layout and the 3-column workspace.
- The interaction model: clip select → inspector, drag move/trim, ruler scrub, ⌘K palette, keyboard map, undo granularity (one entry per gesture).
- The state coverage: boot skeleton, determinate export progress, empty states, the missing-media error with relink/remove, AI running/result/insufficient-credits.
- The design calls: monochrome base, **Export as the single accent** (distinct from the cyan video color), timeline colors as the data-viz exception.

## Undo (sandbox-only constraints that don't apply in the repo)
- **Bracket values:** the prototype avoids *all* Tailwind arbitrary values because the sandbox has no JIT compiler. In the repo, JIT is on — follow the real rule (CLAUDE.md #1): no off-grid *spacing*, brackets ok for non-spacing one-offs.
- **Theming:** the `tokens(dark)` class-map is a hack around the sandbox. Delete it; use `darkMode: 'class'` + the CSS variables in `config/globals.css`.
- **Persistence:** prototype uses `useState` only (artifacts forbid storage). Real app persists `ProjectState` to OPFS + FSA sync.
- **One file:** split into `src/components/editor/*` and `src/components/ui/*`.
- **Simulated engine:** preview/playback/export are stand-ins. Replace with the real Canvas 2D renderer, Web Workers, and MediaRecorder (CLAUDE.md "Do NOT reimplement the engine from scratch").
- **Clip model:** prototype implements a subset of fields. Production covers the full 40+ `TimelineClip` set (`docs/extraction.md` §6).
