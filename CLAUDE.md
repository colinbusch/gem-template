# GEM Template — Claude Code context

## What this is

A reusable SvelteKit 5 landing-page template for German trade businesses (Handwerksbetriebe).
Swapping `src/lib/config.ts` is the only change needed to deploy for a new client.

## Stack

- SvelteKit 5 (Runes API — no legacy Options API anywhere)
- Tailwind CSS 4
- shadcn-svelte
- TypeScript strict
- `adapter-node` → Hetzner VPS via Coolify

## Key files

| File                         | Role                                                               |
| ---------------------------- | ------------------------------------------------------------------ |
| `src/lib/config.ts`          | All client identity: brand, contact, services, meta, OG            |
| `src/lib/i18n.ts`            | All UI copy in `de` + `en`                                         |
| `src/lib/lang.svelte.ts`     | Active language rune state                                         |
| `src/lib/theme.svelte.ts`    | Active theme rune state                                            |
| `src/lib/components/`        | Always-on chrome: Navbar, Footer, LangSwitch, ThemeSwitch          |
| `src/lib/ui/`                | Page sections: Hero, ServiceCards, WhyUs, QuoteForm, PartnerBanner |
| `src/routes/+page.server.ts` | Form action — WhatsApp redirect + optional Resend email            |

## Formatting

Tabs · single quotes · no trailing commas · 100 char width. Run `npm run format` after edits.

## Agents working in this repo

- **Frontend Developer** — UI components and i18n
- **DevOps Automator** — build config, CI/CD, deployment
- **Git Workflow Master** — branches, PRs, release sequencing
- **Agents Orchestrator** (this session) — cross-cutting coordination

Full ruleset: `.cursor/rules/gem-template.mdc`
