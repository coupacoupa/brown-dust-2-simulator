export type ElementType = 'fire' | 'water' | 'wind' | 'light' | 'dark';
export type DamageType = 'physical' | 'magic' | 'pure';
export type ApproachType = 'very_front' | 'vault';

export type TargetShape =
  | 'single'
  | 'row'       // Horizontal row (3 tiles)
  | 'col'       // Vertical column (4 tiles)
  | 'plus'      // Plus shape (+): Center, Top, Bottom, Left, Right
  | 'cross'     // Cross shape (X): Center, Top-Left, Top-Right, Bottom-Left, Bottom-Right
  | 'square'    // 2x2 area centered at target
  | 'all';      // All 12 tiles (3x4)

// ---------------------------------------------------------------------------
// Conditions — the single vocabulary for every "only if / only while <state>"
// rule in skill data. One declaration shape, one evaluator
// (lib/sim/engine/condition.util.ts). The evaluation MOMENT is decided by the
// call site: conditional-scaling checks run per hit (the chain counter
// advances mid-action); effect apply-conditions run once at cast against the
// caster's pre-cast buffs.
//   chain_*      — the team's current chain counter.
//   enemy_*      — state on the boss (debuffs, stat sheet).
//   recipient_*  — the character an effect is landing on.
//   self_has     — buffs the CASTER already carries (pre-cast snapshot).
//   not          — negation; compose for "apply X, but Y instead if <cond>".
// ---------------------------------------------------------------------------
export type Condition =
  | { kind: 'chain_min'; value: number }         // chain ≥ value
  | { kind: 'chain_max'; value: number }         // chain ≤ value
  | { kind: 'chain_multiple_of'; value: number } // chain > 0 and divisible by value
  | { kind: 'enemy_has'; effect: 'dot' | 'vulnerability' | 'taunt_or_concentrated_fire' }
  | { kind: 'enemy_debuff_count'; min: number }  // distinct debuffs (incl. DoTs) on the enemy
  | { kind: 'enemy_is_physical' }                // boss deals physical damage (default when unlabeled)
  | { kind: 'recipient_element'; element: ElementType }
  | { kind: 'self_has'; buff: 'augmentation' | 'stat_reinforcement' }
  | { kind: 'not'; condition: Condition };

// ---------------------------------------------------------------------------
// Skill effects — a discriminated union by effect family. Every family
// carries only the fields that mean something for it, so an invalid
// combination (a DoT with a shield pool, a heal with a chain scope) is a
// type error instead of silently-ignored data. Shared fields live on
// EffectBase; the engine dispatches on `type`.
// ---------------------------------------------------------------------------

export type EffectTarget = 'self' | 'all_allies' | 'area_allies' | 'target_enemy' | 'all_enemies';

export interface EffectBase {
  id: string;
  value: number;    // magnitude — % for stats/damage/heals, count for evasion charges
  duration: number; // turns (for 'dot': number of ticks)
  target: EffectTarget;
  // Apply-gate: the effect only lands when this holds at cast, evaluated
  // against the caster's PRE-cast buffs and the chain count at cast. Encode
  // "apply X, but Y instead if <cond>" as two effects: the alternative gated
  // on the condition, the base gated on { kind: 'not', condition: <same> }.
  condition?: Condition;
  // Multiplies `value` when the condition holds for the recipient at cast,
  // e.g. Refithea's "doubled for Light allies":
  //   amplify: { when: { kind: 'recipient_element', element: 'light' }, multiplier: 2 }
  amplify?: { when: Condition; multiplier: number };
  isIrremovable?: boolean; // survives dispel/buff-removal
}

// Stat Reinforcement — feeds the additive stat bracket (stats.service).
export interface StatBuffEffect extends EffectBase {
  type: 'buff_atk' | 'buff_matk' | 'buff_crit_rate' | 'buff_crit_dmg' | 'buff_prop_dmg';
  // Authored stack semantics from the game text (Ikaruga, Yuri). The sim
  // applies `value` per cast and refreshes same-source casts; stack caps are
  // recorded but not yet enforced.
  stacks?: number;
  maxStacks?: number;
}

