"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { RAMP } from "@/components/ascii/convert";
import { motionEnabled, onMotionChange } from "@/lib/motion";

// Apparitions au défilement, façon terminal :
// - les blocs (cartes, sections marquées data-reveal) se tracent de haut en bas, ligne par ligne ;
// - les titres h2 se « décodent » : des glyphes aléatoires se fixent un à un sur le vrai texte.
// Seuls les éléments encore sous la ligne de flottaison sont cachés puis révélés : rien ne disparaît
// à l'arrivée sur la page. Animations coupées : tout reste visible, rien ne bouge.
// Contrôle de position au défilement plutôt qu'IntersectionObserver : celui-ci ne signale pas
// les éléments sautés d'un coup, qui resteraient cachés.

const TARGETS = "main .card, main [data-reveal], main h2:not(.card h2)";

/**
 * Vrai quand React a hydraté l'élément (il y attache alors sa clé interne __reactFiber…).
 * La page est hydratée après le layout : y toucher avant provoquerait une erreur d'hydratation.
 */
const hydrated = (el: Element) => Object.keys(el).some((key) => key.startsWith("__reactFiber"));
const STAGGER = 70; // ms entre deux éléments révélés ensemble
const DECODE = 520; // ms pour décoder un titre

/** Titre fait d'un seul nœud texte : on modifie ce nœud (celui que React connaît), sans rien casser. */
const isPlainHeading = (el: Element) => el.tagName === "H2" && el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE;

function decode(el: HTMLElement) {
  const node = el.firstChild as Text;
  const final = node.nodeValue ?? "";
  el.setAttribute("aria-label", final);
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / DECODE);
    const fixed = Math.floor(t * final.length);
    let out = final.slice(0, fixed);
    for (let i = fixed; i < final.length; i++) out += final[i] === " " ? " " : RAMP[Math.floor(Math.random() * RAMP.length)];
    node.nodeValue = out;
    if (t < 1) requestAnimationFrame(step);
    else el.removeAttribute("aria-label");
  };
  requestAnimationFrame(step);
}

export function ScrollFx() {
  const path = usePathname();

  useEffect(() => {
    if (!motionEnabled()) return;
    // Seuil : un élément se révèle quand son haut passe au-dessus de 92 % de la hauteur d'écran.
    // Un saut direct plus bas (touche Fin, ancre) révèle aussi tout ce qui a été dépassé.
    const line = () => innerHeight * 0.92;
    const waiting = new Set<HTMLElement>();
    let frame = 0;
    let tries = 0;
    const start = () => {
      frame = 0;
      const targets = [...document.querySelectorAll<HTMLElement>(TARGETS)];
      // Page pas encore hydratée : on réessaie à l'image suivante (au plus ~3 s, puis on renonce).
      if (!targets.every(hydrated)) {
        if (++tries < 180) frame = requestAnimationFrame(start);
        return;
      }
      targets.forEach((el) => {
        if (el.getBoundingClientRect().top < line()) return; // déjà à l'écran : laissé tel quel
        el.classList.add("fx-wait");
        waiting.add(el);
      });
      addEventListener("scroll", schedule, { passive: true });
      addEventListener("resize", schedule);
    };

    const check = () => {
      frame = 0;
      let batch = 0;
      for (const el of waiting) {
        if (el.getBoundingClientRect().top >= line()) continue;
        waiting.delete(el);
        el.classList.remove("fx-wait");
        if (isPlainHeading(el)) {
          decode(el);
        } else {
          el.style.setProperty("--fx-delay", `${batch++ * STAGGER}ms`);
          el.classList.add("fx-in");
          el.addEventListener("animationend", () => el.classList.remove("fx-in"), { once: true });
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    start();

    const reveal = () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      waiting.forEach((el) => el.classList.remove("fx-wait"));
      waiting.clear();
    };
    // Animations coupées en cours de route : tout ce qui attendait s'affiche aussitôt.
    const off = onMotionChange(() => {
      if (!motionEnabled()) reveal();
    });
    return () => {
      off();
      reveal();
    };
  }, [path]);

  return null;
}
