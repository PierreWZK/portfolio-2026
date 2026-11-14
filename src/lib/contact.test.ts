import { expect, test } from "vitest";
import { validateContact } from "./contact";

const valid = { name: "Ada", email: "ada@example.com", message: "Bonjour, j'aimerais discuter d'un projet." };

test("un message valide passe et les champs sont nettoyés", () => {
  const r = validateContact({ ...valid, name: "  Ada  " });
  expect(r.ok).toBe(true);
  if (r.ok) expect(r.data.name).toBe("Ada");
});

test("chaque champ vide donne une erreur sur ce champ seulement", () => {
  const r = validateContact({ name: "", email: "", message: "" });
  expect(r.ok).toBe(false);
  if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "message", "name"]);
});

test("e-mail : format refusé, longueur refusée", () => {
  for (const email of ["ada", "ada@", "ada@x", "a b@example.com"]) {
    const r = validateContact({ ...valid, email });
    expect(r.ok, email).toBe(false);
  }
  expect(validateContact({ ...valid, email: `${"a".repeat(250)}@x.fr` }).ok).toBe(false);
});

test("nom : retour à la ligne interdit (injection d'en-tête)", () => {
  const r = validateContact({ ...valid, name: "Ada\r\nBcc: spam@example.com" });
  expect(r.ok).toBe(false);
  if (!r.ok) expect(r.errors.name).toBeDefined();
});

test("message : trop court et trop long", () => {
  expect(validateContact({ ...valid, message: "court" }).ok).toBe(false);
  expect(validateContact({ ...valid, message: "x".repeat(4001) }).ok).toBe(false);
});

test("entrée qui n'est pas un objet : erreurs, pas de plantage", () => {
  expect(validateContact(null).ok).toBe(false);
  expect(validateContact("texte").ok).toBe(false);
});

test("le champ piège (website) est lu à part", () => {
  const r = validateContact({ ...valid, website: "http://spam.example" });
  expect(r.ok).toBe(true);
  if (r.ok) expect(r.data.website).toBe("http://spam.example");
});
