import { expect, test } from "vitest";
import { lumToAscii, normalize, RAMP, rgbaToLum } from "./convert";

test("rgbaToLum : noir, blanc, transparent", () => {
  const lum = rgbaToLum([0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 0]);
  expect([...lum].map(Math.round)).toEqual([0, 255, 0]);
});

test("rgbaToLum : le vert pèse plus que le bleu", () => {
  const [green, blue] = rgbaToLum([0, 255, 0, 255, 0, 0, 255, 255]);
  expect(green).toBeGreaterThan(blue);
});

test("normalize étire sur 0..255 et laisse un aplat intact", () => {
  expect([...normalize(new Float32Array([100, 150, 200]))]).toEqual([0, 127.5, 255]);
  expect([...normalize(new Float32Array([80, 80]))]).toEqual([80, 80]);
});

test("lumToAscii : dimensions et extrêmes de la rampe", () => {
  const out = lumToAscii([0, 255, 255, 0, 128, 128], 2, 3);
  const lines = out.split("\n");
  expect(lines).toHaveLength(3);
  expect(lines.every((l) => l.length === 2)).toBe(true);
  expect(lines[0]).toBe(RAMP[0] + RAMP[RAMP.length - 1]);
});

test("lumToAscii : invert retourne la rampe (thème clair)", () => {
  expect(lumToAscii([0, 255], 2, 1, { invert: true })).toBe("@ ");
});

test("lumToAscii : boost décale la case visée, borné à la rampe", () => {
  const boost = (x: number) => (x === 0 ? 1000 : 0);
  expect(lumToAscii([0, 0], 2, 1, { boost })).toBe("@ ");
});