// Stat Weakening / vulnerability debuffs sitting on the enemy.
export interface EnemyDebuffEffect extends EffectBase {
  type:
    | 'debuff_def'
    | 'debuff_mres'
    | 'debuff_atk'   // reduces the boss's physical damage to the team
    | 'debuff_matk'  // reduces the boss's magic damage to the team
    | 'debuff_vulnerability'
    | 'debuff_dot_vulnerability';
}

// Property (elemental) vulnerability on the enemy, element-scoped when set.
export interface PropertyVulnerabilityEffect extends EffectBase {
  type: 'debuff_property_vulnerability';
  element?: ElementType; // e.g. 'dark'; omitted → applies to every attacker
}

// DMG-increase (augmentation) — joins the vulnerability bracket per hit.
export interface AugmentationEffect extends EffectBase {
  type: 'buff_augmentation';
  // Which actions it boosts: 'all' (default) → every damage instance;
  // 'basic_attack' → only Normal Attacks (Yozakura's follow-up).
  augmentScope?: 'all' | 'basic_attack';
  // Only boosts hits at/above this chain (Liberta's "10+ Chains"). Per hit.
  augmentChainMin?: number;
  // Only boosts hits at/BELOW this chain (Teresse). Per hit.
  chainLimit?: number;
  // Resonance — the value stacks with matching state at cast:
  //   'stat_weakening' | 'dot' | 'buff' — per matching state on the ENEMY,
  //     value × (targets × resonateMultiplier) stacks, capped at maxStacks.
  //   'target_debuff_count' — ABSORBS (cleanses) the recipient's debuffs:
  //     +resonateMultiplier per debuff absorbed, capped at maxStacks.
  resonateCondition?: 'stat_weakening' | 'dot' | 'buff' | 'target_debuff_count';
  resonateMultiplier?: number;
  stacks?: number;
  maxStacks?: number;
}

// Energy Guard — a shield pool snapshotted at cast, soaked before HP.
export interface EnergyGuardEffect extends EffectBase {
  type: 'buff_energy_guard';
  // 'recipient_hp' (default) → value% × the recipient's Max HP;
  // 'caster_matk' → value% × the CASTER's Magic ATK at cast (Diana's aura).
  egScalingStat?: 'recipient_hp' | 'caster_matk';
  egRegen?: boolean; // refill the pool to full each turn
}

// Counter — retaliation fired per boss hit the holder receives.
export interface CounterEffect extends EffectBase {
  type: 'buff_counter';
  // 'max_hp' (default) → value% × holder's Max HP; 'atk' → holder's ATK (Blade).
  counterStat?: 'max_hp' | 'atk';
}

// Reactive — fires a payload once per hit the holder receives (Seir, Mamonir).
export interface ReactiveBuffEffect extends EffectBase {
  type: 'buff_reactive';
  reactiveEffect?: SkillEffect; // payload; its `target` decides who it lands on
  reactiveMaxTriggers?: number; // total procs before the buff expires
}

// Heals — instantaneous HP restoration.
export interface HealEffect extends EffectBase {
  type: 'heal_continuous' | 'heal_self_hp_percent';
  // 'recipient_hp' (default) → value% × recipient Max HP; 'caster_matk' → caster's MATK.
  healSource?: 'recipient_hp' | 'caster_matk';
}

// Damage-over-time on the enemy; per-tick damage snapshotted at cast.
export interface DotEffect extends EffectBase {
  type: 'dot';
  dotSource?: 'caster_atk' | 'caster_matk' | 'enemy_atk' | 'enemy_maxhp';
  dotLabel?: string;  // display label: "Poison", "Bleed", "Burn"
  stacks?: number;    // stacks this application counts as (default 1)
  maxStacks?: number; // stack cap per dotLabel on the enemy
}

// Families whose value/duration/target say everything.
export interface SimpleEffect extends EffectBase {
  type:
    | 'buff_barrier'             // % damage reduction; barriers stack multiplicatively
    | 'buff_evasion'             // value = dodge charges
    | 'buff_chain_reinforcement' // extra chain per damage instance
    | 'buff_taunt'
    | 'buff_duration_extend'     // extends active buff/debuff durations by value turns
    | 'buff_transform'           // costume transform: SP costs drop to 0
    | 'buff_sp_reduce'
    | 'buff_revive'              // declared for display; deaths are permanent in-sim
    | 'target_avoidance'         // declared for display; not simulated
    | 'debuff_concentrated_fire'
    | 'gain_sp'                  // instantaneous; consumed by the SP timeline pass
    | 'burn_sp'                  // declared for display; hunt bosses have no SP pool
    | 'consume_hp_percent';      // costs the recipient value% of current HP
}

