# Brown Dust 2 Simulator — Mechanics Checklist

Track what's implemented, what's in-progress, and what's planned.

---

## Damage Formula

- [x] Base damage — `ATK × (Scaling% / 100)`
- [x] Physical / Magic / Pure damage types
- [x] Defense multiplier — `1 - DEF%`, pure ignores defenses
- [x] Element advantage / disadvantage — Fire>Wind>Water>Fire, Light↔Dark
- [x] Property damage multiplier — element advantage + base stat + buffs
- [x] Crit rate + crit damage — min/expected/max bands
- [x] Chain multiplier — +10% per chain, per-hit per-tile accumulation
- [x] Multi-hit skills — each hit lands on all overlapping tiles
- [x] Weak point multiplier — per-tile and global fallback
- [x] Vulnerability multiplier — `1 + vuln% / 100`

## Buffs & Debuffs

- [x] ATK% buff (multiplicative with base stat)
- [x] MATK% buff
- [x] Crit Rate buff (additive with base)
- [x] Crit DMG buff (additive with base)
- [x] Property DMG buff (additive into property multiplier)
- [x] DEF shred debuff (% reduction of boss defense)
- [x] MRES shred debuff (% reduction of boss magic resist)
- [x] Vulnerability debuff (amplifies all damage taken)
- [x] Effect duration tracking — turn-based countdown, expired effects drop
- [x] Buff stacking — multiple instances of same type stack additively
- [ ] Energy Guard — typed, data exists (Dark Knight Lathel), not simulated
- [ ] Barrier — typed, data exists, breakdown returns `null`

## Effect Targets

- [x] Self buff
- [x] All allies buff
- [x] Area allies buff — positional, hitbox-based
- [x] Target enemy debuff
- [x] All enemies debuff

## Targeting & Grid

- [x] Hitbox pattern projection — custom `[row, col]` offsets onto 3×4 grid
- [x] Target shapes — single, row, col, plus, cross, square, all
- [x] Auto-targeting by flank — character position determines boss column
- [x] Vault vs Very Front approach — vault skips front tile
- [x] Allied grid targeting — buff skills target ally positions

## Character System

- [x] Costume upgrade levels (+0 to +5) — scaling, SP, cooldown per level
- [x] Skill potentials — damage+, SP reduce, cooldown reduce, range increase, effect value increase
- [x] Burst system — +40% scaling per burst level, +1 SP per level
- [x] Normal attack / Knockback / Skip actions
- [x] Preemptive actions — fire automatically at start of Turn 1

## SP & Cooldowns

- [x] SP economy — starting SP, per-turn recovery, max cap
- [x] SP overdraft detection (UI warning)
- [x] Skill cooldowns — cast on turn T → unavailable through T + CD
- [x] Preemptive skill cooldown tracking

## Boss System

- [x] Multi-part boss hitbox — arbitrary tile layout on 3×4 grid
- [x] Per-tile weak point multipliers
- [x] Boss level scaling — stats table per level (HP, ATK, DEF, MRES)
- [x] Boss skill rotation — scripted cast order with skill definitions
- [x] Hunting rules — starting SP, SP recovery, max SP
- [x] Boss immunities — informational display only
- [ ] Boss weak point exposure phases — `weakExposurePct` typed but not toggling dynamically
- [ ] Boss skill debuffs on allies — type defined, not simulated

## Analytics

- [x] Formula breakdown panel — damage-weighted multiplier analysis per bucket
- [x] Per-character damage contribution tracking
- [x] Min / Expected / Max damage bands
- [x] Per-turn damage breakdown

## Not Yet Implemented

- [ ] Boss turn simulation (boss → allies damage)
- [ ] HP tracking / character death
- [ ] Evasion / accuracy
- [ ] Buff removal / debuff cleanse
- [ ] Stat weakening conditionals (e.g. boss Massive Leg conditional)
- [ ] Knockback displacement (grid repositioning)
- [ ] HP-cost skills (e.g. Lathel's "HP -5% Self")
- [ ] Conditional buffs (HP thresholds, debuff stack triggers)
- [ ] Healing
- [ ] Status effects (silence, stun, taunt, etc.)
- [ ] Turn order / speed manipulation
- [ ] Multi-team shared boss HP deduction across team swaps
