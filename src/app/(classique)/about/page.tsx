import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AsciiPortrait } from "@/components/ascii/AsciiPortrait";
import { CaptureFrame } from "@/components/classic/CaptureFrame";
import { RealisationCard } from "@/components/classic/RealisationCard";
import { Typed } from "@/components/common/Typed";
import {
  certifications,
  contact,
  deskBooks,
  experiences,
  profile,
  projects,
  realisations,
  skillCategories,
} from "@/content";

export const metadata: Metadata = { title: "About me" };

/** Titre de section façon terminal : commande en petit, titre, lien facultatif vers la page complète. */
function Section({
  id,
  cmd,
  title,
  more,
  children,
}: {
  id: string;
  cmd: string;
  title: string;
  more?: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-14 sm:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <div>
          <p className="font-mono text-xs text-muted">
            <span aria-hidden="true" className="text-gold">$ </span>
            {cmd}
          </p>
          <h2 id={id} className="mt-2 text-2xl font-bold uppercase sm:text-4xl">
            {title}
          </h2>
        </div>
        {more && (
          <Link href={more.href} className="font-mono text-xs uppercase tracking-widest underline underline-offset-4 hover:text-gold">
            {more.label} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      {/* data-reveal : le contenu se trace ligne à ligne en entrant à l'écran (ScrollFx). */}
      <div data-reveal>{children}</div>
    </section>
  );
}

// Accueil du mode classique : un hero sobre (nom, titre, actions, coordonnées, portrait ASCII),
// puis un aperçu de tout le reste : poste, projet phare, certifications, présentation,
// compétences, réalisations, lectures. Tout vient de src/content.
export default function About() {
  const [job, ...previous] = experiences;
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const facts = [
    profile.status && { label: "Statut", value: profile.status },
    profile.location && { label: "Lieu", value: profile.location },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <>
      {/* Hero */}
      <section className="grid items-end gap-x-10 lg:min-h-[calc(100dvh-3.5rem-8rem)] lg:grid-cols-[1.15fr_1fr]">
        <div className="self-center pb-12 lg:pb-16">
          <p className="font-mono text-xs text-muted">
            <span aria-hidden="true" className="text-gold">$ </span>
            whoami
          </p>
          <Typed
            text={`Hello, I'm ${profile.name}`}
            className="mt-3 text-4xl leading-none font-bold uppercase sm:text-6xl sm:leading-none xl:text-7xl xl:leading-none"
          />
          <p className="mt-5 font-mono text-sm uppercase tracking-widest text-gold">{profile.role}</p>

          <div className="view-enter">
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/formations" className="btn btn-primary">
                Découvrir mon parcours
              </Link>
              <Link href="/contact" className="btn">
                Me contacter
              </Link>
            </div>

            <dl className="mt-12 grid max-w-2xl gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">{fact.label}</dt>
                  <dd className="mt-1 text-sm">{fact.value}</dd>
                </div>
              ))}
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">E-mail</dt>
                <dd className="mt-1 text-sm [overflow-wrap:anywhere]">
                  <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-gold">
                    {contact.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="view-enter mx-auto w-full max-w-xl self-end lg:max-w-none">
          <AsciiPortrait src={profile.portrait.src} alt={profile.portrait.alt} />
        </div>
      </section>

      {/* Poste actuel, ou dernier poste */}
      {job && (
        <Section id="poste" cmd="cat poste.txt" title={job.current ? "Poste actuel" : "Dernier poste"} more={{ href: "/realisations", label: "Mes réalisations" }}>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <article className="border border-line bg-surface p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-gold">
                {job.dates}
                {job.place && ` · ${job.place}`}
              </p>
              <h3 className="mt-2 text-xl font-bold sm:text-2xl">
                {job.role} <span className="text-muted">chez</span> {job.company}
              </h3>
              <p className="mt-4 max-w-prose text-muted">{job.summary}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden="true" className="font-mono text-gold">+</span>
                    {h}
                  </li>
                ))}
              </ul>
            </article>

            {previous.length > 0 && (
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted">Avant</h3>
                <ol className="mt-4 space-y-6 border-l border-line pl-5">
                  {previous.map((xp) => (
                    <li key={`${xp.company}-${xp.dates}`}>
                      <p className="font-mono text-xs text-muted">{xp.dates}</p>
                      <p className="mt-1 font-bold">
                        {xp.role} · {xp.company}
                      </p>
                      <p className="mt-1 text-sm text-muted">{xp.summary}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Projet phare */}
      {featured && (
        <Section id="projet-phare" cmd="open ~/projets --phare" title="Mon plus gros projet" more={{ href: "/projets", label: "Tous mes projets" }}>
          <article className="grid overflow-hidden border border-line bg-surface lg:grid-cols-2">
            {/* Sur grand écran, la capture remplit toute la hauteur de la carte. */}
            <div className="lg:border-r lg:border-line lg:[&>div]:h-full lg:[&>div]:min-h-80 lg:[&>div]:aspect-auto lg:[&>div]:border-b-0">
              <CaptureFrame image={featured.image} sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="font-mono text-xs text-muted">{featured.year}</p>
              <h3 className="mt-1 text-2xl font-bold sm:text-3xl">{featured.title}</h3>
              <p className="mt-3 text-lg">{featured.summary}</p>
              <p className="mt-3 text-muted">{featured.description}</p>
              <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                {featured.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden="true" className="font-mono text-gold">+</span>
                    {f}
                  </li>
                ))}
              </ul>
              <ul aria-label="Technologies" className="mt-6 flex flex-wrap gap-2 font-mono text-xs text-muted">
                {featured.stack.map((tech) => (
                  <li key={tech} className="border border-line px-2 py-0.5">
                    {tech}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/projets/${featured.slug}`} className="btn btn-primary">
                  Lire l&apos;étude de cas
                </Link>
                {featured.url && (
                  <a href={featured.url} target="_blank" rel="noopener noreferrer" className="btn">
                    Voir le site<span className="sr-only"> (nouvel onglet)</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section id="certifications" cmd="ls ~/certifications" title="Certifications" more={{ href: "/formations", label: "Mes formations" }}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((c) => (
              <li key={c.name} className="flex flex-col border border-line p-5">
                <p className="font-mono text-xs text-gold">{c.date}</p>
                <p className="mt-2 font-bold">
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-gold">
                      {c.name}
                      <span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  ) : (
                    c.name
                  )}
                </p>
                <p className="mt-auto pt-3 text-sm text-muted">{c.issuer}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Présentation */}
      <Section id="presentation" cmd="cat a-propos.md" title="En quelques mots">
        <div className="grid gap-8 lg:grid-cols-2">
          <p className="text-xl sm:text-2xl">{profile.intro}</p>
          <div className="space-y-4 text-muted">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      {/* Compétences clés */}
      <Section id="competences" cmd="which --all" title="Ma boîte à outils" more={{ href: "/competences", label: "Toutes mes compétences" }}>
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.slice(0, 3).map((cat) => (
            <div key={cat.name}>
              <dt className="font-mono text-xs uppercase tracking-widest text-gold">{cat.name}</dt>
              <dd>
                <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                  {cat.skills.map((s) => (
                    <li key={s} className="border border-line px-2.5 py-1">
                      {s}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Dernières réalisations */}
      {realisations.length > 0 && (
        <Section id="realisations" cmd="ls -t ~/realisations | head -2" title="Dernières réalisations" more={{ href: "/realisations", label: "Toutes mes réalisations" }}>
          <ul className="grid gap-6 sm:grid-cols-2">
            {realisations.slice(0, 2).map((r) => (
              <li key={r.slug} className="flex">
                <RealisationCard realisation={r} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Lectures du moment (les mêmes livres que sur le bureau 3D) */}
      {deskBooks.length > 0 && (
        <Section id="lectures" cmd="ls ~/bureau/livres" title="Sur mon bureau en ce moment">
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {deskBooks.map((b) => (
              <li key={b.title} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                <span className="font-bold">{b.title}</span>
                {b.author && <span className="shrink-0 text-sm text-muted">{b.author}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Appel final */}
      <section aria-labelledby="contact-final" className="border-t border-line pt-14 sm:pt-20">
        <h2 id="contact-final" className="max-w-2xl text-2xl font-bold uppercase sm:text-4xl">
          Un projet, une question ?
        </h2>
        <p className="mt-3 max-w-prose text-muted">{profile.status ?? "Je réponds à tous les messages."}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-primary">
            Me contacter
          </Link>
          <a href={`mailto:${contact.email}`} className="btn normal-case tracking-normal">
            {contact.email}
          </a>
        </div>
      </section>
    </>
  );
}