export type SkillEffect =
  | StatBuffEffect
  | EnemyDebuffEffect
  | PropertyVulnerabilityEffect
  | AugmentationEffect
  | EnergyGuardEffect
  | CounterEffect
  | ReactiveBuffEffect
  | HealEffect
  | DotEffect
  | SimpleEffect;

// Every effect discriminant, for stores that track effects generically.
export type EffectKind = SkillEffect['type'];

// A persistent "Allied Zone" summon created by a skill (e.g. Diana's Magic
// Amplifier). Once created it acts every turn, re-applying `effect` to allies
// within its zone and adding one stack per turn up to `maxStacks`; the applied
// buff's value is `effect.value × currentStacks`.
export interface SummonSpec {
  id: string;                        // stable id (also tags the applied buff)
  hitboxPattern: [number, number][]; // zone/attack shape, relative to the summoner
  duration: number;                  // summon lifetime in turns
  // --- Buff summon (Diana's Magic Amplifier): each turn re-applies `effect` to
  //     allies in its zone, ramping one stack (≤ maxStacks) per turn.
  effect?: SkillEffect;              // per-STACK buff applied to the zone each turn
  maxStacks?: number;                // cap on accumulated stacks
  // --- Damage summon (Morpeah's Personas): on its turn it attacks the boss for
  //     `scaling`% of the summoner's ATK/MATK, then (if selfDestruct) vanishes.
  attack?: {
    scaling: number;
    hitCount: number;
    damageType: DamageType;
    scalingStat?: 'atk' | 'matk';
    effects?: SkillEffect[];         // debuffs/DoTs applied on detonation (e.g. MRES shred)
    selfDestruct?: boolean;          // removed after attacking once
  };
}

export interface Skill {
  id: string;
  name: string;
  hitCount: number; // number of hits (for chain building)
  summon?: SummonSpec | SummonSpec[]; // creates Allied Zone summon(s) on cast
  damageType: DamageType;
  scalingStat?: 'atk' | 'matk' | 'enemy_maxhp' | 'caster_hp';
  energyGuardScaling?: number; // secondary scaling based on current Energy Guard
  targetShape?: TargetShape;
  // Gates the upgrades' `conditionalScaling`: damage instances where this
  // holds use the conditional scaling instead of the base one. Evaluated per
  // hit (the chain counter advances mid-action). Required whenever any
  // upgrade declares conditionalScaling — there is no fallback condition.
  conditional?: Condition;
  // Higher scaling applied ONLY to the Main Target tile — the origin ([0,0])
  // of an AoE, i.e. the tile the tick lands on. The other covered ("arm")
  // tiles use the ordinary `scaling`. Per-level values live on CostumeUpgrade.
  mainTargetScaling?: number;
  // "Damage increases by N% per <count>" skills. `countScalingPerUnit` (per
  // level, also on CostumeUpgrade) is added to the base scaling once per unit of
  // the count: 'target' = enemy tiles hit, 'caster_buff' = caster's active
  // buffs, 'sp_spent' = SP consumed on this cast.
  countScalingSource?: 'target' | 'caster_buff' | 'sp_spent';
  countScalingPerUnit?: number;
  effects: SkillEffect[];
  icon?: string; // Optional path to skill icon asset
  // Custom hitbox pattern: array of [rowOffset, colOffset] relative to the
  // target origin tile (the tick mark in the game UI).  [0,0] = origin.
  // Positive row = down, positive col = right (deeper into boss).
  // When set this overrides the generic TargetShape-based calculation.
  hitboxPattern: [number, number][];
  // Which grid the shape is projected onto. Defaults to 'enemy'.
  targetGrid?: 'enemy' | 'ally';
  isPreemptive?: boolean; // Toggled to run automatically at start of Turn 1
  // Knockback-collision skills (Fred, Emma, Kry, Rou): their % of enemy Max HP
  // only lands if the boss can be knocked back. Zeroed when the boss lists
  // "Knockback" in its immunities.
  requiresKnockback?: boolean;
}

