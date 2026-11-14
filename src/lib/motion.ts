"use client";

import { useSyncExternalStore } from "react";

// Préférence « animations » du visiteur. L'état vit sur <html data-motion="on|off">,
// posé avant le premier affichage par le script de layout.tsx (défaut : réglage du système).

const EVENT = "motionchange";

export function motionEnabled(): boolean {
  return document.documentElement.dataset.motion !== "off";
}

export function setMotion(on: boolean) {
  document.documentElement.dataset.motion = on ? "on" : "off";
  try {
    localStorage.setItem("motion", on ? "on" : "off");
  } catch {
    // Stockage indisponible (navigation privée) : le choix vaut pour la page en cours.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function onMotionChange(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

export function useMotion(): boolean {
  return useSyncExternalStore(onMotionChange, motionEnabled, () => true);
}

/** Termine l'intro de l'accueil et retient qu'elle a été vue. */
export function finishIntro() {
  document.documentElement.dataset.intro = "done";
  try {
    localStorage.setItem("intro-seen", "1");
  } catch {
    // Sans stockage, l'intro rejouera à la prochaine visite.
  }
}
