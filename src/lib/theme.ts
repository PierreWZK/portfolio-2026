"use client";

import { useSyncExternalStore } from "react";
import { motionEnabled } from "./motion";

// Thème clair / sombre. L'état vit sur <html data-theme>, posé avant le premier
// affichage par le script de layout.tsx. Sombre par défaut.

export type Theme = "dark" | "light";

const EVENT = "themechange";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, currentTheme, () => "dark");
}

/**
 * Bascule le thème. Si les animations sont actives et que le navigateur le permet,
 * le nouveau thème se dévoile de gauche à droite derrière un front de caractères
 * ASCII (règles « theme-wipe » de globals.css). La page reste utilisable pendant ce temps.
 */
export function toggleTheme() {
  const root = document.documentElement;
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";

  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Stockage indisponible : le choix vaut pour la page en cours.
    }
    window.dispatchEvent(new Event(EVENT));
  };

  if (!motionEnabled() || !document.startViewTransition) {
    apply();
    return;
  }
  root.dataset.wipe = "";
  document.startViewTransition(apply).finished.finally(() => {
    delete root.dataset.wipe;
  });
}