export interface CostumeUpgrade {
  scaling: number;
  summon?: SummonSpec | SummonSpec[]; // per-level summon override(s)
  countScalingPerUnit?: number; // per-level "damage +N% per <count>" value
  mainTargetScaling?: number; // per-level Main Target (origin tile) scaling
  energyGuardScaling?: number; // per-level Energy Guard scaling
  spCost: number;
  cooldown: number;
  hitCount?: number;
  conditionalScaling?: number;
  effects?: SkillEffect[];
}

export interface SkillPotential {
  id: string;
  type: 'damage' | 'sp_reduce' | 'cooldown_reduce' | 'range_increase' | 'effect_value_increase' | 'duration_increase' | 'conditional_damage' | 'add_effect' | 'count_scaling';
  value?: number; // e.g. 15 for +15% damage
  // For 'damage' potentials on a Main Target (split-scaling) skill: which
  // scaling the bonus applies to. 'skill' (default) → arm/base scaling only;
  // 'main' → Main Target scaling only; 'both' → both.
  scalingTarget?: 'skill' | 'main' | 'both';
  newTargetShape?: TargetShape;
  newHitboxPattern?: [number, number][];
  targetEffectId?: string; // Optional target effect ID to modify
  newEffect?: SkillEffect; // For 'add_effect': the brand-new effect this potential grants
  name?: string; // Optional user-facing custom potential label
  additionalEffects?: {
    type: 'damage' | 'sp_reduce' | 'cooldown_reduce' | 'range_increase' | 'effect_value_increase' | 'duration_increase' | 'conditional_damage' | 'add_effect' | 'count_scaling';
    value?: number;
    scalingTarget?: 'skill' | 'main' | 'both';
    targetEffectId?: string;
    newEffect?: SkillEffect;
    name?: string;
  }[];
}

export interface BurstUpgrade {
  scalingBonus?: number;
  mainTargetScalingBonus?: number; // adds to Main Target scaling only
  countScalingBonus?: number; // adds to countScalingPerUnit ("+N per <count>")
  conditionalScalingBonus?: number;
  effects?: SkillEffect[];
  newEffect?: SkillEffect;
  effectValueBonus?: number;
  durationBonus?: number;
  cooldownReduction?: number; // turns shaved off the skill's cooldown at this burst tier
  // Additional SP this tier costs, on top of the base skill cost and lower
  // tiers. Burst cost is NOT a flat +1/tier — each tier has its own price.
  // Omit to fall back to +1 for that tier.
  spCost?: number;
  resonateMultiplierBonus?: number; // Adds extra stacks per resonate target at this burst tier
  targetEffectId?: string; // Optional target effect ID to modify for resonateMultiplierBonus
}

export interface Costume {
  id: string; // Game costume id, e.g. '000101'
  name: string;
  skill: Skill;
  hasBurst?: boolean; // Can this costume use Burst?
  image?: string; // Costume/skill illustration (illust_skill_char asset)
  invenImage?: string; // Inventory illustration (illust_inven_char asset) — used by the basic-attack card
  icon?: string; // Optional path to costume skill icon
  // Approach type: 'vault' leaps over column 0, 'very_front' attacks from column 0.
  // Characters default to 'very_front' when omitted.
  approach?: ApproachType;
  // Display-only effect labels shown on the costume card, e.g. ["Knock back ↑ 1"]
  displayEffects?: string[];
  // Upgrades from +0 to +5 (array of 6 items)
  upgrades?: CostumeUpgrade[];
  // Available skill potentials
  potentials?: SkillPotential[];
  // Custom burst upgrades (exactly 3 items for Tier 1, 2, 3)
  burstUpgrades?: BurstUpgrade[];
}

export interface ActiveCostume extends Costume {
  upgradeLevel: number;
  activePotentials: string[];
}

