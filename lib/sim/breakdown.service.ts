import { FormulaContributor, TurnFormulaBreakdown } from "@/domain.type";

// Per-turn formula analytics, derived from the damage events the engine
// emits. Everything is damage-weighted: each hit instance contributes its
// multipliers weighted by its expected damage, so the panel reflects where
// the turn's damage actually came from.

export interface SourcedValue {
  source: string; // character name that applied the buff/debuff
  value: number; // %
}

// One action that dealt damage this turn. Multipliers that are constant
// across the action's hits live at the top level; only chain and weak-point
// values vary per hit instance.
export interface ActionDamageEvent {
  charName: string;
  actionName: string;
  scaling: number;
  baseStat: number; // pre-buff ATK or MATK
  atkBuffPct: number; // summed relevant ATK%/MATK% buffs
  critExpectedMult: number; // 1 + critRate% × critDmg%
  vulnMultiplier: number;
  propertyMultiplier: number;
  defMultiplier: number;
  elAdvantagePct: number; // element advantage as %
  basePropDmgPct: number; // character's flat property damage stat
  bossBaseDefPct: number | null; // boss DEF/MRES for this damage type; null = pure
  atkBuffs: SourcedValue[]; // relevant ATK/MATK buffs by source
  propBuffs: SourcedValue[];
  vulnDebuffs: SourcedValue[];
  defShreds: SourcedValue[]; // relevant DEF/MRES shred debuffs by source
  chainsAdded: number;
  expected: number; // action total expected damage
  hits: {
    expected: number;
    chainMultiplier: number;
    weakMultiplier: number;
    isWeakPoint: boolean;
  }[];
}

