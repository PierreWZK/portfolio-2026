import { expect, test } from "vitest";
import { generateLandscape } from "./landscape";

const layers = (l: ReturnType<typeof generateLandscape>) => [l.sky, l.land, l.moon];

test("chaque calque fait exactement cols x rows", () => {
  for (const layer of layers(generateLandscape(80, 24))) {
    const rows = layer.split("\n");
    expect(rows).toHaveLength(24);
    expect(rows.every((r) => r.length === 80)).toBe(true);
  }
});

test("le dessin est stable et contient ciel, montagnes et lune", () => {
  const a = generateLandscape(120, 40, 1);
  expect(generateLandscape(120, 40, 1)).toEqual(a);
  expect(a.sky).toMatch(/[.·+*]/);
  expect(a.land).toMatch(/[/\\]/);
  expect(a.moon).toContain("@");
});

test("les calques ne se recouvrent jamais", () => {
  const { sky, land, moon } = generateLandscape(120, 40);
  for (let i = 0; i < sky.length; i++) {
    const used = [sky[i], land[i], moon[i]].filter((c) => c !== " " && c !== "\n");
    expect(used.length).toBeLessThanOrEqual(1);
  }
});

test("progress 0 : rien n'est encore apparu", () => {
  for (const layer of layers(generateLandscape(60, 20, 0, 0))) {
    expect(layer.trim()).toBe("");
  }
});

test("le temps ne change que les étoiles", () => {
  const a = generateLandscape(120, 40, 0);
  const b = generateLandscape(120, 40, 2.5);
  expect(b.land).toBe(a.land);
  expect(b.moon).toBe(a.moon);
  expect(b.sky).not.toBe(a.sky);
});

test("taille nulle : calques vides, pas d'erreur", () => {
  expect(generateLandscape(0, 0)).toEqual({ sky: "", land: "", moon: "" });
});