export interface Character {
  id: string;
  charId?: string;  // Game character id, e.g. '0001'
  name: string;
  element: ElementType;
  rarity?: number;  // Star rarity, e.g. 5
  baseAtk: number;
  baseMatk: number;
  baseHp: number;       // final in-game HP as typed by the user; 0 = not entered (survival untracked)
  baseCritRate: number; // e.g. 10 for 10%
  baseCritDmg: number;  // e.g. 50 for +50% (total = 150% damage)
  baseDef: number;      // e.g. 10 for 10% physical reduction
  baseMres: number;     // e.g. 10 for 10% magic resistance
  basePropDmg: number;  // e.g. 0 for +0% property damage
  costumes: ActiveCostume[];
  level?: number;         // e.g. 100
  position?: number;      // Flat index 0-11 for allied grid placement
  image?: string;         // Optional path to character profile image
}

export type CharacterTemplate = Omit<Character, 'id' | 'costumes' | 'baseAtk' | 'baseMatk' | 'baseHp' | 'baseCritRate' | 'baseCritDmg' | 'baseDef' | 'baseMres' | 'basePropDmg'> & { costumes: Costume[] };

// A debuff that a boss skill applies to the player's team on hit.
export interface BossSkillDebuff {
  stat: 'def' | 'mres' | 'atk' | 'matk' | 'crit_rate' | 'crit_dmg' | 'accuracy';
  valuePct: number;        // reduction %, e.g. 20 for "reduce by 20%"
  durationTurns: number;   // how many turns the debuff lasts
}

// How a boss move picks its victims on the ally grid:
//   fixed    — hits `hitTiles` no matter who stands there; empty tiles whiff.
//   targeted — seeks a character starting from `targetTile`; taunt/aggro
//              overrides the seek entirely. Empty column → shift one column
//              deeper (leftward from the player's view). The victim's tile
//              anchors `hitboxPattern`, so neighbors get splashed.
//   buff     — no damage; applies `selfBuffs` to the boss.
export type BossMoveKind = 'fixed' | 'targeted' | 'buff';

// A stat buff a boss 'buff' move applies to itself. atk raises its outgoing
// damage; def/mres lower the team's damage against it.
export interface BossSelfBuff {
  stat: 'atk' | 'def' | 'mres';
  valuePct: number;
  durationTurns: number;
}

// The in-game RANGE panel for a boss move, authored exactly as the skill
// preview draws it. The panel is in the boss's own frame; because Octovius-
// style bosses face the player (to the left), the engine rotates the stamp
// (default 90° counter-clockwise) to project it onto the ally board.
//   cells / tick — panel coordinates, row 0 = top, col 0 = left.
//   anchorTile   — the flat ally-grid index the tick lands on (where the
//                  boss's attacking part reaches). depth = idx/3, flank = idx%3.
// Cells that rotate off the 3×4 board are clipped. Prefer this over `hitTiles`
// for fixed moves; the engine derives the hit tiles from it.
export interface BossRangeStamp {
  cells: [number, number][];
  tick: [number, number];
  anchorTile: number;
  rotation?: 0 | 90 | 180 | 270; // CCW degrees; default 90 (boss faces left)
}

// Full definition of one boss skill, mirroring the in-game skill preview
// panel. `id` is a stable slug so this maps 1:1 onto a `boss_skills` table
// when the catalog moves to a database.
export interface BossSkillDef {
  id: string;
  name: string;
  icon?: string;           // Optional path to boss skill icon asset
  description: string;     // rules text as shown in-game (supports {damage} placeholder)
  hitCount?: number;       // hits per cast
  scalingPct?: number;     // % of the boss's ATK dealt per hit
  damageType?: DamageType;
  debuffs?: BossSkillDebuff[];     // debuffs applied to hit allies
  targetDescription?: string;      // free-text targeting info shown below the description

  // --- Incoming-damage model (survival sim). A skill without `kind` deals no
  // damage to the team — display-only until its targeting data is filled in.
  kind?: BossMoveKind;
  range?: BossRangeStamp;             // fixed: the RANGE panel, projected → hit tiles
  hitTiles?: number[];                // fixed: explicit ally-grid indices (used if no `range`)
  targetTile?: number;                // targeted: the aimed ally tile (the "tick")
  hitboxPattern?: [number, number][]; // targeted: splash shape centered on the victim
  instantDeath?: boolean;             // kills hit allies outright regardless of HP
  removesBuffs?: boolean;             // strips hit allies' buffs before the hit resolves
  selfBuffs?: BossSelfBuff[];         // buff moves: stat buffs on the boss itself
}

