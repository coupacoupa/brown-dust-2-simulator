# Brown Dust 2 Simulator

Team builder and turn-by-turn damage simulator for Brown Dust 2 boss content
(Fiend Hunt / Guild Raid). Next.js App Router + React 19 + Tailwind 4,
TypeScript strict, pnpm. Client-side only — persistence is localStorage
(`lib/storage.ts` is the single facade; swapping in a backend means replacing
that file).

## Commands

- `pnpm dev` / `pnpm build` / `pnpm lint`
- Typecheck: `npx tsc --noEmit`
- No test suite (deliberate — solo project).

## Layout

```
app/          Routes only — thin pages that compose hooks + components.
components/   Feature components (one file each) + sequencer/ + ui/.
  sequencer/  The battle workspace, split along its columns: turn-sequencer
              (orchestrator), timeline-cards, options-deck, boss-hud,
              boss-skill-queue, sp-gauge.
  ui/         Shared primitives: element-icon, portrait-card,
              card-skill-background, hitbox-thumbnail.
hooks/        use-team-workspace (all team-page state + autosave),
              use-client-state (the one sanctioned localStorage-hydration
              effect — use it for any new storage-backed page).
lib/          Logic. bosses.ts (seed parsing, applyBossLevel, rotation
              resolution), storage.ts, assets.ts, format.ts, elements.ts.
  sim/        The simulation core — see below.
data/         Hand-edited catalogs, data only: characters.ts (the roster
              source of truth; scripts/generate-roster.mjs scaffolds new
              entries but never overwrites this), bosses.ts (seed configs).
types.ts      All shared domain types.
```

## Simulation core (`lib/sim/`)

- `targeting.ts` — pure grid geometry (3-col × 4-row grids, flat index =
  row·3+col; shapes and custom hitbox patterns).
- `actions.ts` — the battle rules shared by BOTH the engine and the UI:
  `resolveAction` (turn action → name/SP/scaling/shape/approach, incl. burst:
  +40% scaling and +1 SP per level), `computeSpTimeline`,
  `getSkillCooldownState`, `resolveTargetOrigin`. Never re-implement these in
  a component — that's exactly the drift this module exists to prevent.
- `engine.ts` — `runSimulation(characters, boss, turns)`: deterministic turn
  loop (buffs/debuffs, chains, crit-expected damage). SP and cooldowns are
  NOT enforced here; the UI flags violations but the script always executes
  as written.
- `breakdown.ts` — formula-panel analytics, derived from `ActionDamageEvent`s
  the engine emits per damaging action. New analytics belong here, not
  interleaved with the damage math.

## Conventions

- Import via the `@/` alias, never `../..` chains.
- Element→color palettes: shared ones live in `lib/elements.ts`; palettes
  used by a single component stay local to it.
- `formatNumber` / `formatCompact` / `getInitials` come from `lib/format.ts` —
  don't redefine them.
- Storage reads happen post-mount (SSR renders a loading state). New pages use
  `useClientState`, not a hand-rolled `useEffect(setState)`.
- Boss level changes go through `applyBossLevel` (lib/bosses.ts).
- Legacy shape: stored bosses may still carry the flat `skills` array;
  `resolveBossRotation` is the single read path that handles old and new
  (`skillDefs` + `rotation`) shapes.
