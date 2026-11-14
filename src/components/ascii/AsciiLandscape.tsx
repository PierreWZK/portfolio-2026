"use client";

import { useEffect, useRef } from "react";
import { motionEnabled, onMotionChange } from "@/lib/motion";
import { generateLandscape } from "./landscape";

const REVEAL_MS = 1100;

/**
 * Paysage ASCII décoratif qui remplit son conteneur.
 * Écrit directement dans le DOM : aucun rendu React pendant l'animation.
 */
export function AsciiLandscape({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLPreElement>(null);
  const land = useRef<HTMLPreElement>(null);
  const moon = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || !sky.current || !land.current || !moon.current) return;
    const layers = { sky: sky.current, land: land.current, moon: moon.current };

    let cols = 0;
    let rows = 0;
    let timer = 0;
    const start = performance.now();

    function measure() {
      // Taille d'une case : on mesure dix caractères dans la police réelle.
      const probe = document.createElement("span");
      probe.textContent = "MMMMMMMMMM";
      layers.sky.append(probe);
      const rect = probe.getBoundingClientRect();
      probe.remove();
      if (!rect.width || !rect.height) return;
      cols = Math.ceil(el!.clientWidth / (rect.width / 10));
      rows = Math.floor(el!.clientHeight / rect.height);
    }

    function draw() {
      const elapsed = performance.now() - start;
      const playing = document.documentElement.dataset.intro === "play";
      const progress = playing ? Math.min(1, elapsed / REVEAL_MS) : 1;
      const animated = motionEnabled();
      const out = generateLandscape(cols, rows, animated ? elapsed / 1000 : 0, progress);
      layers.sky.textContent = out.sky;
      layers.land.textContent = out.land;
      layers.moon.textContent = out.moon;
      return { animated, revealing: progress < 1 };
    }

    function loop() {
      clearTimeout(timer);
      // Onglet caché : on ne dessine pas, on revient voir plus tard.
      const state = document.hidden ? { animated: true, revealing: false } : draw();
      if (state.animated) timer = window.setTimeout(loop, state.revealing ? 60 : 250);
    }

    let alive = true;
    function refresh() {
      // Après démontage, la promesse des polices peut encore arriver : on l'ignore.
      if (!alive) return;
      measure();
      loop();
    }

    const observer = new ResizeObserver(refresh);
    observer.observe(el);
    document.fonts.ready.then(refresh);
    const offMotion = onMotionChange(loop);

    return () => {
      alive = false;
      clearTimeout(timer);
      observer.disconnect();
      offMotion();
    };
  }, []);

  const layer = "absolute inset-0 m-0 overflow-hidden whitespace-pre";
  return (
    <div
      ref={box}
      aria-hidden="true"
      className={`relative overflow-hidden select-none font-mono leading-[1.15] text-[10px] sm:text-xs lg:text-sm ${className}`}
    >
      <pre ref={sky} className={`${layer} text-text`} />
      <pre ref={land} className={`${layer} text-muted`} />
      <pre ref={moon} className={`${layer} text-gold`} />
    </div>
  );
}
