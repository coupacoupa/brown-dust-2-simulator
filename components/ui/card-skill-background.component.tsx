"use client";

import React, { useState } from "react";
import { ElementType } from "@/domain.type";

const ELEMENT_FALLBACK_GRADIENTS: Record<ElementType, string> = {
  fire: "from-orange-950 via-zinc-900/50 to-red-950",
  water: "from-cyan-950 via-zinc-900/50 to-blue-950",
  wind: "from-emerald-950 via-zinc-900/50 to-teal-950",
  light: "from-amber-955/65 via-zinc-900/50 to-yellow-950/65",
  dark: "from-purple-955 via-zinc-900/50 to-indigo-950",
};

// Full-cover skill image background with element gradient fallbacks.
// Tries the explicit imagePath first, then a skill-art guess, then a
// character-art guess, and finally renders a stylized gradient placeholder.
export function CardSkillBackground({
  skillId,
  skillName,
  element,
  imagePath,
  imageScale = 1,
  imageTranslateY = 0,
  animate = true,
  className = "absolute inset-0 w-full h-full",
}: {
  skillId?: string;
  skillName?: string;
  element: ElementType;
  imagePath?: string; // Direct image path override (e.g. for costume base illustration)
  imageScale?: number; // Zoom level applied to the image (default 1 = full cover)
  imageTranslateY?: number; // Optional Y translation shift for images that need to be lowered
  animate?: boolean; // Fade/scale the image in on mount (disable when swapping images to avoid a jarring resize)
  className?: string;
}) {
  const [retry, setRetry] = useState(0);

  const filename =
    skillId ||
    (skillName
      ? skillName
          .toLowerCase()
          .replace(/\(.*\)/g, "")
          .trim()
          .replace(/\s+/g, "_")
      : "skip");
  const skillPath = imagePath || `/images/skills/${filename}.png`;
  const fallbackPath = `/images/characters/${filename.replace(/_s$/, "")}.png`;

  React.useEffect(() => {
    const timer = window.setTimeout(() => setRetry(0), 0);
    return () => window.clearTimeout(timer);
  }, [skillPath, fallbackPath]);

  const src = React.useMemo(() => {
    if (retry === 0) {
      return skillPath;
    }
    if (retry === 1 && !imagePath) {
      return fallbackPath;
    }
    return null;
  }, [retry, skillPath, fallbackPath, imagePath]);

  const gradient = ELEMENT_FALLBACK_GRADIENTS[element];

  if (!src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden ${className}`}
      >
        <span className="absolute text-5xl font-black text-white/5 uppercase select-none tracking-widest scale-150 rotate-12">
          {element}
        </span>
        <span className="absolute -right-4 -bottom-6 text-9xl font-black text-white/10 select-none uppercase tracking-tighter rotate-6">
          {filename.substring(0, 3)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 select-none overflow-hidden ${className}`}
    >
      {/* Element gradient base so transparent art (full-body illustrations)
          rests on a colored backdrop instead of the raw dark card. Hidden
          behind opaque skill busts, so it only shows through transparency. */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <img
        src={src}
        alt={filename}
        onError={() => setRetry((r) => r + 1)}
        className={`relative w-full h-full object-cover object-center ${
          animate ? "transition-all duration-300 animate-fadeIn" : ""
        }`}
        style={{
          transform: `scale(${imageScale}) translateY(${imageTranslateY * 100}%)`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
