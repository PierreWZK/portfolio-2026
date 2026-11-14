"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { contact } from "@/content";
import { LIMITS, validateContact, type ContactErrors } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error" | "unavailable";

/** Formulaire de contact. Les erreurs sont annoncées (résumé + aria-describedby), jamais seulement en couleur. */
export function ContactForm() {
  const id = useId();
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const summary = useRef<HTMLDivElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = validateContact(Object.fromEntries(form));
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("error");
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (res.ok) {
        setStatus("sent");
        event.currentTarget.reset();
      } else if (res.status === 503) {
        setStatus("unavailable");
      } else if (res.status === 422) {
        const body = (await res.json()) as { errors?: ContactErrors };
        setErrors(body.errors ?? {});
        setStatus("error");
        requestAnimationFrame(() => summary.current?.focus());
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("unavailable");
    }
  }

  const invalid = (field: keyof ContactErrors) => (errors[field] ? true : undefined);
  const describe = (field: keyof ContactErrors) => (errors[field] ? `${id}-${field}-err` : undefined);
  const errorList = Object.entries(errors) as [keyof ContactErrors, string][];

  return (
    <form noValidate onSubmit={onSubmit} className="max-w-xl space-y-6" aria-describedby={`${id}-help`}>
      <p id={`${id}-help`} className="text-sm text-muted">
        Les champs marqués d&apos;un astérisque (*) sont obligatoires.
      </p>

      {errorList.length > 0 && (
        <div ref={summary} tabIndex={-1} role="alert" className="border border-gold p-4 outline-none">
          <p className="font-bold">Corrigez les points suivants :</p>
          <ul className="mt-2 list-inside list-disc">
            {errorList.map(([field, message]) => (
              <li key={field}>
                <a href={`#${id}-${field}`} className="underline underline-offset-4">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor={`${id}-name`} className="block font-mono text-xs uppercase tracking-widest">
          Nom <span aria-hidden="true" className="text-gold">*</span>
        </label>
        <input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          required
          maxLength={LIMITS.name}
          aria-invalid={invalid("name")}
          aria-describedby={describe("name")}
          className="field mt-2"
        />
        {errors.name && (
          <p id={`${id}-name-err`} className="mt-2 text-sm">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="block font-mono text-xs uppercase tracking-widest">
          E-mail <span aria-hidden="true" className="text-gold">*</span>
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={LIMITS.email}
          aria-invalid={invalid("email")}
          aria-describedby={describe("email")}
          className="field mt-2"
        />
        {errors.email && (
          <p id={`${id}-email-err`} className="mt-2 text-sm">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="block font-mono text-xs uppercase tracking-widest">
          Message <span aria-hidden="true" className="text-gold">*</span>
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={6}
          required
          maxLength={LIMITS.message}
          aria-invalid={invalid("message")}
          aria-describedby={`${id}-message-help ${describe("message") ?? ""}`.trim()}
          className="field mt-2"
        />
        <p id={`${id}-message-help`} className="mt-1 text-xs text-muted">
          {LIMITS.messageMin} caractères minimum, {LIMITS.message} maximum.
        </p>
        {errors.message && (
          <p id={`${id}-message-err`} className="mt-2 text-sm">
            {errors.message}
          </p>
        )}
      </div>

      {/* Champ piège pour les robots : caché aux personnes, il doit rester vide. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Site web (laisser vide)</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
          {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
        </button>
      </div>

      <div role="status" aria-live="polite" className="text-sm">
        {status === "sent" && <p>Merci, votre message est parti. Je vous répondrai dès que possible.</p>}
        {status === "unavailable" && (
          <p>
            L&apos;envoi depuis ce formulaire n&apos;est pas disponible pour le moment. Vous pouvez m&apos;écrire
            directement à{" "}
            <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-gold">
              {contact.email}
            </a>
            .
          </p>
        )}
        {status === "error" && errorList.length === 0 && (
          <p>Une erreur est survenue. Réessayez, ou écrivez-moi directement à {contact.email}.</p>
        )}
      </div>
    </form>
  );
}
