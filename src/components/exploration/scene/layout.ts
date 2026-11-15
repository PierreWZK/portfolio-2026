import type { Focus } from "./store";

// Disposition du bureau : positions des objets (mètres, origine au centre de la pièce au sol),
// zones cliquables, et points de vue de la caméra pour chaque objet ouvert.
// Tout ce qui est cliquable et tout ce que la caméra vise vient d'ici.

export type Vec3 = [number, number, number];

/**
 * Calque DOM où drei pose les éléments <Html> (écran, pages du livre). Il est créé avant la scène :
 * sans cible fixe, drei change de cible après le premier rendu et le premier <Html> reste vide.
 */
export const htmlLayer: { current: HTMLElement | null } = { current: null };
/** portrait : recul propre à cet objet sur écran en hauteur (sinon le recul général s'applique). */
export type View = { pos: Vec3; target: Vec3; portrait?: number };

export const HOME_TARGET: Vec3 = [0, 1.15, -1.6];

export const ANCHORS = {
  computer: { at: [0, 1.3, -2.6] as Vec3, radius: 0.6 },
  phone: { at: [-0.55, 0.84, -2.2] as Vec3, radius: 0.2 },
  postits: { at: [-0.8, 1.42, -2.95] as Vec3, radius: 0.3 },
  clock: { at: [2.15, 2.5, -2.95] as Vec3, radius: 0.3 },
};

/** Cadres sur les murs : position du centre, rotation (0 = mur du fond, PI/2 = mur de gauche), taille en m. */
export const FRAMES: { position: Vec3; rotationY: number; size: [number, number] }[] = [
  { position: [-1.75, 2.0, -2.98], rotationY: 0, size: [0.5, 0.65] },
  { position: [-2.45, 1.75, -2.98], rotationY: 0, size: [0.4, 0.4] },
  { position: [-2.98, 1.9, 0.75], rotationY: Math.PI / 2, size: [0.6, 0.45] },
  { position: [-2.98, 1.8, 1.65], rotationY: Math.PI / 2, size: [0.45, 0.6] },
  { position: [-2.98, 1.75, 2.4], rotationY: Math.PI / 2, size: [0.4, 0.4] },
  { position: [1.0, 2.35, -2.98], rotationY: 0, size: [0.45, 0.35] },
];

/** Livres : un par formation, sur l'étagère du haut, contre le mur du fond. */
export function bookHeight(index: number): number {
  return 0.3 + (index % 3) * 0.03;
}
export function bookAt(index: number): Vec3 {
  return [1.6 + index * 0.095, 1.82 + bookHeight(index) / 2, -2.86];
}

// Pour chaque objet ouvert : où se place la caméra, et sur quoi elle regarde.
function frontOf(position: Vec3, rotationY: number): View {
  const [x, y, z] = position;
  if (rotationY === 0) return { pos: [x, y, z + 1.3], target: [x, y, z] };
  return { pos: [x + 1.3, y, z], target: [x, y, z] };
}

export function viewFor(focus: Focus): View | null {
  if (!focus) return null;
  switch (focus.kind) {
    case "computer":
      // Par-dessus l'épaule droite du personnage : sa tête ne masque pas l'écran.
      return { pos: [1.05, 1.75, -1.2], target: [0, 1.28, -2.6] };
    case "phone":
      return { pos: [-0.55, 1.75, -1.45], target: [-0.55, 0.84, -2.2] };
    case "postits":
      return { pos: [-0.55, 1.55, -1.55], target: [-0.8, 1.42, -2.95] };
    case "clock":
      return { pos: [1.35, 2.55, -1.5], target: [2.15, 2.5, -2.95] };
    case "books": {
      const [bx, by, bz] = bookAt(focus.index ?? 0);
      // Le livre ouvert est large : sur téléphone, on reste près pour que le texte se lise.
      return { pos: [bx, by + 0.05, bz + 1.45], target: [bx, by, bz], portrait: 1.5 };
    }
    case "frames": {
      const frame = FRAMES[focus.index ?? 0];
      return frame ? frontOf(frame.position, frame.rotationY) : null;
    }
  }
}
