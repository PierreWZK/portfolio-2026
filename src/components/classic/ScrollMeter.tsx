"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Jauge de lecture en caractères, en bas à droite : [######··········] 37 %.
// Décorative (aria-hidden) : elle indique où l'on en est dans la page, sans rien animer d'autre.
// Masquée quand la page tient à l'écran, et sur petit écran où elle couvrirait le contenu.

const CELLS = 16;

export function ScrollMeter() {
  const path = usePathname();
  const box = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      el.hidden = max < 200;
      if (el.hidden) return;
      const ratio = Math.min(1, Math.max(0, scrollY / max));
      const full = Math.round(ratio * CELLS);
      el.textContent = `[${"#".repeat(full)}${"·".repeat(CELLS - full)}] ${String(Math.round(ratio * 100)).padStart(3, " ")} %`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [path]);

  return (
    <p
      ref={box}
      aria-hidden="true"
      hidden
      className="pointer-events-none fixed bottom-4 right-4 z-40 border border-line bg-bg px-2 py-1 font-mono text-[11px] whitespace-pre text-muted max-sm:hidden!"
    />
  );
}
