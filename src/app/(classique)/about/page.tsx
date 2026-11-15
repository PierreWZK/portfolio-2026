import type { Metadata } from "next";
import Link from "next/link";
import { AsciiPortrait } from "@/components/ascii/AsciiPortrait";
import { Typed } from "@/components/common/Typed";
import { contact, profile } from "@/content";

export const metadata: Metadata = { title: "About me" };

// Accueil du mode classique. Le portrait ASCII, sans cadre, est le héros de la page :
// posé en bas à droite, il descend jusqu'au pied de page. Le texte occupe la gauche.
export default function About() {
  return (
    <section className="relative -mb-10 flex flex-col sm:-mb-16 lg:min-h-[calc(100dvh-3.5rem-4rem)]">
      <div className="relative z-10 lg:max-w-[52%]">
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
          <p className="mt-8 max-w-prose text-lg sm:text-xl">{profile.intro}</p>
          {profile.about.map((paragraph) => (
            <p key={paragraph} className="mt-4 max-w-prose text-muted">
              {paragraph}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/formations" className="btn btn-primary">
              Découvrir mon parcours
            </Link>
            <Link href="/contact" className="btn">
              Me contacter
            </Link>
          </div>

          <dl className="mt-12 space-y-3 pb-10 font-mono text-xs uppercase tracking-widest sm:pb-16">
            {profile.status && (
              <div>
                <dt className="sr-only">Situation</dt>
                <dd className="max-w-xs text-muted">{profile.status}</dd>
              </div>
            )}
            {profile.location && (
              <div>
                <dt className="sr-only">Lieu</dt>
                <dd>{profile.location}</dd>
              </div>
            )}
            <div>
              <dt className="sr-only">E-mail</dt>
              <dd className="normal-case tracking-normal">
                <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-gold">
                  {contact.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="view-enter mt-auto w-full self-end lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:w-[50%] lg:max-w-2xl">
        <AsciiPortrait src={profile.portrait.src} alt={profile.portrait.alt} />
      </div>
    </section>
  );
}
