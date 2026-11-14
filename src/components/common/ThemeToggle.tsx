"use client";

import { toggleTheme, useTheme } from "@/lib/theme";

/** Bouton clair / sombre. Affiche le thème vers lequel on bascule. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const next = useTheme() === "dark" ? "clair" : "sombre";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Passer au thème ${next}`}
      className={`font-mono text-xs uppercase tracking-widest text-muted hover:text-gold min-h-11 px-2 ${className}`}
    >
      <span aria-hidden="true">{next === "clair" ? "[*]" : "[)]"}</span>
      {/* Sous 640 px, seul le signe reste : le nom du thème est dans aria-label. */}
      <span className="hidden sm:inline"> {next}</span>
    </button>
  );
}