// One step of the boss's scripted rotation, in cast order (cycles when
// exhausted). The fight alternates phases (global turn 1 = allies, 2 = boss,
// 3 = allies, …), so step j lands on global turn 2j+2. Steps reference skill
// defs by id so the same skill can recur — with or without opening the weak
// points ("WEAK 100%" / "WEAK 200%" tiles in the game's preview grid).
export interface BossRotationStep {
  skillId: string;          // references BossSkillDef.id
  weakExposurePct?: number; // weak points open on this cast, e.g. 100 or 200
}

// Stage rules shown before entering the hunt ("Hunting Rules" line).
export interface BossHuntingRules {
  startingSp: number;
  spRecoveryPerTurn: number;
  maxSp?: number;
}

export interface BossStatsDef {
  hp: number;
  atk?: number;
  magic_atk?: number;
  crit_rate: number;
  crit_dmg: number;
  def: number;
  magic_resist: number;
  element_dmg?: Partial<Record<ElementType, number>>;
  element_res?: Partial<Record<ElementType, number>>;
}

export interface BossGridCell {
  row: number;
  col: number;
  type: "normal" | "weak";
  weakMultiplier?: number;
  skillId?: string;
}

export interface Boss {
  name: string;
  element: ElementType;
  def: number;          // e.g. 50 for 50% physical reduction
  mres: number;         // e.g. 50 for 50% magic resistance
  hitbox: number[];     // Array of flat indexes (0-11) representing occupied tiles
  weakPoints: number[]; // Array of flat indexes (subset of hitbox) that take bonus damage
  weakPointMultiplier: number; // e.g., 1.5 for +50% damage on weak points
  weakPointMultipliers?: Record<number, number>; // Maps specific tile index to its weak point multiplier
  gridCols?: number;    // Optional grid column width (defaults to 3 if omitted)
  level?: number;       // Display level in the battle HUD
  maxHp?: number;       // Total HP for the battle HUD bar
  stats?: Record<number, BossStatsDef>; // Predefined stats for different boss levels mapped by level number
  grid?: BossGridCell[]; // Physical layout grid of the boss

  // Stat sheet (the game's "+ Stats" panel). `def`/`mres` above stay the
  // simulator's source of truth and double as the sheet's DEF / Magic Resist.
  atk?: number;           // flat attack stat the skill scaling multiplies
  atkType?: DamageType;   // labels the stat: 'magic' → "Magic ATK", else "ATK"
  critRate?: number;      // %
  critDmg?: number;       // %
  elementDmg?: Partial<Record<ElementType, number>>; // e.g. { wind: 100 } → "Wind DMG 100%"
  elementRes?: Partial<Record<ElementType, number>>; // e.g. { water: 50 } → "Water Resist 50%"

  huntingRules?: BossHuntingRules; // SP economy defaults for teams vs this boss
  immunities?: string[];           // status effects the boss ignores, e.g. ["Knockback", "Silence"]

