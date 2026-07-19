# Character Update Checklist

Tracks which characters in `data/characters/` have had their skills verified/updated
against the [BD2 wiki](https://browndust2.miraheze.org/). Each character file is
`data/characters/<name>.data.ts`; the roster order lives in `data/characters.data.ts`.

> The wiki blocks WebFetch and normal page GETs (Cloudflare 403), but the MediaWiki
> **API is reachable** with a browser User-Agent — no screenshots needed to READ values:
> `.../w/api.php?action=parse&page=<Char>/<Costume_Name>&format=json&prop=wikitext`.
> The wikitext carries `{{SkillDisplay}}`, `{{CostumePotential}}`, and (for burst
> costumes) `{{CostumeBurst}}` blocks. `{{CostumeBurst}}` gives the exact per-tier
> burst panel: `sp1/upgrade1 … sp3/upgrade3` → map upgradeN text to a `burstUpgrades`
> field ("Skill/Skill base damage +X%" → `scalingBonus`, "Main Target damage +X%" →
> `mainTargetScalingBonus`, "Conditional skill damage +X%" → `conditionalScalingBonus`,
> "… buff duration +N turns" → a `buff_duration_extend` effect), `spN` → `spCost`.
> In `{{Spv|a|b}}`, `a` = potential-toggle-OFF value (what we encode); `{{Ul|…}}`
> marks the value that changed at that skill level. Screenshots are still a fine
> fallback and useful for sanity-checking engine-mapping judgement calls.

---

## How to update a character

### 1. Open the file
`data/characters/<name>.data.ts`. Each `costume` has a `skill`, an `upgrades[6]`
array (`+0`…`+5`), `potentials[3]`, and optionally `burstUpgrades[3]`.

### 2. Read the wiki Skill table → fill the fields

| Wiki text | File field | Notes |
|---|---|---|
| Skill name | `skill.name` | |
| **Target: Very Front / Vault** | `approach: "very_front"` / `"vault"` | Default `very_front` if omitted. |
| **Target: Self** | it's a **self-buff** → `scaling: 0`, effects `target: "self"` | No enemy damage. |
| **Range** grid | `skill.hitboxPattern` | See *Range → hitbox* below. |
| "Attack N times" / hits | `skill.hitCount` | Number of hits (chain building). |
| **Fixed DMG** | `damageType: "pure"` | Ignores boss DEF/MRES. |
| **Physical DMG** | `damageType: "physical"` | Uses boss DEF. |
| **Magic DMG** | `damageType: "magic"` | Uses boss MRES. |
| "equal to **X%** of your ATK" per level | `upgrades[i].scaling` | One value per `+0`…`+5`. |
| "For the **Main Target** … **Y%** … instead" | `upgrades[i].mainTargetScaling` | Hotter center; see *Main Target* below. |
| **SP** per level | `upgrades[i].spCost` | Read each level (it usually drops at `+3`). |
| **Cooldown** per level | `upgrades[i].cooldown` | |
| Buff/debuff/DoT text | `skill.effects` + `upgrades[i].effects` | See *Effects catalog* below. |

**Important:** `scaling` is **enemy damage only**. Barrier %, Energy Guard %,
Counter %, Crit DMG %, ATK % etc. are **NOT** scaling — they belong in `effects`.
A pure buff skill has `scaling: 0`.

### 3. Per-level effects
If an effect's **value or duration changes across `+0`…`+5`**, repeat the effect
inside each `upgrades[i].effects` with that level's value. Keep the same `id`
across levels so potentials can target it. (See `rubia` Burn, `anastasia` Crit DMG,
`lecliss` Barrier/Energy Guard for the pattern.)

### 4. Potentials (the 3 "Skill Potentials")
`type` must match what the potential does — don't force everything to `"damage"`:

| Wiki potential | `type` | Extra fields |
|---|---|---|
| Skill damage +X% | `damage` | `value: X` |
| Main Target damage +X% | `damage` | `value: X`, `scalingTarget: "main"` |
| Skill **and** Main Target damage +X% | `damage` | `value: X`, `scalingTarget: "both"` |
| SP cost −1 | `sp_reduce` | `value: 1` |
| Cooldown −N turns | `cooldown_reduce` | `value: N` |
| Range increases | `range_increase` | `newHitboxPattern: [...]` (or `newTargetShape`) |
| Buff/DoT value +X% (Barrier, Energy Guard, DEF down…) | `effect_value_increase` | `value: X`, `targetEffectId: "<effect id>"` |
| Buff/DoT duration +N | `duration_increase` | `value: N`, `targetEffectId: "<effect id>"` |
| Grants a brand-new effect | `add_effect` | `newEffect: {...}` |

### 5. Burst (`burstUpgrades[3]`, only if `hasBurst: true`)
One entry per Tier 1/2/3. Burst SP is **not** a flat +1 — read each tier's SP.

| Wiki burst tier | Field |
|---|---|
| SP cost of the tier | `spCost` |
| Skill damage +X% | `scalingBonus: X` |
| Main Target damage +X% | `mainTargetScalingBonus: X` |
| Buff duration +N / new effect | `effects: [...]` (e.g. `buff_duration_extend`) |
| Cooldown −N at this tier | `cooldownReduction: N` |

### 6. Verify
```
npx tsc --noEmit
```
Optionally sanity-check damage at runtime with a throwaway `npx tsx` script that
imports the character + `runSimulation` from `@/lib/sim/engine`.

---

## Range → hitbox pattern

The wiki **Range** panel is a grid; the marked tile with the **tick/arrow** is the
**origin** = `[0, 0]`. Each lit cell is `[rowOffset, colOffset]` from the tick, in
**card space**:

- **row**: negative = **up** on the panel = **forward / deeper into the boss**.
  Tile above the tick → `[-1, 0]`; below → `[1, 0]`.
- **col**: negative = **left** → `[0, -1]`; positive = **right** → `[0, 1]`.

Examples we've used:
- Single tile: `[[0,0]]`
- Tile + one in front: `[[0,0],[-1,0]]` (Alec – Raging Strike)
- Diagonal up-right 3: `[[0,0],[-1,1],[-2,2]]` (Alec – Sword Breaker)
- Plus/cross: `[[0,0],[-1,0],[1,0],[0,-1],[0,1]]` (Anastasia – Gentle Maid)
- Vertical column of 2: `[[0,0],[-1,0]]` (Anastasia – Fire Graffiti)

`targetShape` is cosmetic when `hitboxPattern` is set (only `"all"` overrides it).

## Main Target ("… deal Y% instead")

A cross/column AoE where the **center (tick) tile hits harder** than the arms:
- Arms use `scaling` (the base %).
- Center uses `mainTargetScaling` (the "Main Target … instead" %).
- It's a **replacement**, not additive: center = `Y%` only, not `X% + Y%`.

Engine support lives in `damage.service.ts` (`mainTargetScaling` applied to the
origin tile), `actions.service.ts`, and the `domain.type.ts` fields
`mainTargetScaling` / `mainTargetScalingBonus` / potential `scalingTarget`.

## Effects catalog (`skill.effects[].type`)

| Wiki term | `type` | `target` typical | Notes |
|---|---|---|---|
| ATK ↑ | `buff_atk` | `self` / `all_allies` | `value` = % |
| Magic ATK ↑ | `buff_matk` | | |
| Crit Rate ↑ | `buff_crit_rate` | | |
| Crit DMG ↑ | `buff_crit_dmg` | `self` | `value` = % (e.g. 350) |
| Property/Element DMG ↑ | `buff_prop_dmg` | | |
| Barrier (dmg reduction) | `buff_barrier` | `self` | `value` = % incoming reduced |
| Energy Guard (shield) | `buff_energy_guard` | `self` | shield = `value`% × Max HP |
| Evasion | `buff_evasion` | `self` | `value` = dodge charges |
| Taunt | `buff_taunt` | `self` | `value: 1` |
| Counter | `buff_counter` | `self` | `value` = % of Max HP dealt back per hit taken (Physical) |
| Chain Reinforcement | `buff_chain_reinforcement` | | |
| Duration extend | `buff_duration_extend` | `self` | `value` turns added to existing buffs; `duration: 0` |
| Augmentation | `buff_augmentation` | | may use `chainLimit` |
| DEF down (on boss) | `debuff_def` | `target_enemy` | `value` = % shred |
| MRES down | `debuff_mres` | `target_enemy` | |
| Boss ATK/MATK down | `debuff_atk` / `debuff_matk` | `target_enemy` | reduces boss damage to team |
| Vulnerability (dmg taken ↑) | `debuff_vulnerability` | `target_enemy` | |
| DoT vulnerability ↑ | `debuff_dot_vulnerability` | `target_enemy` | |
| Grant SP | `gain_sp` | | |
| Burn / Poison / Bleed | `dot` | `target_enemy` | `value` = %/tick, `duration` = ticks, `dotSource` (`caster_atk`/`caster_matk`/`enemy_maxhp`), `dotLabel` |

Every effect needs a unique, stable `id` (e.g. `"<name>_<costume>_<what>"`) so
potentials/burst can reference it and so it stacks/updates correctly.

## Reference examples (good templates to copy from)

- **Simple pure/physical nuke** → `alec.data.ts`
- **DoT + DEF shred + evasion + self ATK buff + burst** → `rubia.data.ts`
- **Main Target split scaling + self Crit DMG buff + burst tiers** → `anastasia.data.ts`
- **Pure self-buffs: Barrier, Taunt, Energy Guard, Counter** → `lecliss.data.ts`
- **Aura (area_allies) buffs + MATK-scaled Energy Guard** → `diana.data.ts`

## Engine features (all mechanics now modeled)

Every mechanic the roster uses is implemented. Fields live on `SkillEffect` /
`Skill` / `CostumeUpgrade` / `BurstUpgrade` in `domain.type.ts`; logic in
`lib/sim/engine/`. All verified end-to-end + a full-roster smoke test (177
costumes, burst + all potentials, 0 crashes).

Damage-shaping:
- **MATK-scaled Energy Guard** — `egScalingStat: 'caster_matk'` (Diana). Regen:
  `egRegen: true` refills the shield each turn (Diana Anti-dystopia).
- **Main-Target split scaling** — `mainTargetScaling` (origin tile hits harder).
- **`countScalingSource` + `countScalingPerUnit`** — "damage +N% per <count>":
  `'target'` (enemy tiles hit), `'caster_buff'`, `'sp_spent'`. Potentials use
  `type: 'count_scaling'`; burst uses `countScalingBonus`. (Loen, Sacred Justia,
  Olivier ×2, Nebris, Tyr.)
- **`scalingStat`** — `'caster_hp'` (Mamonir, Liberta), `'enemy_maxhp'` (knockback
  collision). Collision negated by `requiresKnockback` when the boss is
  Knockback-immune (Fred, Emma, Kry).
- **ATK-based Counter** — `counterStat: 'atk'` (Blade; default `'max_hp'`).
- **Augmentation scope/gate** — `augmentScope: 'basic_attack'` (Yozakura, boosts
  only Normal Attacks); `augmentChainMin` (Liberta Onsen, only hits at Chain 10+).

Conditions (`SkillCondition.type`): `chain_min`, `chain_max`, `target_has_dot`,
`target_has_vulnerability`, `target_has_taunt_or_concentrated_fire`,
`target_is_physical`, `target_chain_multiple_of_3`, `target_debuff_count`.

Conditional effect-swap: **`SkillEffect.applyCondition`** ({type, value?, negate?})
— `chain_min` / `self_has_augmentation` / `self_has_stat_reinforcement`. Encode
"X, but Y instead" as two effects (base `negate:true`, alt `negate:false`).
Sonya, Nebris.

Summons: **`SummonSpec`** (`skill.summon`, single or array). Buff mode (`effect`
+ `maxStacks`, ramps a zone buff each turn — Diana) and **damage mode**
(`attack: {scaling, hitCount, scalingStat, effects?, selfDestruct}` — Morpeah's
self-destruct Personas deal % of the summoner's MATK).

Reactive on-hit: **`buff_reactive`** (`reactiveEffect` + `reactiveMaxTriggers`) —
fires its payload once per hit the holder takes (uses `hitCounts` from the boss
cast). Seir (heal / aug battery), Mamonir (stacking Vulnerability).

Support: **all-ally instant heal** (`heal_continuous`/`heal_self_hp_percent` with
`healSource: 'caster_matk' | 'recipient_hp'` — Lisianne, Samay, Liberta, Jayden);
**enemy debuff-duration extend** (`buff_duration_extend` targeting the enemy bumps
all boss-debuff durations — Palette); **`effectValueBonus`** in the burst path
(boosts a buff/aura value, incl. nested reactive payloads — Liberta, Mamonir).

**Burst-tier convention** — the `{{CostumeBurst}}` panel gives exact per-tier
data; `{{Spv-bv|a|b|c|d}}` (a=base·nonburst, b=+burst, c=+potential, d=both)
cross-checks the total. Map upgrade text → `scalingBonus` /
`mainTargetScalingBonus` / `conditionalScalingBonus` / `countScalingBonus` /
`effectValueBonus`, `spN` → `spCost`.

**Not modeled (no observable effect in this engine):** Silence, enemy SP
reduction, dispel, SP-Cost-Increase self-penalty — the boss follows a scripted
rotation and SP/cooldowns aren't enforced, so these change nothing.

---

## Checklist

**82 / 82 fully done.** Every character reviewed against the wiki, and every
previously-flagged mechanic is now modeled (see "Engine features" below). NOTE:
some per-character notes below still say "unmodeled"/"no-op" — those predate the
engine work and are stale; the mechanic is now implemented.

- [x] **Lathel** (0001) — Herb Tracker (000101) | Lonely Survivor (000102) | Homunculus (000103) | Dark Knight (000104) | Promise of Vengeance (000105) | Pool Party (000106)
- [x] **Justia** (0002) — Knight of Blood (000201) | White Reaper (000202) | Blood Glutton (000203) | Kendo Club (000204) | Pool Party (000206)
- [x] **Scheherazade** (0003) — The Lapis Witch (000301) | The Magic School Professor (000303) | Code Name S (000304) | Pool Party (000306)
- [x] **Gray** (0004) — The Sharpshooter of the Mist (000401) | B-Rank Manager (000402) | Vanguard (000403) | Pool Party (000406)
- [x] **Rou** (0005) — White Cat (000501) | Red Riding Hood (000502) | Nature's Claw (000504) | Stray Cat (000506)
- [x] **Olstein** (0006) — The Fiend Scholar (000601) | Sage of Blue Clouds (000604)
- [x] **Eclipse** (0007) — Dimension Witch (000701) | Nightmare Bunny (000706) | Beach Vacation (000707) | Dream Bride (000708)
- [x] **Rubia** (0008) — Thorn of the Desert (000801) | The Empress of the Ocean (000804) | Maid Name C (000806) | Maid Bikini (000807)
- [x] **Sylvia** (0010) — Desert Flower (001001) | The Sword Queen (001002) | Admiral (001004) | Bikini Agent (001006)
- [x] **Teresse** (0011) — Angel of Destruction (001101) | Medical Club (001106) | Beachside Angel (001107)
- [x] **Liatris** (0012) — Rodev's Star (001201) | Neon Stalker (001206) | Maid Name R (001207)
- [x] **Diana** (0024) — Adventurer of the Unknown (002401) | Magical Innovator (002403) | Anti-dystopia (002406)
  - Costume 1 & 3 auras rebuilt. Anti-dystopia's Energy Guard scales off Diana's **Magic ATK** — new engine field `egScalingStat: 'caster_matk'`.
  - Costume 2 (Magical Innovator) summons **Magic Amplifier ET001** — now fully modeled via the new **summon-actor system** (`SummonSpec` / `BattleState.summons` / `actSummons`): each turn it adds a stack (≤4) and buffs the zone's Property DMG (25→50%/stack, up to +200% at +5). Verified: ramps +50/+100/+150/+200, caps at 4 stacks.
- [x] **Layla** (0030) — Anvil of Creation (003001)
- [x] **Elpis** (0031) — Hand of Salvation (003101) — all-ally buffer; `scaling` held the MATK buff % → zeroed, added Magic ATK (25→70%) + Crit Rate (30→35%) buffs (6t), MATK pot → effect_value_increase.
- [x] **Loen** (0032) — Last Hope (003201) | Track and Field Team (003202) | Celebrity Bunny (003203) ⚠️ per-target
  - Last Hope: fixed +5 scaling (was 1000, now 850) + plus-range hitbox. Track and Field Team: `scaling` was holding the MATK-buff % — corrected to 200–300 damage scaling and added the per-level Magic ATK self-buff (60/80/100%). Celebrity Bunny: fixed 3×3 AoE hitbox; its "+75% damage per target" bonus is unmodeled (no per-target-count scaling in engine).
- [x] **Nebris** (0033) — Labyrinth Gatekeeper (003301) | Laid-back Lifeguard (003302) | New Hire (003303)
  - Gatekeeper: `scaling` was wrong (100–150→125–175), added the Augmentation self-buff (100–150%), column range. **"Crit DMG instead if already Augmented" NOW MODELED** via `applyCondition` (self_has_augmentation): Augmentation on first cast, Crit DMG (+200–300%) when already augmented. Verified. Lifeguard: `scaling` stuck at 50 → 100–180, row range. **"Property DMG instead if in Stat Reinforcement" NOW MODELED** (self_has_stat_reinforcement): ATK +50% normally, Property DMG +50% if already stat-buffed. New Hire: fixed +5 scaling (110→70), 2-row range, burst tiers. ("+% per buff" scaling still unmodeled — flagged.)
- [x] **Morpeah** (0034) — Beach Vacation (003401) | Daydream Bunny (003402) | Apostle (003403)
  - Apostle: scaling (100→200), Concentrated Fire (Main Target, 2t), 3×3 range. Beach Vacation & Daydream Bunny: preemptive **damage-dealing** self-destruct summons — NOW MODELED via the summon system's damage mode (`SummonSpec.attack`, self-destruct): Beach Vacation's 2 Personas detonate for 300→700% MATK each; Daydream Bunny's Spectre for 200→650% MATK + MRES -30%. Verified end-to-end.
- [x] **Sacred Justia** (0035) — Reclaimed Destiny (003501) — base scaling correct (150→300), 3×3 range, diamond range-increase. "+% per target" bonus unmodeled — the two potentials + all burst tiers were wrongly inflating base scaling → zeroed (only SP costs 1/2/3 kept).
- [x] **Olivier** (0036) — Faithful Wings (003601) | Apostle (003602) | Fallen Wings (003603) | Retired Legend (003604)
  - Faithful Wings: fixed +5 scaling (250→230), arrow range (per-target bonus unmodeled). Apostle: preemptive self-buff; `scaling` was flat 100 → 0, added Evasion (2→3) + Magic ATK buff (50→68%, 8t), buff pots → effect_value_increase/duration_increase. Fallen Wings: fixed +5 scaling (250→230), X range (per-SP Rampage unmodeled). Retired Legend: `scaling` held the Domain buff % → real attack 50–80, added Domain all-ally Magic ATK buff (60→100%, 10t), column range.
- [x] **Blade** (0037) — Apostle (003701) | Onsen Swordfighter (003702) | Young Lady (003703)
  - Apostle: `scaling` held the counter values → real nuke 300–620, top-row range (ATK-based Counter unmodeled — engine counter is HP-based). Onsen Swordfighter: fixed +5 scaling (600→500), plus range (per-debuff-count bonus unmodeled). Young Lady: fixed +5 scaling (150→130), added Physical Vulnerability to Main Target (100→140%), 2-row range, vuln pot → effect_value_increase.
- [x] **Liberta** (0038) — Dark Saintess (003801) | Onsen Manager (003802) | Miracle Rose (003803)
  - Dark Saintess: all-ally buffer; `scaling` held ATK buff % → zeroed, added ATK (35→85%) + Crit Rate (25→50%) buffs (4t) + 3-SP restore, ATK pots → effect_value_increase. Onsen Manager: all-ally Augmentation (80→120%); `scaling` held the aug % → zeroed (Chain-10 gate + team heal unmodeled; burst boosts unrepresented). Miracle Rose: caster-HP scaling (7→10% ×5), `scaling` held the Crit Rate % → added self Crit Rate buff (40→70%, 1t), top-row range.
- [x] **Sonya** (0039) — Shadowed Dream (003901) | Little Pumpkin Girl (003902)
  - Shadowed Dream: `scaling` held vulnerability values — corrected to 300–500 damage + added the Vulnerability debuff (55–105) + plus-range. **Chain-6 Dark Vulnerability swap NOW MODELED** via `applyCondition` (chain_min 6): general Vuln at chain <6, Dark Vulnerability (property/dark, 75–155) at 6+. Verified. Little Pumpkin Girl: added Nightmare DoT (45–90%, dur 2→4), fixed +5 scaling (300→275), Nightmare pots → effect_value_increase, 3×3 range.
- [x] **Darian** (0040) — Prophetic Dream (004001) | Bittersweet Bunny (004002)
  - Prophetic Dream: added missing `mainTargetScaling` (775–1125), fixed +5 scaling (1500→700), X-range hitbox, pot2 `scalingTarget: "main"`, burst SP 1/1/2. Bittersweet Bunny: added Frostbite DoT (110/150% ×≤7) + DoT conditional (400–550), fixed +5 scaling (400→350), Frostbite pot → effect_value_increase. (Per-target cooldown reduction unmodeled.)
- [x] **Tyr** (0041) — Starlight Guardian (004101) | Innocent Bunny (004102)
  - Starlight Guardian: fixed +5 scaling (2240→1200), arrow range, burst tiers (T1 +560% / T2 restore-SP / T3 +280%, SP 2/1/1). Innocent Bunny: fixed +5 scaling (300→275), column range. (Per-SP-consumed scaling + SP-Cost-Increase self-penalty unmodeled — flagged; the two "per SP" potentials are no-ops.)
- [x] **Palette** (0042) — Shattered Dream (004201) | Miracle Violet (004202)
  - Shattered Dream: fixed +5 scaling (800→700) + diagcross hitbox. (Debuff-duration-extend on enemy unmodeled — utility only.)
  - Miracle Violet: fixed +5 base scaling (115→55); added the 7+-debuff conditional (new `target_debuff_count` condition type) + per-level conditionalScaling (110–170); corrected burst tiers from CostumeBurst panel (T1 scaling +50, T2/T3 conditional +25). Verified: 7-debuff damage = 3.09× base (=170/55).
- [x] **Eris** (0200) — Esteemed Adventurer (020001) | Your Very Own Cat (020002)
  - Esteemed Adventurer: fixed +5 scaling (650→600), added the "Chain ≤7" conditional (new `chain_max` condition type) + per-level conditionalScaling (600–900). Verified: low-chain hit uses 900%. Your Very Own Cat: fixed +5 scaling (80→60), added Physical Vulnerability to Main Target (100–150%), T-shape range.
- [x] **Roxy** (0201) — Respected Master (020101) | Emerging Desire (020102)
  - Respected Master: added missing `mainTargetScaling` (300→450), fixed +5 scaling (400→350), diamond range, pots 1/3 `scalingTarget: main`. Emerging Desire: fixed +5 scaling (70→58), column range. (Silence unmodeled.)
- [x] **Yomi** (0202) — Gentle Destroyer (020201) — fixed +5 scaling (170→150, was the max-Spv column), 3×3 range.
- [x] **Yozakura** (0203) — Fist of Conviction (020301) — `scaling` held the augmentation %; real skill damage 150–240, T-shape range. Basic-attack-only Augmentation (400–900%) unmodeled (engine can't scope aug to basic attacks); its 2 potentials are no-ops.
- [x] **Yumi** (0204) — Dancing Snowflake (020401) — fixed +5 scaling (120→90), added stacking Frostbite DoT (10→20% MATK, ≤99), column range.
- [x] **Hikage** (0205) — Kind Ruthlessness (020501) — fixed +3 (40→50, wiki typo) and +5 (90→70, was max-Spv column) scaling. Single-target, 12 hits.
- [x] **Goblin Slayer** (0206) — Orcbolg (020601) — `scaling` held the Barrier values; real damage 125–225. Added self Barrier (50%, 2t), kept 6-SP restore, 2-row range, Barrier potential → effect_value_increase.
- [x] **Priestess** (0207) — Earth Mother Believer (020701) — `scaling` held the vuln values; real damage 250–350, added Magic Vulnerability (50–70%), 3×3 range, vuln potential → effect_value_increase.
- [x] **High Elf Archer** (0208) — Daughter of Starwind (020801) — `scaling` was flat 100; real 75–125, added Crit Rate +100% self-buff (2t), row range.
- [x] **Sword Maiden** (0209) — Supreme God Archbishop (020901) — fixed +5 scaling (120→105), 3×3 range.
- [x] **Ikaruga** (0210, file `karuga.data.ts`) — Noble Flame (021001) — wiki page is "Ikaruga" (renamed display name from Karuga). `scaling` held the ATK-buff values; real damage 40–80, added the stacking self ATK buff (60–100%, ≤3), diamond range. (Hit-based wear-off + 3-stack cap not engine-enforced.)
- [x] **Alec** (0603) — The Destruction (060301) | Sword Breaker (060302)
- [x] **Celia** (0604) — The Curse (060401) | Descendant of the Great Witch (060402) | Masquerade Bunny (060403)
- [x] **Anastasia** (0605) — Gentle Maid (060501) | Fire Graffiti (060502)
- [x] **Lecliss** (0606) — Killer Doll (060601) | Android Queen (060602)
- [x] **Rafina** (0607) — Steel Engine (060701) | Code Name A (060702) | Game Club (060706)
- [x] **Elise** (0608) — Lovely Lady (060801) | Code Name O (060802) | Naive Lady (060804)
- [x] **Helena** (0610) — Top Idol (061001) | B-Rank Idol (061002)
- [x] **Eleaneer** (0611) — Piercing Magic Bow (061101) | B-Rank Idol (061102) | Shadow Bunny (061103)
- [x] **Dalvi** (0613) — Bright Moon (061302) | Summer Vacation (061305)
- [x] **Zenith** (0614) — Robin Hood (061402) | Poolside Guardian (061404)
- [x] **Andrew** (0620) — Loyal Butler (062001) | Specialist (062002)
- [x] **Ingrid** (0630) — Kardis' Bullet (063001)
- [x] **Cynthia** (0633) — Warmth within the Severe Cold (063301)
- [x] **Julie** (0634) — Healer (063401)
- [x] **Yuri** (0651) — Whitebolt (065102) | Comeback Idol (065103)
- [x] **Nartas** (0658) — Anonymous Sage (065802)
- [x] **Angelica** (0664) — The Fallen (066401) | Pool Party (066402) | Neon Savior (066403)
- [x] **Refithea** (0668) — The Gluttonous (066801) | Pure White Blessing (066802) | Poolside Fairy (066803)
- [x] **Glacia** (0669) — Alice (066902) | Disciplinary Committee (066906)
- [x] **Ventana** (0670) — Snow White (067002) | Comeback Idol (067003) | Onsen Practitioner (067004)
- [x] **Granhildr** (0671) — The Void (067101) | Comeback Idol (067102) | Boo Ghost (067103)
- [x] **Venaka** (0672) — DJ (067201) | Wind Dancer (067202)
- [x] **Levia** (0673) — Track and Field Captain (067301) | Night of Jealousy (067302) | Overheat (067303)
- [x] **Michaela** (0674) — Beachside Justice (067401) | Queen of Signatures (067402) | Acting Archbishop (067403)
- [x] **Luvencia** (0675) — Deal Snatcher (067502) | Wild Dog (067503)
- [x] **Wilhelmina** (0676) — Iron Monarch (067601) | Water Park Queen (067603) | Frozen Queen (067604)
- [x] **Granadair** (0677) — Shrine Maiden of Purification (067701) | Queen of Gluttis (067702)
- [x] **Mamonir** (0678) — Night of Death (067801) | Miracle Marine (067803)
  - Night of Death: 8-hit damage scales off **caster's Max HP** (`scalingStat: caster_hp`, 9→13%) — `scaling` held the Crit DMG buff; added Crit DMG buff (200→280%) + Transform, 2-row range, crit-DMG pot → effect_value_increase. Miracle Marine: self-tank; `scaling` held the reactive-vuln % → zeroed (on-hit Vulnerability unmodeled), added Barrier (50%, 6t), barrier pots → effect_value_increase, burst SP only.
- [x] **Gynt** (1001) — Lugo Hunter (100101) — fixed +5 scaling (320→250), added enemy ATK -50% debuff (4t), 2-tile row range.
- [x] **Fred** (1002) — Lugo Defense Force (100201) — damage is knockback-collision = % of enemy **Max HP** → `scalingStat: enemy_maxhp` (fixed +5 25/35/50 not 70); added Bleed DoT (50% ATK, 6t) + SP restore. (Collision assumes knockback lands — boss immunity not checked.)
- [x] **Lisianne** (1003) — Wandering Priest (100301) — healer; `scaling` was the heal amount → zeroed (heal + DoT-cleanse unmodeled, no fitting type). Fixed the potential's Energy Guard to `egScalingStat: caster_matk` (150% MATK).
- [x] **Remnunt** (1004) — Combat Doctor (100401) — fixed +5 scaling (320→250), added enemy ATK -50% debuff (4t), 2-tile row range.
- [x] **Wiggle** (1005) — Bomb Fanatic (100501) | Bomb in the Hoodie (100502) — Bomb Fanatic: scaling correct (300→500), added plus range. Bomb in the Hoodie: scaling correct (flat 20), added Burn DoT (75→155% ATK, 3t), plus range.
- [x] **Lucrezia** (1006) — Seductive Wings (100601) — fixed +5 scaling (40→20, damage is flat 20 all levels), plus range, SP-restore (1→3) correct. (Silence unmodeled.)
- [x] **Bernie** (1008) — Righteous Raider Girl (100801) — verified correct (scaling 50→110, SP-restore 2→3, cooldown). Silence unmodeled — noted.
- [x] **Seir** (1011) — Demon's Daughter (101101) | B-Rank Idol (101102) | New Hire (101103)
  - All three are self-tank/support with `scaling` holding buff values → zeroed. Demon's Daughter: added Barrier (40→70%, 4→6t), barrier pot → effect_value_increase (heal-on-hit unmodeled). B-Rank Idol: added Barrier (40→70%, 2t) + SP restore, EG potential (heal/SP-on-hit approximated). New Hire: reactive Augmentation battery — fully unmodeled (on-hit trigger).
- [x] **Jayden** (1012) — Beautiful Girl Devotee (101201) | Manga Research Club (101202)
  - Beautiful Girl Devotee: self-support; `scaling` held the heal % → zeroed, added continuous self-heal (5→17% HP) + Magic Barrier (50%, 4→6t), barrier potential → effect_value_increase. Manga Research Club: fixed +3 wiki typo (50→70), plus range.
- [x] **Emma** (1013) — Haggard Delinquent (101301) | School Queen (101302)
  - Haggard Delinquent: self-buff; `scaling` held the ATK-buff % → zeroed, added ATK buff (200→500%, 6t). School Queen: knockback-collision (enemy Max HP, 50–125%) via `scalingStat`, added Bleed (50→100% ATK, 6t) + SP restore.
- [x] **Samay** (1014) — Kind Liberator (101401) | Kind Student (101402)
  - Kind Liberator: scaling correct (80→200), added MRES -50% shred (4t), T-shape range. Kind Student: all-ally buffer; `scaling` held the buff % → zeroed, added ATK + Magic ATK buffs (20→50%, 2t). (25%-MATK team heal unmodeled.)
- [x] **Kry** (1015) — Liberated Marauder (101501) | Violent Student (101502)
  - Liberated Marauder: fixed +5 scaling (215→200), X-range; DEF -50% debuff already present. Violent Student: knockback-collision (100% enemy Max HP) via `scalingStat`, added Bleed (50→130% ATK, 6t) + SP restore, row range.
- [x] **Carlson** (1032) — The Mercenary Knight (103201) — self-buff only; `scaling` held the barrier % → zeroed (no damage). Barrier (35→65%, 2→4t) already correct.
- [x] **Lydia** (1033) — Apprentice Spearman (103301) — fixed +5 scaling (380→350), column-of-2 range.
- [x] **Rigenette** (1034) — Little Hunter (103401) — fixed +5 scaling (160→110), added Concentrated Fire debuff (4→6t).
- [x] **Beatrice** (1035) — The Mighty Warrior of the Tribe (103501) — fixed +5 scaling (275→225). Fixed DMG (pure), single-target.
- [x] **Maria** (1036) — Archmage (103601) — fixed +5 scaling (250→200), column-of-3 range.
- [x] **Arines** (1037) — Priest of Vitality (103701) — was a stub; rebuilt with upgrades[6]: all-ally ATK (25→70%) + Crit Rate (30%) buffs, 6t, correct name "Fair and Square", ATK-buff potential.
