# Brown Dust 2 Simulator

A team builder and turn-by-turn damage simulator for Brown Dust 2 boss content
(Fiend Hunt / Guild Raid). Build a team, script each turn, and see the resolved
damage bands (min / expected / max) with a per-multiplier formula breakdown.

Client-side only — all persistence is `localStorage`, so there's no backend to
run.

## Tech stack

- **Next.js** (App Router) + **React 19**
- **Tailwind CSS 4**
- **TypeScript** (strict)
- **pnpm**

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm lint` — lint
- `npx tsc --noEmit` — typecheck

There is no test suite (deliberate — solo project).

## Project layout

```
app/          Routes only — thin pages composing hooks + components.
components/   Feature components + sequencer/ (the battle workspace) + ui/.
hooks/        Team-page state + autosave, localStorage hydration.
lib/          Logic: bosses, storage, assets, format, elements.
  sim/        The simulation core — targeting, action rules, engine, analytics.
data/         Hand-edited catalogs: characters (roster) + bosses (seed configs).
```

See [CLAUDE.md](CLAUDE.md) for the full architecture notes, file-naming
conventions, and simulation-core walkthrough, and
[docs/character-update-checklist.md](docs/character-update-checklist.md) for how
character skill data is sourced and encoded.
