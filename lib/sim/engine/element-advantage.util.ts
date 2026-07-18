import { ElementType } from "@/domain.type";

// Element advantage table
// Fire > Wind > Water > Fire   |   Light <-> Dark

const ELEMENT_CHART: Partial<Record<ElementType, Partial<Record<ElementType, number>>>> = {
  fire:  { wind: 0.50, water: -0.25 },
  wind:  { water: 0.50, fire: -0.25 },
  water: { fire: 0.50, wind: -0.25 },
  light: { dark: 0.50 },
  dark:  { light: 0.50 },
};

export function getElementMultiplier(attacker: ElementType, defender: ElementType): number {
  return ELEMENT_CHART[attacker]?.[defender] ?? 0.0;
}
