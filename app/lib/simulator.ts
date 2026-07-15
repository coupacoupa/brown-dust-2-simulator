import {
  Character,
  Boss,
  TurnSetup,
  SimulationResult,
  SimulationLog,
  TargetShape,
  ElementType,
  SkillEffect,
  DamageType,
  TurnFormulaBreakdown,
  FormulaContributor,
  ApproachType
} from '../types';


// Hitbox resolver: convert pattern offsets → flat boss-grid indices ──
// Given a target origin tile (flat index 0-11 on the 3-col boss grid) and
// a hitbox pattern, returns the set of flat indices that the skill covers.
// Out-of-bounds offsets are silently dropped.
export function resolveHitboxTiles(
  originTile: number,
  pattern: [number, number][],
  gridCols: number = 3,
  gridRows: number = 4,
): number[] {
  const originRow = Math.floor(originTile / gridCols);
  const originCol = originTile % gridCols;
  const tiles: number[] = [];

  for (const [dr, dc] of pattern) {
    const r = originRow + dr;
    const c = originCol + dc;
    if (r >= 0 && r < gridRows && c >= 0 && c < gridCols) {
      tiles.push(r * gridCols + c);
    }
  }

  return Array.from(new Set(tiles));
}

// Auto-targeting: determines the anchor tile on the boss grid (0-11) based on
// the character's allied position, approach type, and the boss's active hitbox.
export function calculateAutoTarget(
  alliedPosition: number,
  bossHitbox: number[],
  approach: ApproachType = 'very_front',
): number {
  // In BD2 grids, flat index = depth * 3 + flank.
  // Flank (0 = top, 1 = mid, 2 = bottom) is index % 3.
  const flank = alliedPosition % 3;
  
  // Find all occupied boss tiles in this flank, from front (depth 0) to back (depth 3).
  const flankTiles = [0 * 3 + flank, 1 * 3 + flank, 2 * 3 + flank, 3 * 3 + flank];
  const occupied = flankTiles.filter((t) => bossHitbox.includes(t));

  if (occupied.length === 0) {
    // If the flank is empty, hit the front-most tile of that flank
    return flankTiles[0];
  }

  // Vault skips the first occupied tile if there's another behind it
  if (approach === 'vault' && occupied.length > 1) {
    return occupied[1];
  }

  // Very front (or vault with only 1 target) hits the first occupied tile
  return occupied[0];
}

// Get flat indices hit by a skill shape given a center tile (0-11) on a 3x4 grid.
// When a custom hitboxPattern is provided, it takes precedence.
export function getTilesHit(
  shape: TargetShape,
  center: number,
  hitboxPattern?: [number, number][],
): number[] {
  // Custom hitbox pattern takes priority over shape-based calculation
  if (hitboxPattern && hitboxPattern.length > 0) {
    return resolveHitboxTiles(center, hitboxPattern);
  }

  const cx = center % 3;
  const cy = Math.floor(center / 3);
  const hits: number[] = [];

  const addIfValid = (x: number, y: number) => {
    if (x >= 0 && x < 3 && y >= 0 && y < 4) {
      hits.push(y * 3 + x);
    }
  };

  switch (shape) {
    case 'single':
      addIfValid(cx, cy);
      break;
    case 'row':
      for (let x = 0; x < 3; x++) {
        addIfValid(x, cy);
      }
      break;
    case 'col':
      for (let y = 0; y < 4; y++) {
        addIfValid(cx, y);
      }
      break;
    case 'plus':
      addIfValid(cx, cy); // center
      addIfValid(cx, cy - 1); // top
      addIfValid(cx, cy + 1); // bottom
      addIfValid(cx - 1, cy); // left
      addIfValid(cx + 1, cy); // right
      break;
    case 'cross':
      addIfValid(cx, cy); // center
      addIfValid(cx - 1, cy - 1); // top-left
      addIfValid(cx + 1, cy - 1); // top-right
      addIfValid(cx - 1, cy + 1); // bottom-left
      addIfValid(cx + 1, cy + 1); // bottom-right
      break;
    case 'square':
      // 2x2 centered at target (or offset if at edge)
      const startX = cx === 2 ? 1 : cx;
      const startY = cy === 3 ? 2 : cy;
      for (let y = startY; y < startY + 2; y++) {
        for (let x = startX; x < startX + 2; x++) {
          addIfValid(x, y);
        }
      }
      break;
    case 'all':
      for (let i = 0; i < 12; i++) {
        hits.push(i);
      }
      break;
  }

  // Deduplicate just in case
  return Array.from(new Set(hits));
}

