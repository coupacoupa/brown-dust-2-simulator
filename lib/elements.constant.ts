import { ElementType } from "@/domain.type";

// Element color palettes shared across surfaces. Component-internal art
// fallbacks keep their palettes next to the component; only palettes used
// by more than one file live here.

// Dark gradients for boss surfaces (battle HUD avatar, skill queue cards,
// boss info panel tiles)
export const ELEMENT_BOSS_GRADIENTS: Record<ElementType, string> = {
  fire: "from-orange-900 via-zinc-900 to-red-950",
  water: "from-cyan-900 via-zinc-900 to-blue-950",
  wind: "from-emerald-900 via-zinc-900 to-teal-950",
  light: "from-amber-900 via-zinc-900 to-yellow-950",
  dark: "from-purple-900 via-zinc-900 to-indigo-950",
};

// Subtle tinted backgrounds for the boss list cards
export const ELEMENT_CARD_GRADIENTS: Record<ElementType, string> = {
  fire: "from-red-950/60 via-zinc-950 to-zinc-950",
  water: "from-blue-950/60 via-zinc-950 to-zinc-950",
  wind: "from-emerald-950/60 via-zinc-950 to-zinc-950",
  light: "from-amber-950/60 via-zinc-950 to-zinc-950",
  dark: "from-purple-950/60 via-zinc-950 to-zinc-950",
};
