// Convertit une image sur fond uni en dessin ASCII fixe, écrit dans un module TypeScript.
// Usage : node --experimental-strip-types scripts/ascii-art.mjs <image> <sortie.ts> <nom> [colonnes]
// Le fond (couleur du coin haut gauche, à une tolérance près) reste vide.
// Deux versions sont produites : encre sombre pour le thème clair, encre claire pour le thème sombre.
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import { cellsToAscii, normalize, rgbaToCells } from "../src/components/ascii/convert.ts";

const [input, output, name, colsArg] = process.argv.slice(2);
if (!input || !output || !name) {
  console.error("Usage : node --experimental-strip-types scripts/ascii-art.mjs <image> <sortie.ts> <nom> [colonnes]");
  process.exit(1);
}
const cols = Number(colsArg ?? 120);
const TOLERANCE = 26;

const meta = await sharp(input).metadata();
const rows = Math.round((cols * 0.6 * meta.height) / meta.width);
const { data } = await sharp(input).resize(cols, rows, { fit: "fill" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const [br, bg, bb] = data;
for (let i = 0; i < data.length; i += 4) {
  const d = Math.hypot(data[i] - br, data[i + 1] - bg, data[i + 2] - bb);
  if (d < TOLERANCE) data[i + 3] = 0;
}
const cells = normalize(rgbaToCells(data));
// Espaces de fin de ligne et lignes vides du haut et du bas retirés.
const trim = (art) =>
  art
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
const dark = trim(cellsToAscii(cells, cols, rows));
const light = trim(cellsToAscii(cells, cols, rows, { invert: true }));

writeFileSync(
  output,
  `// Fichier généré par scripts/ascii-art.mjs : ne pas modifier à la main.\n` +
    `export const ${name} = {\n  cols: ${cols},\n  rows: ${dark.split("\n").length},\n  dark: ${JSON.stringify(dark)},\n  light: ${JSON.stringify(light)},\n};\n`,
);
console.log(`${output} : ${cols} x ${rows}`);
console.log(light);
