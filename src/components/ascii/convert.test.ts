import { expect, test } from "vitest";
import { cellsToAscii, normalize, RAMP, rgbaToCells } from "./convert";

const first = RAMP[0];
const last = RAMP[RAMP.length - 1];
const cells = (lum: number[], mask?: number[]) => ({
  lum: new Float32Array(lum),
  mask: new Uint8Array(mask ?? lum.map(() => 1)),
});

test("rgbaToCells : luminosité, et masque selon l'opacité", () => {
  const c = rgbaToCells([0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 0, 10, 10, 10, 127]);
  expect([...c.lum].map(Math.round)).toEqual([0, 255, 255, 10]);
  expect([...c.mask]).toEqual([1, 1, 0, 0]);
});

test("rgbaToCells : le vert pèse plus que le bleu", () => {
  const { lum } = rgbaToCells([0, 255, 0, 255, 0, 0, 255, 255]);
  expect(lum[0]).toBeGreaterThan(lum[1]);
});

test("normalize étire le sujet sur 0..255 sans regarder le fond", () => {
  const out = normalize(cells([100, 150, 200, 0], [1, 1, 1, 0]));
  expect([...out.lum].slice(0, 3)).toEqual([0, 127.5, 255]);
  expect([...normalize(cells([80, 80])).lum]).toEqual([80, 80]);
});

test("cellsToAscii : dimensions, fond vide, sujet jamais vide", () => {
  const out = cellsToAscii(cells([0, 255, 255, 0, 128, 128], [1, 1, 0, 0, 1, 1]), 2, 3);
  const lines = out.split("\n");
  expect(lines).toHaveLength(3);
  expect(lines.every((l) => l.length === 2)).toBe(true);
  expect(lines[0]).toBe(first + last);
  expect(lines[1]).toBe("  ");
  expect(lines[2]).not.toContain(" ");
});

test("cellsToAscii : invert retourne la rampe (thème clair)", () => {
  expect(cellsToAscii(cells([0, 255]), 2, 1, { invert: true })).toBe(last + first);
});

test("cellsToAscii : boost décale la case visée, jamais le fond", () => {
  const boost = () => 1000;
  expect(cellsToAscii(cells([0, 0], [1, 0]), 2, 1, { boost })).toBe(`${last} `);
});
