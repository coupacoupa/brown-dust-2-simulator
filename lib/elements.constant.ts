import { ElementType } from "@/domain.type";

// Element color palettes shared across surfaces. Component-internal art
// fallbacks keep their palettes next to the component; only palettes used
// by more than one file live here.

// Dark gradients for boss surfaces (battle HUD avatar, skill queue cards,
// boss info panel tiles). Element-hued end to end — never route these through
// the zinc scale: zinc-* is remapped in globals.css, so a zinc stop here
// silently tracks the app surface color instead of staying a dark accent.
export const ELEMENT_BOSS_GRADIENTS: Record<ElementType, string> = {
  fire: "from-orange-800 via-red-950 to-slate-950",
  water: "from-cyan-800 via-blue-950 to-slate-950",
  wind: "from-emerald-800 via-teal-950 to-slate-950",
  light: "from-amber-700 via-amber-950 to-slate-950",
  dark: "from-purple-800 via-indigo-950 to-slate-950",
};

// Subtle tinted backgrounds for the boss list cards
export const ELEMENT_CARD_GRADIENTS: Record<ElementType, string> = {
  fire: "from-red-950/60 via-zinc-950 to-zinc-950",
  water: "from-blue-950/60 via-zinc-950 to-zinc-950",
  wind: "from-emerald-950/60 via-zinc-950 to-zinc-950",
  light: "from-amber-950/60 via-zinc-950 to-zinc-950",
  dark: "from-purple-950/60 via-zinc-950 to-zinc-950",
};
