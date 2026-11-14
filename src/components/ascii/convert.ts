// Conversion d'une image en caractères ASCII. Fonctions pures, sans DOM :
// pixels RGBA -> luminosité par case -> un caractère par case.

/** Du plus vide au plus dense. */
export const RAMP = " .:-=+*#%@";

/** Luminosité perçue (0..255) de chaque pixel RGBA. Un pixel transparent compte comme noir. */
export function rgbaToLum(rgba: ArrayLike<number>): Float32Array {
  const lum = new Float32Array(rgba.length / 4);
  for (let i = 0; i < lum.length; i++) {
    const p = i * 4;
    lum[i] = ((0.2126 * rgba[p] + 0.7152 * rgba[p + 1] + 0.0722 * rgba[p + 2]) * rgba[p + 3]) / 255;
  }
  return lum;
}

/** Étire les valeurs sur toute la plage 0..255, pour qu'une photo terne reste lisible. */
export function normalize(lum: Float32Array): Float32Array {
  let min = 255;
  let max = 0;
  for (const v of lum) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (max - min < 1) return lum;
  return lum.map((v) => ((v - min) / (max - min)) * 255);
}

export type AsciiOptions = {
  /** Thème clair : les zones sombres de l'image deviennent les caractères denses. */
  invert?: boolean;
  /** Variation de luminosité ajoutée à une case (survol, scintillement). */
  boost?: (x: number, y: number) => number;
};

/** Une ligne de texte par rangée de cases. */
export function lumToAscii(lum: ArrayLike<number>, cols: number, rows: number, options: AsciiOptions = {}): string {
  const { invert = false, boost } = options;
  const last = RAMP.length - 1;
  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      let v = lum[y * cols + x] + (boost ? boost(x, y) : 0);
      v = Math.min(255, Math.max(0, v));
      if (invert) v = 255 - v;
      line += RAMP[Math.round((v / 255) * last)];
    }
    lines.push(line);
  }
  return lines.join("\n");
}