  skillDefs?: BossSkillDef[];    // unique skills (the "Skill used" strip)
  rotation?: BossRotationStep[]; // scripted cast order over skillDefs
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export interface BossRecord extends Boss {
  id: string;
}

// One entry in the user's personal roster ("account sync"). Keyed to a
// CHARACTER_TEMPLATES entry; level/upgrade here are the source of truth that
// teams pull from. Team-local edits beyond these values are "hypothetical".
export interface RosterEntry {
  charKey: string; // template charId, falling back to name
  owned: boolean;
  level: number;
  costumes: Record<string, {
    upgradeLevel: number;
    activePotentials: string[];
  }>;
}

// A named team save scoped to one boss. Holds all three lineups (Team 1/2/3)
// plus their turn scripts and the SP economy settings. The teams fight the
// boss as one continuous flow — Team 1's turns first, then Team 2's, then
// Team 3's — sharing a global turn counter and the boss's looping rotation;
// each team enters fresh (SP and buffs reset at the swap).
export interface SavedTeam {
  id: string;
  bossId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  variants: (Character | null)[][];  // 3 variants × 5 slots
  variantTurns: TurnSetup[][];       // turn scripts per variant
  activeVariantIdx: number;
  startingSp: number;
  spRecovery: number;
  maxSp: number;
  // Last simulated expected damage per variant, for boss-page listings
  lastResults: (number | null)[];
}

export interface TurnAction {
  characterId: string;
  actionType: 'attack' | 'knockback' | 'costume' | 'skip';
  costumeId?: string; // Selected costume ID if actionType === 'costume'
  burstLevel?: number; // 0 to 3 for active costume skill
}

export interface TurnSetup {
  turnIndex: number; // 0-indexed (Turn 1, Turn 2, etc.)
  actions: TurnAction[]; // Order of actions (1st to 5th character)
  preemptiveCostumeIds?: string[]; // Costume IDs enabled as preemptive actions on Turn 1
}

// One line in a formula bucket's drill-down: who/what contributed, a
// preformatted value ("+85%", "×1.38", "+6 chains", "412,000"), and a 0..1
// share used to size the contribution bar.
export interface FormulaContributor {
  name: string;
  display: string;
  share: number;
}

// Damage-weighted effective value of each formula bucket for one turn:
//   Damage = ATK × Skill% × AtkBuffs × Crit × Chain × DmgUp/Vuln × Property × Defense × Barrier × WeakPoint
// Values are averages across the turn's damage instances, weighted by each
// instance's expected damage. null = no damage dealt (or bucket not modeled).
export interface TurnFormulaBreakdown {
  turn: number;             // 1-indexed display turn
  totalExpected: number;
  atk: number | null;       // weighted avg base ATK/MATK (flat stat, pre-buff)
  skillPct: number | null;  // weighted avg skill scaling %
  atkBuffs: number | null;  // remaining fields are multipliers, e.g. 1.85
  crit: number | null;      // expected crit multiplier (crit-rate weighted)
  chain: number | null;
  dmgUpVuln: number | null;
  property: number | null;
  defense: number | null;
  barrier: number | null;   // not simulated yet — always null
  weakPoint: number | null;
  contributors: {
    atk: FormulaContributor[];       // damage dealt per character
    skillPct: FormulaContributor[];  // each action's scaling, weighted by its damage
    atkBuffs: FormulaContributor[];  // ATK%/MATK% buffs by source character
    crit: FormulaContributor[];      // expected crit multiplier per character
    chain: FormulaContributor[];     // chains added per character
    dmgUpVuln: FormulaContributor[]; // vulnerability debuffs by source character
    property: FormulaContributor[];  // advantage / char stats / buffs by source
    defense: FormulaContributor[];   // boss base DEF/MRES vs shred recovered
    weakPoint: FormulaContributor[]; // share of each character's damage on weak tiles
  };
}

export interface EffectSnapshot {
  type: SkillEffect['type'];
  value: number;
  remainingTurns: number;
  sourceCharacterName: string;
}

export interface TurnEffectSnapshot {
  turn: number;                                    // 1-indexed
  characterBuffs: Record<string, EffectSnapshot[]>; // keyed by charId
  bossDebuffs: EffectSnapshot[];
}

// End-of-turn survival snapshot: team HP after the boss's counterattack.
// hp === null means the character's HP was never entered (baseHp 0) — they
// still die to instant-death moves but normal damage can't be tracked.
export interface TurnSurvivalSnapshot {
  turn: number;                    // 1-indexed ally turn
  bossSkillName: string | null;    // what the boss cast after this ally turn
  incomingDamage: number;          // total expected damage the team took
  hp: { characterId: string; hp: number | null; shield: number; alive: boolean }[];
}

export interface SurvivalReport {
  perTurn: TurnSurvivalSnapshot[];
  deaths: { characterId: string; characterName: string; turn: number }[];
  wipeTurn: number | null;         // first turn the whole team is dead, if ever
}

export interface SimulationResult {
  totalDamageMin: number;
  totalDamageExpected: number;
  totalDamageMax: number;
  damagePerTurn: { turn: number; min: number; expected: number; max: number }[];
  damagePerCharacter: { characterId: string; characterName: string; min: number; expected: number; max: number }[];
  formulaPerTurn: TurnFormulaBreakdown[];
  effectSnapshots: TurnEffectSnapshot[];
  survival: SurvivalReport;
}
