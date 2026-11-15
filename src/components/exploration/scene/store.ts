import { useSyncExternalStore } from "react";

// État du bureau 3D : quel objet est ouvert, quelle page du livre, et quels objets ont déjà été découverts.
// Les découvertes sont gardées pour la session (sessionStorage) : elles font évoluer la pièce.

export const KINDS = ["computer", "books", "frames", "postits", "phone", "clock"] as const;
export type Kind = (typeof KINDS)[number];
export type Focus = { kind: Kind; index?: number } | null;
/** project : projet affiché sur l'écran de l'ordinateur (index dans `projects`). */
export type ExplorationState = { focus: Focus; seen: Kind[]; bookPage: number; project: number; hint: string | null };

const KEY = "exploration-seen";
const SERVER: ExplorationState = { focus: null, seen: [], bookPage: 0, project: 0, hint: null };

let state: ExplorationState = SERVER;
let loaded = false;
const listeners = new Set<() => void>();

function readSeen(): Kind[] {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((k): k is Kind => (KINDS as readonly string[]).includes(k));
  } catch {
    // Stockage indisponible (navigation privée) : les découvertes ne survivent pas au rechargement.
    return [];
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = { ...SERVER, seen: readSeen() };
}

function emit(next: ExplorationState) {
  state = next;
  listeners.forEach((listener) => listener());
}

export function sameFocus(a: Focus, b: Focus): boolean {
  if (!a || !b) return a === b;
  return a.kind === b.kind && a.index === b.index;
}

/** Ouvre un objet (ou revient au bureau avec null). Le livre repart toujours de sa première page. */
export function setFocus(focus: Focus) {
  ensureLoaded();
  let seen = state.seen;
  if (focus && !seen.includes(focus.kind)) {
    seen = [...seen, focus.kind];
    try {
      sessionStorage.setItem(KEY, JSON.stringify(seen));
    } catch {
      // Sans stockage : la découverte compte pour cette page seulement.
    }
  }
  emit({ focus, seen, bookPage: 0, project: 0, hint: null });
}

/** Projet affiché sur l'écran de l'ordinateur. */
export function setProject(project: number) {
  ensureLoaded();
  emit({ ...state, project });
}

/** Le livre a deux doubles pages : 0 (titre) et 1 (description et compétences). */
export const BOOK_PAGES = 2;
export function setBookPage(page: number) {
  ensureLoaded();
  emit({ ...state, bookPage: Math.min(BOOK_PAGES - 1, Math.max(0, page)) });
}

/** Étiquette de l'objet survolé (null : aucun). Affichée près du pointeur par l'interface. */
export function setHint(hint: string | null) {
  ensureLoaded();
  if (state.hint !== hint) emit({ ...state, hint });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ExplorationState {
  ensureLoaded();
  return state;
}

export function useExploration(): ExplorationState {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER);
}