// Calculate elemental multiplier
// Fire > Wind > Water > Fire
// Light <-> Dark
export function getElementMultiplier(attacker: ElementType, defender: ElementType): number {
  if (attacker === 'fire' && defender === 'wind') return 0.50; // +50% Property Damage
  if (attacker === 'wind' && defender === 'water') return 0.50;
  if (attacker === 'water' && defender === 'fire') return 0.50;
  
  if (attacker === 'light' && defender === 'dark') return 0.50;
  if (attacker === 'dark' && defender === 'light') return 0.50;

  // Disadvantage (deals 25% less damage)
  if (attacker === 'wind' && defender === 'fire') return -0.25;
  if (attacker === 'water' && defender === 'wind') return -0.25;
  if (attacker === 'fire' && defender === 'water') return -0.25;

  return 0.0; // Neutral
}

interface ActiveBuff {
  type: SkillEffect['type'];
  value: number;
  remainingTurns: number;
  sourceCharacterId: string;
}

interface ActiveDebuff {
  type: SkillEffect['type'];
  value: number;
  remainingTurns: number;
  sourceCharacterId: string;
}

export function runSimulation(
  characters: Character[],
  boss: Boss,
  turns: TurnSetup[],
  startingSp: number = 6,
  spRecoveryPerTurn: number = 3,
  maxSp: number = 15
): SimulationResult {
  const logs: SimulationLog[] = [];
  const damagePerTurn: { turn: number; min: number; expected: number; max: number }[] = [];
  const formulaPerTurn: TurnFormulaBreakdown[] = [];
  const damagePerCharacter: { [id: string]: { min: number; expected: number; max: number } } = {};

  // Initialize character damage tracking
  characters.forEach(char => {
    damagePerCharacter[char.id] = { min: 0, expected: 0, max: 0 };
  });

  // Track active buffs per character
  const characterBuffs: { [charId: string]: ActiveBuff[] } = {};
  characters.forEach(char => {
    characterBuffs[char.id] = [];
  });

  // Track active debuffs on the boss
  let bossDebuffs: ActiveDebuff[] = [];

  // Track skill cooldowns: characterId -> skillId -> remaining turns
  const skillCooldowns: { [charId: string]: { [skillId: string]: number } } = {};
  characters.forEach(char => {
    skillCooldowns[char.id] = {};
    (char.costumes || []).forEach(costume => {
      skillCooldowns[char.id][costume.skill.id] = 0;
    });
  });

  let currentSp = startingSp;

  // Process turn by turn
  turns.forEach((turnSetup, turnIdx) => {
    const displayTurn = turnIdx + 1;
    let turnMinDamage = 0;
    let turnExpectedDamage = 0;
    let turnMaxDamage = 0;

    // Damage-weighted accumulators for the per-turn formula breakdown.
    // Each hit instance contributes its multipliers weighted by its expected
    // damage, so the panel reflects where this turn's damage actually came from.
    const fb = { w: 0, atk: 0, skillPct: 0, atkBuffs: 0, crit: 0, chain: 0, vuln: 0, property: 0, defense: 0, weak: 0 };

    // Contributor tracking per bucket (all damage-weighted like `fb`)
    const charDmgAgg = new Map<string, number>();                      // char name → expected dmg
    const skillActionsAgg: { label: string; scaling: number; dmg: number }[] = [];
    const buffContribAgg = new Map<string, number>();                  // buff source → Σ(w × value%)
    const critAgg = new Map<string, { w: number; wx: number }>();      // char name → weighted crit mult
    const chainAddsAgg = new Map<string, number>();                    // char name → chains added
    const vulnContribAgg = new Map<string, number>();                  // debuff source → Σ(w × value%)
    let propAdvSum = 0;                                                // Σ(w × advantage%)
    let propStatSum = 0;                                               // Σ(w × char basePropDmg%)
    const propBuffContribAgg = new Map<string, number>();              // buff source → Σ(w × value%)
    let defBaseSum = 0;                                                // Σ(w × effective boss DEF/MRES%)
    const defShredContribAgg = new Map<string, number>();              // debuff source → Σ(w × recovered pts)
    const weakAgg = new Map<string, { weak: number; total: number }>(); // char name → weak-tile dmg share

    // SP Recovery at the start of Turn (except Turn 1)
    if (turnIdx > 0) {
      currentSp = Math.min(maxSp, currentSp + spRecoveryPerTurn);
    }

    // Chain count resets at the start of each turn
    let chainCount = 0;

    // Execute character actions in order
    turnSetup.actions.forEach(action => {
      const char = characters.find(c => c.id === action.characterId);
      if (!char) return;

      let actionName = 'Skip';
      let spCost = 0;
      let hitCount = 1;
      let scaling = 100; // Normal attack is 100%
      let dmgType: DamageType = 'physical';
      let targetShape: TargetShape = 'single';
      let effects: SkillEffect[] = [];
      let usedSkillId: string | null = null;
      let hitboxPattern: [number, number][] | undefined = undefined;
      let targetGrid: 'enemy' | 'ally' = 'enemy';
      let approach: ApproachType = 'very_front';

      // Determine action details
      if (action.actionType === 'skip') {
        // Log skip and return
        logs.push({
          turn: displayTurn,
          characterName: char.name,
          actionName: 'Skip',
          targetTile: 0, // Skip has no target
          damageType: 'physical',
          hitCount: 0,
          hits: [],
          totalDamageMin: 0,
          totalDamageExpected: 0,
          totalDamageMax: 0,
          appliedBuffs: [],
          appliedDebuffs: []
        });
        return;
      } else if (action.actionType === 'attack') {
        actionName = 'Normal Attack';
        dmgType = char.baseAtk >= char.baseMatk ? 'physical' : 'magic';
        targetShape = 'single'; // Normal attacks are single target
        // Base character attack uses their default costume approach if available
        if (char.costumes.length > 0) {
          approach = char.costumes[0].approach ?? 'very_front';
        }
      } else if (action.actionType === 'knockback') {
        actionName = 'Knock Back';
        dmgType = char.baseAtk >= char.baseMatk ? 'physical' : 'magic';
        spCost = 0;
        hitCount = 1;
        scaling = 100;
        targetShape = 'single';
      } else if (action.actionType === 'costume' && action.costumeId) {
        const costume = (char.costumes || []).find(c => c.id === action.costumeId);
        if (costume) {
          const skill = costume.skill;
          const burst = action.burstLevel || 0;
          usedSkillId = skill.id;
          actionName = `${costume.name} Skill`;
          if (burst > 0) {
            actionName += ` (BURST +${burst})`;
          }
          spCost = Math.max(0, skill.spCost + burst);
          hitCount = skill.hitCount;
          scaling = skill.scaling + (40 * burst);
          dmgType = skill.damageType;
          targetShape = skill.targetShape;
          effects = skill.effects;
          hitboxPattern = skill.hitboxPattern;
          targetGrid = skill.targetGrid ?? 'enemy';
          approach = costume.approach ?? 'very_front';
        }
      }

      // Compute automatic target tile based on allied grid position
      const charPosition = char.position ?? 0;
      let targetOriginTile = 0;
      
      if (targetGrid === 'ally') {
        // Buff skills target the allied grid centered on the caster
        targetOriginTile = charPosition;
      } else {
        // Attack skills target the boss grid based on approach
        targetOriginTile = calculateAutoTarget(charPosition, boss.hitbox, approach);
      }

      const tilesTargeted = getTilesHit(targetShape, targetOriginTile, hitboxPattern);

      // Track SP consumption
      currentSp -= spCost;

      // Handle cooldowns if it's a costume skill
      if (usedSkillId && action.actionType === 'costume') {
        const costume = (char.costumes || []).find(c => c.skill.id === usedSkillId);
        if (costume) {
          skillCooldowns[char.id][usedSkillId] = costume.skill.cooldown;
        }
      }

      // Apply Buffs/Debuffs *before* damage calculation if they are applied by this action
      const newBuffsApplied: string[] = [];
      const newDebuffsApplied: string[] = [];

      effects.forEach(eff => {
        const description = `${eff.type.replace('buff_', '').replace('debuff_', '').toUpperCase()} +${eff.value}% (${eff.duration}t)`;
        if (eff.target === 'self') {
          characterBuffs[char.id].push({
            type: eff.type,
            value: eff.value,
            remainingTurns: eff.duration,
            sourceCharacterId: char.id
          });
          newBuffsApplied.push(`Self: ${description}`);
        } else if (eff.target === 'all_allies') {
          characters.forEach(ally => {
            characterBuffs[ally.id].push({
              type: eff.type,
              value: eff.value,
              remainingTurns: eff.duration,
              sourceCharacterId: char.id
            });
          });
          newBuffsApplied.push(`Allies: ${description}`);
        } else if (eff.target === 'area_allies') {
          // Buff applies to allies whose position falls within the targeted allied tiles
          characters.forEach(ally => {
            if (ally.position !== undefined && tilesTargeted.includes(ally.position)) {
              characterBuffs[ally.id].push({
                type: eff.type,
                value: eff.value,
                remainingTurns: eff.duration,
                sourceCharacterId: char.id
              });
            }
          });
          newBuffsApplied.push(`AoE: ${description}`);
        } else if (eff.target === 'target_enemy' || eff.target === 'all_enemies') {
          // Debuff applies to the boss
          bossDebuffs.push({
            type: eff.type,
            value: eff.value,
            remainingTurns: eff.duration,
            sourceCharacterId: char.id
          });
          newDebuffsApplied.push(`Boss: ${description}`);
        }
      });

      // Calculate stats based on active buffs
      const activeBuffs = characterBuffs[char.id];
      const sumBuff = (type: SkillEffect['type']) => activeBuffs.filter(b => b.type === type).reduce((acc, b) => acc + b.value, 0);

      const atkBuff = sumBuff('buff_atk');
      const matkBuff = sumBuff('buff_matk');
      const critRateBuff = sumBuff('buff_crit_rate');
      const critDmgBuff = sumBuff('buff_crit_dmg');
      const propDmgBuff = sumBuff('buff_prop_dmg');

      // Debuffs
      const defDebuff = bossDebuffs.filter(d => d.type === 'debuff_def').reduce((acc, d) => acc + d.value, 0);
      const mresDebuff = bossDebuffs.filter(d => d.type === 'debuff_mres').reduce((acc, d) => acc + d.value, 0);
      const vulnDebuff = bossDebuffs.filter(d => d.type === 'debuff_vulnerability').reduce((acc, d) => acc + d.value, 0);

      // Current stats
      const finalAtk = char.baseAtk * (1 + atkBuff / 100);
      const finalMatk = char.baseMatk * (1 + matkBuff / 100);
      const finalCritRate = Math.min(100, Math.max(0, char.baseCritRate + critRateBuff));
      const finalCritDmg = char.baseCritDmg + critDmgBuff; // e.g. 50% + 50% = 100% bonus

      // Defense and Res values (max shred = 100% reduction of defense, defense caps at 90% in BD2 usually)
      const bossDef = Math.max(0, boss.def * (1 - defDebuff / 100));
      const bossMres = Math.max(0, boss.mres * (1 - mresDebuff / 100));

      // Primary stat
      const primaryStat = dmgType === 'physical' ? finalAtk : finalMatk;
      const baseDmg = primaryStat * (scaling / 100);

      // Defense multiplier (1 - DEF%)
      const defMultiplier = dmgType === 'pure' ? 1.0 : (dmgType === 'physical' ? (1 - bossDef / 100) : (1 - bossMres / 100));

      // Element multiplier: base property advantage (0.50 if advantaged, -0.25 if disadvantaged) + custom stats + buffs
      const elAdvantage = getElementMultiplier(char.element, boss.element);
      const propertyMultiplier = 1 + elAdvantage + (char.basePropDmg / 100) + (propDmgBuff / 100);

      // Vulnerability
      const vulnerabilityMultiplier = 1 + (vulnDebuff / 100);

      // Find overlap between hit range and boss hitbox (only if targeting enemies)
      const hitParts = targetGrid === 'enemy'
        ? tilesTargeted.filter(tileIndex => boss.hitbox.includes(tileIndex))
        : [];

      const detailedHits: SimulationLog['hits'] = [];
      let skillMinDmg = 0;
      let skillExpectedDmg = 0;
      let skillMaxDmg = 0;

      // If we don't hit any part of the boss, damage is 0
      if (hitParts.length > 0 && scaling > 0) {
        // Run calculation hit by hit, tile by tile
        // In BD2, we execute hit counts. For multiple target parts, each part receives the hits.
        // Let's iterate through each hit, and update chain count.
        for (let hit = 0; hit < hitCount; hit++) {
          hitParts.forEach(partIndex => {
            const isWeakPoint = boss.weakPoints.includes(partIndex);
            const weakMultiplier = isWeakPoint
              ? (boss.weakPointMultipliers?.[partIndex] ?? boss.weakPointMultiplier ?? 1.0)
              : 1.0;

            // Chain multiplier: each chain adds 10% damage.
            // Hit 1 starts at chainCount. (e.g. if chainCount = 0, mult = 1.0)
            const chainMultiplier = 1 + (chainCount * 0.10);

            // Compute damage without Crit
            const nonCritDmg = baseDmg * defMultiplier * propertyMultiplier * chainMultiplier * vulnerabilityMultiplier * weakMultiplier;

            // Crit multipliers
            // In BD2, Crit Damage adds flatly to the 1.5x base crit damage, or is it additive to 1.0x?
            // Usually, standard crit deals 150% damage (i.e. +50% Crit Damage).
            // So Crit Multiplier = 1 + (baseCritDmg + buffs) / 100.
            // For example, if baseCritDmg is 50%, crit deals 1.5x damage.
            const critMultValue = 1 + (finalCritDmg / 100);

            const hitMin = nonCritDmg; // low roll = no crits
            const hitMax = nonCritDmg * critMultValue; // high roll = all crits
            const hitExpected = nonCritDmg * (1 + (finalCritRate / 100) * (critMultValue - 1)); // weighted average

            skillMinDmg += hitMin;
            skillExpectedDmg += hitExpected;
            skillMaxDmg += hitMax;

            // Accumulate formula buckets, weighted by this instance's damage
            if (hitExpected > 0) {
              const w = hitExpected;
              fb.w += w;
              fb.atk += w * (dmgType === 'physical' ? char.baseAtk : char.baseMatk);
              fb.skillPct += w * scaling;
              fb.atkBuffs += w * (1 + (dmgType === 'physical' ? atkBuff : matkBuff) / 100);
              fb.crit += w * (1 + (finalCritRate / 100) * (critMultValue - 1));
              fb.chain += w * chainMultiplier;
              fb.vuln += w * vulnerabilityMultiplier;
              fb.property += w * propertyMultiplier;
              fb.defense += w * defMultiplier;
              fb.weak += w * weakMultiplier;

              const wk = weakAgg.get(char.name) ?? { weak: 0, total: 0 };
              wk.total += w;
              if (isWeakPoint) wk.weak += w;
              weakAgg.set(char.name, wk);
            }

            detailedHits.push({
              partIndex,
              isWeakPoint,
              chainCount,
              buffMultiplier: dmgType === 'physical' ? atkBuff : matkBuff,
              debuffMultiplier: dmgType === 'physical' ? defDebuff : mresDebuff,
              elementMultiplier: propertyMultiplier,
              rawDamageMin: Math.round(hitMin),
              rawDamageExpected: Math.round(hitExpected),
              rawDamageMax: Math.round(hitMax),
              isCrit: false // visual detail
            });
          });

          // Chain increases per hit *applied to the boss*
          // In BD2, does hitting multiple tiles with a single hit increase the chain by hitCount * tilesHit?
          // Yes! Every damage number that pops up adds 1 chain. So hitting 2 tiles with 1 hit adds 2 chains.
          chainCount += hitParts.length;
        }
      }

      // Add to character totals
      damagePerCharacter[char.id].min += skillMinDmg;
      damagePerCharacter[char.id].expected += skillExpectedDmg;
      damagePerCharacter[char.id].max += skillMaxDmg;

      // Add to turn totals
      turnMinDamage += skillMinDmg;
      turnExpectedDamage += skillExpectedDmg;
      turnMaxDamage += skillMaxDmg;

      // Contributor tracking — buffs/debuffs/stats are constant within one
      // action, so weighting by the action's total expected damage matches the
      // per-hit weighting used for the bucket averages exactly.
      if (skillExpectedDmg > 0) {
        const w = skillExpectedDmg;
        const nameOf = (id: string) => characters.find(c => c.id === id)?.name ?? 'Unknown';

        charDmgAgg.set(char.name, (charDmgAgg.get(char.name) ?? 0) + w);
        skillActionsAgg.push({ label: `${char.name} · ${actionName}`, scaling, dmg: w });

        const relevantBuffType = dmgType === 'physical' ? 'buff_atk' : 'buff_matk';
        activeBuffs.filter(b => b.type === relevantBuffType).forEach(b => {
          const src = nameOf(b.sourceCharacterId);
          buffContribAgg.set(src, (buffContribAgg.get(src) ?? 0) + w * b.value);
        });

        const critMult = 1 + (finalCritRate / 100) * (finalCritDmg / 100);
        const critEntry = critAgg.get(char.name) ?? { w: 0, wx: 0 };
        critEntry.w += w;
        critEntry.wx += w * critMult;
        critAgg.set(char.name, critEntry);

        chainAddsAgg.set(char.name, (chainAddsAgg.get(char.name) ?? 0) + hitCount * hitParts.length);

        bossDebuffs.filter(d => d.type === 'debuff_vulnerability').forEach(d => {
          const src = nameOf(d.sourceCharacterId);
          vulnContribAgg.set(src, (vulnContribAgg.get(src) ?? 0) + w * d.value);
        });

        propAdvSum += w * elAdvantage * 100;
        propStatSum += w * char.basePropDmg;
        activeBuffs.filter(b => b.type === 'buff_prop_dmg').forEach(b => {
          const src = nameOf(b.sourceCharacterId);
          propBuffContribAgg.set(src, (propBuffContribAgg.get(src) ?? 0) + w * b.value);
        });

        if (dmgType !== 'pure') {
          const baseDefPct = dmgType === 'physical' ? boss.def : boss.mres;
          defBaseSum += w * baseDefPct;
          const relevantShred = dmgType === 'physical' ? 'debuff_def' : 'debuff_mres';
          const totalShred = bossDebuffs.filter(d => d.type === relevantShred).reduce((acc, d) => acc + d.value, 0);
          bossDebuffs.filter(d => d.type === relevantShred).forEach(d => {
            // Percentage points of boss defense this debuff strips away
            const recovered = totalShred > 0 ? baseDefPct * (Math.min(100, totalShred) / 100) * (d.value / totalShred) : 0;
            const src = nameOf(d.sourceCharacterId);
            defShredContribAgg.set(src, (defShredContribAgg.get(src) ?? 0) + w * recovered);
          });
        }
      }

      // Log action
      logs.push({
        turn: displayTurn,
        characterName: char.name,
        actionName,
        targetTile: targetOriginTile,
        damageType: dmgType,
        hitCount: hitParts.length > 0 ? hitCount : 0,
        hits: detailedHits,
        totalDamageMin: Math.round(skillMinDmg),
        totalDamageExpected: Math.round(skillExpectedDmg),
        totalDamageMax: Math.round(skillMaxDmg),
        appliedBuffs: [...newBuffsApplied],
        appliedDebuffs: [...newDebuffsApplied]
      });
    });

    // Save turn damage statistics
    turnMinDamage = Math.round(turnMinDamage);
    turnExpectedDamage = Math.round(turnExpectedDamage);
    turnMaxDamage = Math.round(turnMaxDamage);

    damagePerTurn.push({
      turn: displayTurn,
      min: turnMinDamage,
      expected: turnExpectedDamage,
      max: turnMaxDamage
    });

    const avg = (sum: number) => (fb.w > 0 ? sum / fb.w : null);

    // Assemble contributor lists, sorted by impact. Percentage-style entries
    // are damage-weighted averages (÷ fb.w), matching the bucket values.
    const pct = (sum: number) => (fb.w > 0 ? sum / fb.w : 0);
    const sortTrim = (list: FormulaContributor[]) =>
      list.sort((a, b) => b.share - a.share).slice(0, 8);

    const buffLines = (agg: Map<string, number>): FormulaContributor[] => {
      const entries = Array.from(agg.entries()).map(([name, sum]) => ({ name, value: pct(sum) }));
      const total = entries.reduce((acc, e) => acc + e.value, 0);
      return sortTrim(entries.map(e => ({
        name: e.name,
        display: `+${e.value.toFixed(0)}%`,
        share: total > 0 ? e.value / total : 0
      })));
    };

    const totalChains = Array.from(chainAddsAgg.values()).reduce((a, b) => a + b, 0);
    const propLines: FormulaContributor[] = [];
    if (pct(propAdvSum) > 0.5) propLines.push({ name: 'Element advantage', display: `+${pct(propAdvSum).toFixed(0)}%`, share: 0 });
    if (pct(propStatSum) > 0.5) propLines.push({ name: 'Character property stats', display: `+${pct(propStatSum).toFixed(0)}%`, share: 0 });
    buffLines(propBuffContribAgg).forEach(l => propLines.push(l));
    const propTotal = propLines.reduce((acc, l) => acc + parseFloat(l.display.replace(/[+%]/g, '')), 0);
    propLines.forEach(l => (l.share = propTotal > 0 ? parseFloat(l.display.replace(/[+%]/g, '')) / propTotal : 0));

    const defLines: FormulaContributor[] = [];
    if (fb.w > 0) {
      defLines.push({ name: 'Boss DEF/MRES', display: `−${pct(defBaseSum).toFixed(0)}%`, share: 1 });
      Array.from(defShredContribAgg.entries()).forEach(([name, sum]) => {
        defLines.push({
          name: `${name} (shred)`,
          display: `+${pct(sum).toFixed(1)}% back`,
          share: pct(defBaseSum) > 0 ? pct(sum) / pct(defBaseSum) : 0
        });
      });
    }

    formulaPerTurn.push({
      turn: displayTurn,
      totalExpected: turnExpectedDamage,
      atk: avg(fb.atk),
      skillPct: avg(fb.skillPct),
      atkBuffs: avg(fb.atkBuffs),
      crit: avg(fb.crit),
      chain: avg(fb.chain),
      dmgUpVuln: avg(fb.vuln),
      property: avg(fb.property),
      defense: avg(fb.defense),
      barrier: null, // barriers aren't simulated yet
      weakPoint: avg(fb.weak),
      contributors: {
        atk: sortTrim(Array.from(charDmgAgg.entries()).map(([name, dmg]) => ({
          name,
          display: new Intl.NumberFormat().format(Math.round(dmg)),
          share: turnExpectedDamage > 0 ? dmg / turnExpectedDamage : 0
        }))),
        skillPct: sortTrim(skillActionsAgg.map(a => ({
          name: a.label,
          display: `${Math.round(a.scaling)}%`,
          share: turnExpectedDamage > 0 ? a.dmg / turnExpectedDamage : 0
        }))),
        atkBuffs: buffLines(buffContribAgg),
        crit: sortTrim(Array.from(critAgg.entries()).map(([name, e]) => ({
          name,
          display: `×${(e.wx / e.w).toFixed(2)}`,
          share: fb.w > 0 ? e.w / fb.w : 0
        }))),
        chain: sortTrim(Array.from(chainAddsAgg.entries()).filter(([, n]) => n > 0).map(([name, n]) => ({
          name,
          display: `+${n} chain${n === 1 ? '' : 's'}`,
          share: totalChains > 0 ? n / totalChains : 0
        }))),
        dmgUpVuln: buffLines(vulnContribAgg),
        property: propLines,
        defense: defLines,
        weakPoint: sortTrim(Array.from(weakAgg.entries()).filter(([, v]) => v.total > 0).map(([name, v]) => ({
          name,
          display: `${Math.round((v.weak / v.total) * 100)}% on weak`,
          share: v.weak / v.total
        })))
      }
    });

    // End of Turn Buff/Debuff cleanup
    // Decrement turn durations
    characters.forEach(char => {
      characterBuffs[char.id].forEach(b => b.remainingTurns--);
      characterBuffs[char.id] = characterBuffs[char.id].filter(b => b.remainingTurns > 0);
    });

    bossDebuffs.forEach(d => d.remainingTurns--);
    bossDebuffs = bossDebuffs.filter(d => d.remainingTurns > 0);

    // Decrement cooldowns
    characters.forEach(char => {
      (char.costumes || []).forEach(costume => {
        const skill = costume.skill;
        if (skillCooldowns[char.id][skill.id] > 0) {
          skillCooldowns[char.id][skill.id]--;
        }
      });
    });
  });

  // Calculate overall totals
  let totalDamageMin = 0;
  let totalDamageExpected = 0;
  let totalDamageMax = 0;

  damagePerTurn.forEach(t => {
    totalDamageMin += t.min;
    totalDamageExpected += t.expected;
    totalDamageMax += t.max;
  });

  const finalDamagePerCharacter = Object.keys(damagePerCharacter).map(charId => {
    const char = characters.find(c => c.id === charId);
    return {
      characterId: charId,
      characterName: char ? char.name : 'Unknown',
      min: Math.round(damagePerCharacter[charId].min),
      expected: Math.round(damagePerCharacter[charId].expected),
      max: Math.round(damagePerCharacter[charId].max)
    };
  });

  return {
    totalDamageMin,
    totalDamageExpected,
    totalDamageMax,
    damagePerTurn,
    damagePerCharacter: finalDamagePerCharacter,
    formulaPerTurn,
    logs
  };
}
