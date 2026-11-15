"use client";

import { setMotion, useMotion } from "@/lib/motion";

/** Coupe ou rétablit les effets animés (scintillement, intro, paysage). */
export function MotionToggle({ className = "" }: { className?: string }) {
  const on = useMotion();
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setMotion(!on)}
      className={`font-mono text-xs uppercase tracking-widest text-muted hover:text-gold min-h-11 px-2 ${className}`}
    >
      Animations : {on ? "oui" : "non"}
    </button>
  );
}
