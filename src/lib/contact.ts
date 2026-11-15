// Validation du formulaire de contact. Pure : utilisée par le navigateur (retour immédiat)
// et par la route serveur (qui ne fait jamais confiance au client).

export type ContactInput = { name: string; email: string; message: string; website: string };
export type ContactErrors = Partial<Record<"name" | "email" | "message", string>>;

export const LIMITS = { name: 80, email: 254, message: 4000, messageMin: 10 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Caractères de contrôle (dont retours à la ligne) : interdits dans un nom, il finirait dans un en-tête.
const CONTROL = /[\u0000-\u001f\u007f]/;

export function validateContact(raw: unknown): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const data: ContactInput = {
    name: str(r.name),
    email: str(r.email),
    message: str(r.message),
    website: str(r.website),
  };

  const errors: ContactErrors = {};
  if (data.name.length < 2) errors.name = "Indiquez votre nom (2 caractères minimum).";
  else if (data.name.length > LIMITS.name || CONTROL.test(data.name)) errors.name = `Nom trop long ou invalide (${LIMITS.name} caractères maximum).`;

  if (!data.email) errors.email = "Indiquez votre adresse e-mail.";
  else if (data.email.length > LIMITS.email || !EMAIL.test(data.email)) errors.email = "Cette adresse e-mail ne semble pas valide.";

  if (data.message.length < LIMITS.messageMin) errors.message = `Votre message est un peu court (${LIMITS.messageMin} caractères minimum).`;
  else if (data.message.length > LIMITS.message) errors.message = `Votre message dépasse ${LIMITS.message} caractères.`;

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
