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

export interface SkillEffect {
  id: string;
  type: 
    | 'buff_atk' 
    | 'buff_matk' 
    | 'buff_crit_rate' 
    | 'buff_crit_dmg' 
    | 'buff_prop_dmg' 
    | 'buff_energy_guard'
    | 'buff_barrier'
    | 'buff_evasion'
    | 'buff_chain_reinforcement'
    | 'buff_taunt'
    | 'buff_counter'
    | 'buff_duration_extend'
    | 'buff_augmentation'
    | 'debuff_def'
    | 'debuff_mres'
    | 'debuff_atk'   // reduces the boss's physical damage to the team
    | 'debuff_matk'  // reduces the boss's magic damage to the team
    | 'debuff_vulnerability'
    | 'debuff_dot_vulnerability'
    | 'gain_sp'
    | 'dot';           // damage-over-time (poison/bleed/burn) applied to the enemy
  value: number; // e.g., 50 for +50% or count of times; for 'dot', the per-tick % of the source stat
  duration: number; // in turns (for 'dot', the number of ticks)
  target: 'self' | 'all_allies' | 'area_allies' | 'target_enemy' | 'all_enemies';
  // DoT-only: which stat the per-tick damage scales off (snapshotted at cast),
  // and a display label. Ignored for non-'dot' effects.
  dotSource?: 'caster_atk' | 'caster_matk' | 'enemy_atk' | 'enemy_maxhp';
  dotLabel?: string; // e.g. "Poison", "Bleed", "Burn"
  chainLimit?: number; // optional chain count limit for the effect to apply (e.g., 5 for Teresse)
  stacks?: number; // number of stacks this effect counts as (defaults to 1)
  maxStacks?: number; // maximum stack count allowed on target for this dotLabel
}

// Condition gating a costume upgrade's `conditionalScaling`: damage instances
// where the condition holds use the conditional scaling instead of the base
// one. Evaluated per hit (the chain counter advances mid-action).
export interface SkillCondition {
  type: 'chain_min' | 'target_has_dot'; // active while condition holds
  value: number;
}

export interface Skill {
  id: string;
  name: string;
  hitCount: number; // number of hits (for chain building)
  damageType: DamageType;
  targetShape?: TargetShape;
  conditional?: SkillCondition; // required for upgrades with conditionalScaling
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
}

export interface CostumeUpgrade {
  scaling: number;
  spCost: number;
  cooldown: number;
  hitCount?: number;
  conditionalScaling?: number;
  effects?: SkillEffect[];
}

export interface SkillPotential {
  id: string;
  type: 'damage' | 'sp_reduce' | 'cooldown_reduce' | 'range_increase' | 'effect_value_increase' | 'duration_increase' | 'conditional_damage' | 'add_effect';
  value?: number; // e.g. 15 for +15% damage
  newTargetShape?: TargetShape;
  newHitboxPattern?: [number, number][];
  targetEffectId?: string; // Optional target effect ID to modify
  newEffect?: SkillEffect; // For 'add_effect': the brand-new effect this potential grants
  name?: string; // Optional user-facing custom potential label
  additionalEffects?: {
    type: 'damage' | 'sp_reduce' | 'cooldown_reduce' | 'range_increase' | 'effect_value_increase' | 'duration_increase' | 'conditional_damage' | 'add_effect';
    value?: number;
    targetEffectId?: string;
    newEffect?: SkillEffect;
    name?: string;
  }[];
}

export interface BurstUpgrade {
  scalingBonus?: number;
  conditionalScalingBonus?: number;
  effects?: SkillEffect[];
  cooldownReduction?: number; // turns shaved off the skill's cooldown at this burst tier
  // Additional SP this tier costs, on top of the base skill cost and lower
  // tiers. Burst cost is NOT a flat +1/tier — each tier has its own price.
  // Omit to fall back to +1 for that tier.
  spCost?: number;
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

// LEGACY rotation entry — older stored bosses (localStorage) may still carry
// this flat shape. New bosses define `skillDefs` + `rotation` instead; both
// shapes are read through resolveBossRotation() in lib/bosses.ts.
export interface BossSkillInfo {
  name: string;
  icon?: string;    // emoji placeholder until boss skill art exists
  isWeak?: boolean; // this attack exposes the boss's weak points
}

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
  icon?: string;           // emoji placeholder until boss skill art exists
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
  /** @deprecated legacy flat rotation; superseded by skillDefs + rotation */
  skills?: BossSkillInfo[];
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
