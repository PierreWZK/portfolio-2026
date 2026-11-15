"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { contact, formations, future, profile, projects, realisations, skillCategories } from "@/content";
import { BOOK_PAGES, KINDS, setBookPage, setFocus, useExploration, type Focus, type Kind } from "./scene/store";

// Interface posée par-dessus la scène 3D : barre des objets (accès clavier et tactile à tout),
// bouton de retour, et panneau de contenu de l'objet ouvert.
// Rien n'est accessible uniquement par la 3D : chaque objet s'ouvre aussi d'ici.

const LABELS: Record<Kind, { name: string; topic: string }> = {
  computer: { name: "Ordinateur", topic: "Mes projets" },
  books: { name: "Livres", topic: "Mes formations" },
  frames: { name: "Cadres", topic: "Mes réalisations" },
  postits: { name: "Post-it", topic: "Mes compétences" },
  phone: { name: "Téléphone", topic: "Me contacter" },
  clock: { name: "Horloge", topic: "Le futur" },
};

const firstOf = (kind: Kind): Focus => (kind === "books" || kind === "frames" ? { kind, index: 0 } : { kind });

/** Précédent / suivant dans une série (livres, cadres). */
function Stepper({ kind, index, count, noun }: { kind: Kind; index: number; count: number; noun: string }) {
  if (count < 2) return null;
  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <button type="button" className="btn" disabled={index === 0} onClick={() => setFocus({ kind, index: index - 1 })}>
        ← <span className="sr-only">{noun} précédent</span>
      </button>
      <span aria-live="polite">
        {noun} {index + 1} / {count}
      </span>
      <button type="button" className="btn" disabled={index === count - 1} onClick={() => setFocus({ kind, index: index + 1 })}>
        <span className="sr-only">{noun} suivant</span> →
      </button>
    </div>
  );
}

