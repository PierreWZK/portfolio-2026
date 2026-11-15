// Détoure un portrait pris sur fond de ciel ou de mur clair : le fond devient transparent.
// Usage : node scripts/cutout.mjs <photo> <sortie.png>
//
// Méthode : on part des bords haut, gauche et droit, et on efface de proche en proche
// tout ce qui ressemble au fond (clair, neutre ou bleuté). Les zones du même ton enfermées
// dans le sujet (verres de lunettes) ne sont pas atteintes, donc conservées.
// shortcut: réglé pour un fond neutre ou bleu derrière un sujet aux tons chauds ou sombres ;
// pour une autre photo, fournir directement un PNG à fond transparent.
import sharp from "sharp";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage : node scripts/cutout.mjs <photo> <sortie.png>");
  process.exit(1);
}

const WIDTH = 900;
const { data, info } = await sharp(input).resize({ width: WIDTH }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

const isBackground = (i) => {
  const r = data[i * 3];
  const g = data[i * 3 + 1];
  const b = data[i * 3 + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 95 && b - r > -4;
};

// Le remplissage ne passe que par les zones de fond larges d'au moins 2 x GAP + 1 pixels :
// un trou étroit dans une monture de lunettes ne laisse donc pas fuir le fond vers les verres.
const GAP = 4;
const bg = new Uint8Array(width * height);
for (let i = 0; i < bg.length; i++) bg[i] = isBackground(i) ? 1 : 0;

// Érosion (min) ou dilatation (max) par une fenêtre carrée, en deux passes.
const morph = (src, pick) => {
  const tmp = new Uint8Array(src.length);
  const out = new Uint8Array(src.length);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      let v = src[y * width + x];
      for (let d = -GAP; d <= GAP; d++) {
        const xx = Math.min(width - 1, Math.max(0, x + d));
        v = pick(v, src[y * width + xx]);
      }
      tmp[y * width + x] = v;
    }
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      let v = tmp[y * width + x];
      for (let d = -GAP; d <= GAP; d++) {
        const yy = Math.min(height - 1, Math.max(0, y + d));
        v = pick(v, tmp[yy * width + x]);
      }
      out[y * width + x] = v;
    }
  return out;
};
const wide = morph(bg, Math.min);

// Remplissage depuis les bords haut, gauche et droit (pas celui du bas : le sujet y touche).
const reached = new Uint8Array(width * height);
const stack = [];
const push = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const i = y * width + x;
  if (reached[i] || !wide[i]) return;
  reached[i] = 1;
  stack.push(i);
};
for (let x = 0; x < width; x++) push(x, 0);
for (let y = 0; y < height; y++) {
  push(0, y);
  push(width - 1, y);
}
while (stack.length) {
  const i = stack.pop();
  const x = i % width;
  const y = (i - x) / width;
  push(x + 1, y);
  push(x - 1, y);
  push(x, y + 1);
  push(x, y - 1);
}
// On rend au fond la bande rognée par l'érosion, sans jamais mordre sur le sujet.
const grown = morph(reached, Math.max);
const removed = new Uint8Array(width * height);
for (let i = 0; i < removed.length; i++) removed[i] = grown[i] && bg[i] ? 1 : 0;

// Lissage : un pixel suit la majorité de ses voisins (retire les miettes sur le contour).
const smooth = new Uint8Array(removed);
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) n += removed[(y + dy) * width + x + dx];
    smooth[y * width + x] = n >= 5 ? 1 : 0;
  }
}

// Cadre serré sur le sujet.
let top = height;
let left = width;
let right = 0;
for (let i = 0; i < smooth.length; i++) {
  if (smooth[i]) continue;
  const x = i % width;
  const y = (i - x) / width;
  if (y < top) top = y;
  if (x < left) left = x;
  if (x > right) right = x;
}

const rgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  rgba[i * 4] = data[i * 3];
  rgba[i * 4 + 1] = data[i * 3 + 1];
  rgba[i * 4 + 2] = data[i * 3 + 2];
  rgba[i * 4 + 3] = smooth[i] ? 0 : 255;
}
await sharp(rgba, { raw: { width, height, channels: 4 } })
  .extract({ left, top, width: right - left + 1, height: height - top })
  .png({ compressionLevel: 9 })
  .toFile(output);

const kept = smooth.reduce((n, v) => n + (v ? 0 : 1), 0);
console.log(`${output} : ${right - left + 1}x${height - top}, sujet = ${Math.round((kept / smooth.length) * 100)} % de l'image`);
