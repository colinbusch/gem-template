# GEM Template — Workflow State

> **Purpose**: Cross-agent handoff log. Every agent appends one entry when they finish a task
> so the next agent starts with full context. Never delete entries — append only.
>
> **Format**: `## [ISO date] Agent Name — Task` then bullet points.

---

## How to use this file

1. **Before starting work** — read the last 3–5 entries to understand current state.
2. **After finishing work** — append an entry using the template below.
3. **On failure** — append an entry tagged `[BLOCKED]` with the exact error and what you tried.

### Entry template

```
## [YYYY-MM-DD] <Agent Name> — <what you did>

- Status: DONE | BLOCKED | PARTIAL
- Branch: <branch name>
- Changed: <comma-separated file list>
- Summary: <1–3 bullets of what changed and why>
- Unresolved: <anything the next agent must know or finish>
```

---

## Log

## [2026-04-12] Agents Orchestrator — Initial scaffold

- Status: DONE
- Branch: (repo not yet initialised — working on main worktree)
- Changed: All files — initial template scaffold
- Summary:
  - SvelteKit 5 + Tailwind CSS 4 + shadcn-svelte project created
  - `src/lib/config.ts` is the single client-customisation surface
  - `src/lib/i18n.ts` holds all UI copy in `de` + `en`
  - Rune-based state in `lang.svelte.ts` and `theme.svelte.ts`
  - `.cursor/rules/gem-template.mdc` encodes all agent contracts
- Unresolved:
  - Git repo not initialised — no commits, no branches, no hooks
  - Git Workflow Master must run the setup in the "Next Steps" section below

---

## Next Steps (for Git Workflow Master)

Run the following in order. Do not skip steps.

### 1. Initialise the repository

```bash
git init
git checkout -b main
```

### 2. Install Lefthook (git hook runner — no Node dependency at hook time)

```bash
npm install --save-dev lefthook
```

Create `lefthook.yml` in the project root:

```yaml
pre-commit:
  commands:
    format:
      run: npm run format && git add -A
    typecheck:
      run: npm run check
      fail_text: 'Type errors found. Fix before committing.'

commit-msg:
  scripts:
    'validate-msg.sh':
      runner: bash
```

Create `.lefthook/commit-msg/validate-msg.sh`:

```bash
#!/usr/bin/env bash
# Enforce Conventional Commits — see gem-template.mdc for format
MSG=$(cat "$1")
PATTERN="^(feat|fix|chore|refactor|style|docs|test)(\(.+\))?: .{1,72}$"
if ! echo "$MSG" | grep -qE "$PATTERN"; then
  echo "❌ Commit message must follow Conventional Commits format:"
  echo "   <type>(<scope>): <description under 72 chars>"
  echo "   Types: feat | fix | chore | refactor | style | docs | test"
  exit 1
fi
```

```bash
npx lefthook install
```

### 3. Create the branch structure

```bash
# First commit on main
git add .
git commit -m "chore: initial GEM template scaffold"

# Create dev integration branch
git checkout -b dev
git checkout main
```

### 4. Protect main (after pushing to GitHub/Gitea)

Set branch protection rules:

- `main` — require PR, require CI to pass, no force push
- `dev` — require PR from feature branches

### 5. Tag the baseline

```bash
git tag -a v0.1.0 -m "chore: initial template baseline"
```

### 6. Append a log entry here when done

Use the entry template at the top of this file.
