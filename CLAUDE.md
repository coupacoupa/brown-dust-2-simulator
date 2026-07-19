# Brown Dust 2 Simulator

Team builder and turn-by-turn damage simulator for Brown Dust 2 boss content
(Fiend Hunt / Guild Raid). Next.js App Router + React 19 + Tailwind 4,
TypeScript strict, pnpm. Client-side only — persistence is versioned
localStorage (`lib/storage.service.ts` is the single facade; swapping in a
backend means replacing that file).

## File naming

Non-route files carry a role suffix (kebab base + `.role.ts`), so a file's
job is legible from its name and imports:

- `.type.ts` — type-only modules (`domain.type.ts`, `engine.type.ts`).
- `.constant.ts` — pure data / static maps, no behavior (`elements.constant.ts`).
- `.util.ts` — pure stateless helper functions (`format.util.ts`, `condition.util.ts`).
- `.service.ts` — logic modules (`storage.service.ts`, `actions.service.ts`).
- `.data.ts` — hand-edited domain catalogs (`characters.data.ts`).
- `.hook.ts` — React hooks (`use-team-workspace.hook.ts`).
- `.component.tsx` — React components (`boss-hud.component.tsx`).

Exceptions keep their required names: `app/` router files (`page.tsx`,
`layout.tsx`, …) and barrel entrypoints (`lib/sim/engine/index.ts`).

## Commands

- `pnpm dev` / `pnpm build` / `pnpm lint` / `pnpm typecheck`
- `pnpm test` — Vitest is configured; the test suite lands once the current
  engine redesign is signed off (do not add tests before then).

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
              resolution), characters (template/roster sync), storage
              (versioned localStorage facade), assets, format, elements.
  sim/        The simulation core — see below.
data/         Hand-edited catalogs, data only: characters (the roster
              source of truth), bosses (seed configs).
domain.type.ts  All shared domain types, incl. the Condition union and the
                SkillEffect family union.
```

## Domain model (`domain.type.ts`)

- **`Condition`** — the single vocabulary for every "only if / only while"
  rule in skill data (`chain_min`, `enemy_has`, `self_has`, `not`, …). One
  evaluator: `lib/sim/engine/condition.util.ts`. Never add a bespoke
  condition field to a type — extend this union and the evaluator's switch
  (it is exhaustive; TS flags unhandled kinds).
- **`SkillEffect`** — a discriminated union by effect family (StatBuff,
  EnemyDebuff, PropertyVulnerability, Augmentation, EnergyGuard, Counter,
  ReactiveBuff, Heal, Dot, Simple). Families carry only their own fields, so
  invalid combinations are type errors. New mechanics = new variant (or a
  field on the right family), never a new optional on all effects.
- Skills gate `conditionalScaling` via `Skill.conditional` (a `Condition`);
  there is deliberately NO fallback condition — data must declare it.

## Simulation core (`lib/sim/`)

ESLint enforces that `lib/sim/**` never imports React/Next or the UI layer —
it is a pure, framework-free engine.

- `targeting.util.ts` — pure grid geometry (3-col × 4-row grids, flat index =
  row·3+col; shapes and custom hitbox patterns).
- `actions.service.ts` — the battle rules shared by BOTH the engine and the UI:
  `resolveAction` (turn action → name/SP/scaling/shape/approach, incl. burst
  tiers and potentials), `computeSpTimeline`, `getSkillCooldownState`,
  `resolveTargetOrigin`. Never re-implement these in a component — that's
  exactly the drift this module exists to prevent.
- `engine/` — the simulation engine; import from `@/lib/sim/engine` (the
  sibling modules are internal wiring). Split by concern:
  - `engine.type.ts` — BattleState, ActiveEffect, DamageBand, TurnResult.
  - `condition.util.ts` — `evaluateCondition(cond, ctx)`, the one evaluator
    behind every Condition; call sites choose the moment (per-hit vs at-cast)
    by what context they pass.
  - `state.service.ts` — BattleState lifecycle: create/clone, summon
    bookkeeping, upsert, duration tick.
  - `effect-behaviors.service.ts` — HOW each effect family enters the battle
    (`applyEffects`): instantaneous families (heals, HP costs, duration
    extension) vs lingering ActiveEffects, resonance, DoT snapshots (post-cast
    caster stats; energy-guard shields deliberately snapshot pre-cast stats).
    No damage arithmetic here, ever.
  - `stats.service.ts` + `damage.service.ts` — THE formula. Additive stat
    brackets (`stat × (100% + Σbuffs − Σdebuffs)`), then per hit:
    `ATK × Skill% × Defense × Property × Chain × (Vuln+Augment) × Weak × Crit`.
    Aligned to the community BD2 reference; keep the whole formula readable in
    these two files — a design invariant.
  - `incoming.service.ts` — boss casts against the team: target seeking,
    evasion → barrier → energy guard → HP, counters, deaths.
  - `turn.service.ts` — `simulateTurn`, a pure step function written as an
    explicit phase pipeline: preemptives → summons → ally actions → DoT tick
    → boss cast → counters → reactive procs → duration tick. Never mutates
    its input state.
  - `session.service.ts` — `simulateIncremental`: checkpoints every turn
    boundary and re-simulates only from the first changed turn (turn setups
    diffed by reference — the sequencer preserves identity of untouched
    turns). `createSimulationCache` is the render-safe wrapper the workspace
    hook uses. Boss rotation is derived here from `bossCastOffset` + turn
    index; it never leaks to callers.
  - `index.ts` — public surface: `runSimulation` (one-shot convenience),
    `simulateIncremental`, `createSimulationCache`, `simulateTurn`,
    `createBattleState`.
  - SP and cooldowns are NOT enforced in the engine; the UI flags violations
    but the script always executes as written.
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
- Storage schema: bump `SCHEMA_VERSION` in `lib/storage.service.ts` on any
  breaking change to persisted shapes — pre-1.0 there are no in-place
  migrations, older data is cleared and reseeded.
- Boss level changes go through `applyBossLevel` (lib/bosses.service.ts).
- Bosses have exactly one rotation shape: `skillDefs` + `rotation`, read via
  `resolveBossRotation`. (The legacy flat `skills` array is gone.)