function Panel({ kind, title, children, className = "" }: { kind: Kind; title: string; children: ReactNode; className?: string }) {
  return (
    <section
      aria-label={`${LABELS[kind].name} : ${title}`}
      className={`pointer-events-auto absolute inset-x-3 bottom-24 max-h-[42dvh] overflow-y-auto border border-line bg-bg p-5 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-24 sm:max-h-[calc(100dvh-13rem)] sm:w-[24rem] ${className}`}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-gold">{LABELS[kind].name}</p>
      <h2 className="mt-1 text-xl font-bold uppercase">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FocusPanel({ focus, bookPage }: { focus: NonNullable<Focus>; bookPage: number }) {
  const index = focus.index ?? 0;
  switch (focus.kind) {
    case "computer":
      // Sur grand écran, les projets se lisent dans l'écran 3D. Ce panneau n'existe que sur petit écran,
      // où l'écran 3D serait trop petit pour être lu.
      return (
        <Panel kind="computer" title="Mes projets" className="sm:hidden">
          <ul className="space-y-4">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projets/${p.slug}`} className="font-bold underline underline-offset-4 hover:text-gold">
                  {p.title}
                </Link>
                <p className="mt-1 text-sm text-muted">{p.summary}</p>
                <p className="mt-1 font-mono text-xs text-muted">{p.stack.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Panel>
      );
    case "books": {
      const f = formations[index];
      if (!f) return null;
      // Le contenu se lit dans le livre 3D. Ici : la commande des pages, et le même texte pour les lecteurs d'écran.
      return (
        <section
          aria-label={`Livre : ${f.name}`}
          className="pointer-events-auto absolute inset-x-3 bottom-24 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          <Stepper kind="books" index={index} count={formations.length} noun="Livre" />
          <div className="flex items-center gap-2 font-mono text-xs">
            <button type="button" className="btn bg-bg" disabled={bookPage === 0} onClick={() => setBookPage(bookPage - 1)}>
              Page précédente
            </button>
            <button type="button" className="btn bg-bg" disabled={bookPage === BOOK_PAGES - 1} onClick={() => setBookPage(bookPage + 1)}>
              Page suivante
            </button>
          </div>
          <div className="sr-only" aria-live="polite">
            {bookPage === 0
              ? `${f.name}, ${f.school}, ${f.dates}.`
              : `${f.description} Compétences acquises : ${f.skills.join(", ")}.`}
          </div>
        </section>
      );
    }
    case "frames": {
      const r = realisations[index];
      if (!r) return null;
      return (
        <Panel kind="frames" title={r.title}>
          <p className="font-mono text-xs text-muted">{r.date}</p>
          <p className="mt-2">{r.summary}</p>
          {r.details.map((d) => (
            <p key={d} className="mt-3 text-sm text-muted">
              {d}
            </p>
          ))}
          <div className="mt-5">
            <Stepper kind="frames" index={index} count={realisations.length} noun="Cadre" />
          </div>
        </Panel>
      );
    }
    case "postits":
      return (
        <Panel kind="postits" title="Mes compétences">
          <ul className="grid grid-cols-2 gap-3">
            {skillCategories.map((c, i) => (
              <li
                key={c.name}
                className="p-3 text-[#2a2420]"
                style={{ background: ["#d9c28f", "#e6d7a8", "#c9b27c", "#efe2bd", "#d2bd8a"][i % 5], transform: `rotate(${(i % 3) - 1}deg)` }}
              >
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest">{c.name}</h3>
                <p className="mt-2 text-sm leading-snug">{c.skills.join(", ")}</p>
              </li>
            ))}
          </ul>
        </Panel>
      );
    case "phone":
      return (
        <Panel kind="phone" title="Me contacter" className="sm:w-[19rem] sm:rounded-[2rem] sm:border-2 sm:p-6">
          <p className="font-mono text-xs text-muted">{profile.name}</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={`mailto:${contact.email}`} className="btn w-full justify-center normal-case tracking-normal">
                {contact.email}
              </a>
            </li>
            {contact.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="btn w-full justify-center">
                  {l.label}
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
              </li>
            ))}
            <li>
              <Link href="/contact" className="btn btn-primary w-full justify-center">
                Écrire un message
              </Link>
            </li>
          </ul>
        </Panel>
      );
    case "clock":
      return (
        <Panel kind="clock" title={future.title} className="sm:w-[30rem]">
          <p className="text-lg text-muted">{future.lead}</p>
          <ol className="mt-6 space-y-6 border-l border-gold pl-5">
            {future.sections.map((s, i) => (
              <li key={s.title}>
                <p aria-hidden="true" className="font-mono text-xs text-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-bold">{s.title}</h3>
                {s.paragraphs.map((p) => (
                  <p key={p} className="mt-2 text-sm text-muted">
                    {p}
                  </p>
                ))}
              </li>
            ))}
          </ol>
        </Panel>
      );
  }
}

export function ExplorationUI() {
  const { focus, seen, bookPage, hint } = useExploration();
  const tip = useRef<HTMLParagraphElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const bar = useRef<HTMLElement>(null);
  const last = useRef<Kind | null>(null);

  // L'étiquette de l'objet survolé suit le pointeur.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (tip.current) tip.current.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 16}px)`;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Échap revient toujours au bureau.
  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocus(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus]);

  // Le focus clavier suit : vers « Retour au bureau » à l'ouverture, vers le bouton de l'objet à la fermeture.
  const kind = focus?.kind ?? null;
  useEffect(() => {
    if (kind) {
      last.current = kind;
      back.current?.focus({ preventScroll: true });
    } else if (last.current) {
      bar.current?.querySelector<HTMLButtonElement>(`[data-kind="${last.current}"]`)?.focus({ preventScroll: true });
    }
  }, [kind]);

  return (
    <>
      <p
        ref={tip}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap border border-gold bg-bg px-2 py-1 font-mono text-[11px] uppercase tracking-widest text-gold ${hint && !focus ? "" : "hidden"}`}
      >
        {hint}
      </p>
      {focus && (
        <>
          <button
            ref={back}
            type="button"
            onClick={() => setFocus(null)}
            className="btn btn-primary pointer-events-auto absolute left-4 top-44 sm:left-6 sm:top-24"
          >
            ← Retour au bureau
          </button>
          <FocusPanel focus={focus} bookPage={bookPage} />
        </>
      )}

      <nav
        ref={bar}
        aria-label="Objets du bureau"
        className="pointer-events-auto absolute inset-x-0 bottom-3 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] items-center gap-1 overflow-x-auto border border-line bg-bg p-1"
      >
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            data-kind={k}
            aria-pressed={focus?.kind === k}
            title={LABELS[k].topic}
            onClick={() => setFocus(focus?.kind === k ? null : firstOf(k))}
            className={`min-h-11 shrink-0 whitespace-nowrap px-3 font-mono text-xs uppercase tracking-widest hover:text-gold ${focus?.kind === k ? "text-gold" : "text-muted"}`}
          >
            <span aria-hidden="true">{seen.includes(k) ? "■ " : "□ "}</span>
            {LABELS[k].name}
            <span className="sr-only">
              {" "}
              : {LABELS[k].topic}
              {seen.includes(k) ? " (déjà vu)" : ""}
            </span>
          </button>
        ))}
        <p className="shrink-0 px-3 font-mono text-xs text-muted" aria-live="polite">
          {seen.length}/{KINDS.length}
          <span className="sr-only"> objets découverts</span>
        </p>
      </nav>
    </>
  );
}
