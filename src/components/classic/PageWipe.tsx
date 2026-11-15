"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { RAMP } from "@/components/ascii/convert";
import { motionEnabled } from "@/lib/motion";
import { sections } from "@/lib/nav";

// Changement de vue : un rideau de caractères balaie l'écran et découvre la nouvelle page.
// Le bord du rideau est une frange de glyphes, du plus léger au plus dense, qui scintille pendant le passage.
// Sens du balayage : vers une rubrique plus loin dans le menu, le rideau part à gauche (on avance) ;
// vers une rubrique précédente, il part à droite. Animations coupées : rien ne se passe.

const FRINGE = 16; // colonnes de la frange
const DURATION = 540;
const EASE = "cubic-bezier(0.77, 0, 0.175, 1)"; // mouvement à l'écran : ease-in-out fort

const rank = (path: string) => sections.findIndex((s) => path.startsWith(s.href));

/** Texte du rideau : une zone pleine, et la frange du côté qui découvre la page. */
function curtain(cols: number, rows: number, fringeAtStart: boolean): string {
  const last = RAMP.length - 1;
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols + FRINGE; c++) {
      // d : 0 au bord extérieur de la frange, 1 côté zone pleine.
      const d = fringeAtStart ? c / FRINGE : (cols + FRINGE - 1 - c) / FRINGE;
      // Zone pleine : le fond, à peine piqué de points. Frange : de plus en plus dense vers la zone pleine.
      if (d >= 1) line += Math.random() < 0.03 ? "." : " ";
      else line += Math.random() < 0.15 + d * 0.85 ? RAMP[Math.min(last, Math.floor(d * last + Math.random() * 3))] : " ";
    }
    lines.push(line);
  }
  return lines.join("\n");
}

export function PageWipe() {
  const path = usePathname();
  const previous = useRef(path);
  const box = useRef<HTMLDivElement>(null);
  const pre = useRef<HTMLPreElement>(null);

  // Avant l'affichage de la nouvelle page : sinon elle apparaîtrait une image avant le rideau.
  useLayoutEffect(() => {
    const from = previous.current;
    previous.current = path;
    const el = box.current;
    const text = pre.current;
    if (from === path || !el || !text || !motionEnabled()) return;

    const forward = rank(path) >= rank(from);
    const size = parseFloat(getComputedStyle(text).fontSize);
    const cols = Math.ceil(innerWidth / (size * 0.6)) + 1;
    const rows = Math.ceil(innerHeight / size) + 1;
    const fringe = FRINGE * size * 0.6;
    // En avançant, la frange est à droite et le rideau part à gauche ; en reculant, l'inverse.
    el.style.left = forward ? "0px" : `${-fringe}px`;
    el.style.width = `${innerWidth + fringe}px`;
    const paint = () => (text.textContent = curtain(cols, rows, !forward));
    paint();
    el.style.visibility = "visible";

    const flicker = window.setInterval(paint, 70);
    const run = el.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(${forward ? "-100%" : "100%"})` }],
      { duration: DURATION, easing: EASE, fill: "forwards" },
    );
    const end = () => {
      window.clearInterval(flicker);
      el.style.visibility = "hidden";
    };
    run.onfinish = end;
    return () => {
      run.cancel();
      end();
    };
  }, [path]);

  return (
    <div
      ref={box}
      data-page-wipe
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-50 overflow-hidden bg-bg"
      style={{ visibility: "hidden" }}
    >
      <pre ref={pre} className="m-0 font-mono text-[14px] leading-none text-gold" />
    </div>
  );
}
