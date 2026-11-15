// Génère le paysage ASCII de l'accueil : ciel étoilé, lune, trois crêtes de montagnes.
// Fonction pure : mêmes entrées, même dessin. Trois calques de même taille,
// superposés à l'écran, pour pouvoir donner une couleur à chacun.

export type Landscape = { sky: string; land: string; moon: string };

/** Pseudo-hasard stable entre 0 et 1 pour une case. */
function hash(x: number, y: number, seed = 0): number {
  const v = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return v - Math.floor(v);
}

/** Onde triangulaire 0..1 : donne des sommets pointus. */
// Du fond vers l'avant. Chaque crête est une suite de pics aux flancs droits.
// low / high : hauteur des pics, en fraction de la hauteur totale.
// slope : lignes gagnées par colonne (1 donne des flancs en « / » et « \ » nets).
const RIDGES = [
  { low: 0.5, high: 0.86, slope: 0.5, seed: 1.3, fill: ".", density: 0.1 },
  { low: 0.34, high: 0.6, slope: 1, seed: 4.1, fill: ":", density: 0.35 },
  { low: 0.14, high: 0.36, slope: 1, seed: 7.7, fill: "%#", density: 0.75 },
];

const STAR_CHARS = [".", "·", "+", "*"];

/**
 * @param t temps en secondes, fait scintiller les étoiles
 * @param progress 0..1, part des caractères déjà apparus (animation d'arrivée)
 */
export function generateLandscape(cols: number, rows: number, t = 0, progress = 1): Landscape {
  if (cols <= 0 || rows <= 0) return { sky: "", land: "", moon: "" };

  // Ligne du sommet de chaque crête, pour chaque colonne (avec une colonne de marge de chaque côté).
  const tops = RIDGES.map((r) => {
    // Écart entre deux pics : assez serré pour que les flancs se croisent au-dessus de la base.
    const spacing = Math.max(6, (rows * (r.high - r.low) * 1.5) / r.slope);
    return Array.from({ length: cols + 2 }, (_, i) => {
      const x = i - 1;
      const n = Math.round(x / spacing);
      let h = rows * r.low * 0.6;
      for (let k = n - 2; k <= n + 2; k++) {
        const center = (k + (hash(k, 0, r.seed) - 0.5) * 0.7) * spacing;
        const peak = rows * (r.low + (r.high - r.low) * hash(k, 1, r.seed));
        h = Math.max(h, peak - Math.abs(x - center) * r.slope);
      }
      return rows - Math.round(h);
    });
  });

  // Lune : croissant en haut à droite. Une case est environ deux fois plus haute que large.
  const moonX = cols * 0.78;
  const moonY = rows * 0.24;
  const moonR = Math.max(2, Math.min(rows * 0.17, cols * 0.07));

  const sky: string[] = [];
  const land: string[] = [];
  const moon: string[] = [];

  for (let y = 0; y < rows; y++) {
    let skyRow = "";
    let landRow = "";
    let moonRow = "";
    for (let x = 0; x < cols; x++) {
      let s = " ";
      let l = " ";
      let m = " ";

      if (hash(x, y, 9) < progress) {
        // La crête la plus proche qui couvre la case l'emporte.
        let ridge = -1;
        for (let i = RIDGES.length - 1; i >= 0; i--) {
          if (y >= tops[i][x + 1]) {
            ridge = i;
            break;
          }
        }

        if (ridge >= 0) {
          const top = tops[ridge];
          const r = RIDGES[ridge];
          const left = top[x];
          const right = top[x + 2];
          const isTop = y === top[x + 1];
          // Contour : le sommet de la colonne, et les flancs raides (un voisin plus bas).
          if (isTop || left > y || right > y) {
            l = left > y && right > y ? "^" : left > y ? "/" : right > y ? "\\" : "_";
          } else if (hash(x, y, r.seed) < r.density) {
            l = r.fill[Math.floor(hash(x, y, r.seed + 1) * r.fill.length)];
          }
        } else {
          const dx = (x - moonX) * 0.5;
          const dy = y - moonY;
          const inMoon = dx * dx + dy * dy <= moonR * moonR;
          const cutX = dx + moonR * 0.45;
          const inCut = cutX * cutX + (dy + moonR * 0.15) ** 2 <= moonR * moonR * 0.8;
          if (inMoon && !inCut) {
            m = "@";
          } else if (!inMoon && hash(x, y, 2) < 0.02) {
            const phase = hash(x, y, 5) * 6.283 + t * (0.6 + hash(x, y, 6));
            s = STAR_CHARS[Math.round(((Math.sin(phase) + 1) / 2) * (STAR_CHARS.length - 1))];
          }
        }
      }

      skyRow += s;
      landRow += l;
      moonRow += m;
    }
    sky.push(skyRow);
    land.push(landRow);
    moon.push(moonRow);
  }

  return { sky: sky.join("\n"), land: land.join("\n"), moon: moon.join("\n") };
}