export function buildTurnFormulaBreakdown(
  turn: number,
  totalExpected: number,
  events: ActionDamageEvent[],
): TurnFormulaBreakdown {
  // Damage-weighted bucket accumulators
  const fb = { w: 0, atk: 0, skillPct: 0, atkBuffs: 0, crit: 0, chain: 0, vuln: 0, property: 0, defense: 0, weak: 0 };

  // Contributor tracking per bucket (all damage-weighted like `fb`)
  const charDmgAgg = new Map<string, number>(); // char name → expected dmg
  const skillActionsAgg: { label: string; scaling: number; dmg: number }[] = [];
  const buffContribAgg = new Map<string, number>(); // buff source → Σ(w × value%)
  const critAgg = new Map<string, { w: number; wx: number }>(); // char name → weighted crit mult
  const chainAddsAgg = new Map<string, number>(); // char name → chains added
  const vulnContribAgg = new Map<string, number>(); // debuff source → Σ(w × value%)
  let propAdvSum = 0; // Σ(w × advantage%)
  let propStatSum = 0; // Σ(w × char basePropDmg%)
  const propBuffContribAgg = new Map<string, number>(); // buff source → Σ(w × value%)
  let defBaseSum = 0; // Σ(w × effective boss DEF/MRES%)
  const defShredContribAgg = new Map<string, number>(); // debuff source → Σ(w × recovered pts)
  const weakAgg = new Map<string, { weak: number; total: number }>(); // char name → weak-tile dmg share

  events.forEach((ev) => {
    ev.hits.forEach((hit) => {
      const w = hit.expected;
      fb.w += w;
      fb.atk += w * ev.baseStat;
      fb.skillPct += w * ev.scaling;
      fb.atkBuffs += w * (1 + ev.atkBuffPct / 100);
      fb.crit += w * ev.critExpectedMult;
      fb.chain += w * hit.chainMultiplier;
      fb.vuln += w * ev.vulnMultiplier;
      fb.property += w * ev.propertyMultiplier;
      fb.defense += w * ev.defMultiplier;
      fb.weak += w * hit.weakMultiplier;

      const wk = weakAgg.get(ev.charName) ?? { weak: 0, total: 0 };
      wk.total += w;
      if (hit.isWeakPoint) wk.weak += w;
      weakAgg.set(ev.charName, wk);
    });

    // Buffs/debuffs/stats are constant within one action, so weighting by the
    // action's total expected damage matches the per-hit weighting exactly.
    const w = ev.expected;
    charDmgAgg.set(ev.charName, (charDmgAgg.get(ev.charName) ?? 0) + w);
    skillActionsAgg.push({ label: `${ev.charName} · ${ev.actionName}`, scaling: ev.scaling, dmg: w });

    ev.atkBuffs.forEach((b) => {
      buffContribAgg.set(b.source, (buffContribAgg.get(b.source) ?? 0) + w * b.value);
    });

    const critEntry = critAgg.get(ev.charName) ?? { w: 0, wx: 0 };
    critEntry.w += w;
    critEntry.wx += w * ev.critExpectedMult;
    critAgg.set(ev.charName, critEntry);

    chainAddsAgg.set(ev.charName, (chainAddsAgg.get(ev.charName) ?? 0) + ev.chainsAdded);

    ev.vulnDebuffs.forEach((d) => {
      vulnContribAgg.set(d.source, (vulnContribAgg.get(d.source) ?? 0) + w * d.value);
    });

    propAdvSum += w * ev.elAdvantagePct;
    propStatSum += w * ev.basePropDmgPct;
    ev.propBuffs.forEach((b) => {
      propBuffContribAgg.set(b.source, (propBuffContribAgg.get(b.source) ?? 0) + w * b.value);
    });

    if (ev.bossBaseDefPct !== null) {
      defBaseSum += w * ev.bossBaseDefPct;
      const totalShred = ev.defShreds.reduce((acc, d) => acc + d.value, 0);
      if (totalShred > 0) {
        // Shreds subtract percentage points from the boss's DEF (additive
        // bracket). Recover the points actually stripped from the effective
        // multiplier the engine applied, then split them by shred share.
        const effDefPct = (1 - ev.defMultiplier) * 100;
        const removedPts = Math.max(0, ev.bossBaseDefPct - effDefPct);
        ev.defShreds.forEach((d) => {
          defShredContribAgg.set(
            d.source,
            (defShredContribAgg.get(d.source) ?? 0) + w * removedPts * (d.value / totalShred),
          );
        });
      }
    }
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
    return sortTrim(
      entries.map((e) => ({
        name: e.name,
        display: `+${e.value.toFixed(0)}%`,
        share: total > 0 ? e.value / total : 0,
      })),
    );
  };

  const totalChains = Array.from(chainAddsAgg.values()).reduce((a, b) => a + b, 0);
  const propLines: FormulaContributor[] = [];
  if (pct(propAdvSum) > 0.5) propLines.push({ name: 'Element advantage', display: `+${pct(propAdvSum).toFixed(0)}%`, share: 0 });
  if (pct(propStatSum) > 0.5) propLines.push({ name: 'Character property stats', display: `+${pct(propStatSum).toFixed(0)}%`, share: 0 });
  buffLines(propBuffContribAgg).forEach((l) => propLines.push(l));
  const propTotal = propLines.reduce((acc, l) => acc + parseFloat(l.display.replace(/[+%]/g, '')), 0);
  propLines.forEach((l) => (l.share = propTotal > 0 ? parseFloat(l.display.replace(/[+%]/g, '')) / propTotal : 0));

  const defLines: FormulaContributor[] = [];
  if (fb.w > 0) {
    defLines.push({ name: 'Boss DEF/MRES', display: `−${pct(defBaseSum).toFixed(0)}%`, share: 1 });
    Array.from(defShredContribAgg.entries()).forEach(([name, sum]) => {
      defLines.push({
        name: `${name} (shred)`,
        display: `+${pct(sum).toFixed(1)}% back`,
        share: pct(defBaseSum) > 0 ? pct(sum) / pct(defBaseSum) : 0,
      });
    });
  }

  return {
    turn,
    totalExpected,
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
      atk: sortTrim(
        Array.from(charDmgAgg.entries()).map(([name, dmg]) => ({
          name,
          display: new Intl.NumberFormat().format(Math.round(dmg)),
          share: totalExpected > 0 ? dmg / totalExpected : 0,
        })),
      ),
      skillPct: sortTrim(
        skillActionsAgg.map((a) => ({
          name: a.label,
          display: `${Math.round(a.scaling)}%`,
          share: totalExpected > 0 ? a.dmg / totalExpected : 0,
        })),
      ),
      atkBuffs: buffLines(buffContribAgg),
      crit: sortTrim(
        Array.from(critAgg.entries()).map(([name, e]) => ({
          name,
          display: `×${(e.wx / e.w).toFixed(2)}`,
          share: fb.w > 0 ? e.w / fb.w : 0,
        })),
      ),
      chain: sortTrim(
        Array.from(chainAddsAgg.entries())
          .filter(([, n]) => n > 0)
          .map(([name, n]) => ({
            name,
            display: `+${n} chain${n === 1 ? '' : 's'}`,
            share: totalChains > 0 ? n / totalChains : 0,
          })),
      ),
      dmgUpVuln: buffLines(vulnContribAgg),
      property: propLines,
      defense: defLines,
      weakPoint: sortTrim(
        Array.from(weakAgg.entries())
          .filter(([, v]) => v.total > 0)
          .map(([name, v]) => ({
            name,
            display: `${Math.round((v.weak / v.total) * 100)}% on weak`,
            share: v.weak / v.total,
          })),
      ),
    },
  };
}
