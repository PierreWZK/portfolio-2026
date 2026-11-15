// Conversion d'une image détourée en caractères ASCII. Fonctions pures, sans DOM :
// pixels RGBA -> luminosité et masque par case -> un caractère par case.
// Le fond transparent reste vide ; le sujet est toujours « encré », même dans ses zones claires.

/** Du plus léger au plus dense. Aucun espace : une case du sujet n'est jamais vide. */
export const RAMP = "^~!?7YJ5PGB#&@";

export type Cells = {
  /** Luminosité perçue, 0..255. */
  lum: Float32Array;
  /** 1 si la case appartient au sujet (pixel assez opaque), 0 pour le fond. */
  mask: Uint8Array;
};

export function rgbaToCells(rgba: ArrayLike<number>): Cells {
  const n = rgba.length / 4;
  const lum = new Float32Array(n);
  const mask = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const p = i * 4;
    lum[i] = 0.2126 * rgba[p] + 0.7152 * rgba[p + 1] + 0.0722 * rgba[p + 2];
    mask[i] = rgba[p + 3] >= 128 ? 1 : 0;
  }
  return { lum, mask };
}

/** Étire la luminosité du sujet sur toute la plage 0..255 (le fond est ignoré). */
export function normalize({ lum, mask }: Cells): Cells {
  let min = 255;
  let max = 0;
  for (let i = 0; i < lum.length; i++) {
    if (!mask[i]) continue;
    if (lum[i] < min) min = lum[i];
    if (lum[i] > max) max = lum[i];
  }
  if (max - min < 1) return { lum, mask };
  return { lum: lum.map((v) => ((v - min) / (max - min)) * 255), mask };
}

export type AsciiOptions = {
  /** Thème clair : encre sombre sur papier, les zones sombres de l'image deviennent les caractères denses. */
  invert?: boolean;
  /** Variation de luminosité ajoutée à une case du sujet (survol, scintillement). */
  boost?: (x: number, y: number) => number;
};

/** Une ligne de texte par rangée de cases. Les cases du fond sont des espaces. */
export function cellsToAscii({ lum, mask }: Cells, cols: number, rows: number, options: AsciiOptions = {}): string {
  const { invert = false, boost } = options;
  const last = RAMP.length - 1;
  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      if (!mask[i]) {
        line += " ";
        continue;
      }
      let v = lum[i] + (boost ? boost(x, y) : 0);
      v = Math.min(255, Math.max(0, v));
      if (invert) v = 255 - v;
      line += RAMP[Math.round((v / 255) * last)];
    }
    lines.push(line);
  }
  return lines.join("\n");
}
