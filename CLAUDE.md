# Brown Dust 2 Simulator

Team builder and turn-by-turn damage simulator for Brown Dust 2 boss content
(Fiend Hunt / Guild Raid). Next.js App Router + React 19 + Tailwind 4,
TypeScript strict, pnpm. Client-side only — persistence is localStorage
(`lib/storage.service.ts` is the single facade; swapping in a backend means
replacing that file).

## File naming

Non-route files carry a role suffix (kebab base + `.role.ts`), so a file's
job is legible from its name and imports:

- `.type.ts` — type-only modules (`domain.type.ts`, `engine.type.ts`).
- `.constant.ts` — pure data / static maps, no behavior (`elements.constant.ts`).
- `.util.ts` — pure stateless helper functions (`format.util.ts`, `targeting.util.ts`).
- `.service.ts` — logic modules (`storage.service.ts`, `actions.service.ts`).
- `.data.ts` — hand-edited domain catalogs (`characters.data.ts`).
- `.hook.ts` — React hooks (`use-team-workspace.hook.ts`).
- `.component.tsx` — React components (`boss-hud.component.tsx`).

Exceptions keep their required names: `app/` router files (`page.tsx`,
`layout.tsx`, …) and barrel entrypoints (`lib/sim/engine/index.ts`).

## Commands

- `pnpm dev` / `pnpm build` / `pnpm lint`
- Typecheck: `npx tsc --noEmit`
- No test suite (deliberate — solo project).

## Layout

(Names below drop the role suffix for brevity — see "File naming".)

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
lib/          Logic. bosses (seed parsing, applyBossLevel, rotation
              resolution), storage, assets, format, elements.
  sim/        The simulation core — see below.
data/         Hand-edited catalogs, data only: characters (the roster
              source of truth), bosses (seed configs).
domain.type.ts  All shared domain types.
```

## Simulation core (`lib/sim/`)

- `targeting.util.ts` — pure grid geometry (3-col × 4-row grids, flat index =
  row·3+col; shapes and custom hitbox patterns).
- `actions.service.ts` — the battle rules shared by BOTH the engine and the UI:
  `resolveAction` (turn action → name/SP/scaling/shape/approach, incl. burst:
  +40% scaling and +1 SP per level), `computeSpTimeline`,
  `getSkillCooldownState`, `resolveTargetOrigin`. Never re-implement these in
  a component — that's exactly the drift this module exists to prevent.
- `engine/` — the simulation engine; import from `@/lib/sim/engine` (the
  sibling modules are internal wiring). Split by concern: `engine.type.ts`
  (BattleState, DamageBand, TurnResult, …), `state.service.ts` (effect store:
  create/clone/apply/tick), `stats.service.ts` (buffed stats at action time),
  `damage.service.ts` (one resolved action → damage bands + analytics event),
  `element-advantage.util.ts`, `turn.service.ts` (`simulateTurn` — pure step
  function, `BattleState` in → `{ result, next }` out, never mutates its input,
  so turn boundaries can be cached/forked), `index.ts` (`runSimulation`, a fold
  over simulateTurn, plus the public re-exports). SP and cooldowns are NOT
  enforced here; the UI flags violations but the script always executes as
  written.
- `breakdown.service.ts` — formula-panel analytics, derived from
  `ActionDamageEvent`s the engine emits per damaging action. New analytics
  belong here, not interleaved with the damage math.

## Conventions

- Import via the `@/` alias, never `../..` chains.
- Element→color palettes: shared ones live in `lib/elements.constant.ts`;
  palettes used by a single component stay local to it.
- `formatNumber` / `formatCompact` / `getInitials` come from
  `lib/format.util.ts` — don't redefine them.
- Storage reads happen post-mount (SSR renders a loading state). New pages use
  `useClientState`, not a hand-rolled `useEffect(setState)`.
- Boss level changes go through `applyBossLevel` (lib/bosses.service.ts).
- Legacy shape: stored bosses may still carry the flat `skills` array;
  `resolveBossRotation` is the single read path that handles old and new
  (`skillDefs` + `rotation`) shapes.
