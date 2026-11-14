import type { Metadata } from "next";
import Link from "next/link";
import { AsciiPortrait } from "@/components/ascii/AsciiPortrait";
import { Typed } from "@/components/common/Typed";
import { profile } from "@/content";

export const metadata: Metadata = { title: "About me" };

// Accueil du mode classique : hero (texte à gauche, portrait ASCII à droite), puis présentation.
export default function About() {
  const [lead, ...rest] = profile.about;
  return (
    <>
      <section className="grid items-center gap-10 lg:min-h-[calc(100dvh-16rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <div>
          <p className="font-mono text-xs text-muted">
            <span aria-hidden="true" className="text-gold">$ </span>
            whoami
          </p>
          <Typed
            text={`Hello, I'm ${profile.name}`}
            className="mt-3 text-4xl leading-tight font-bold uppercase sm:text-6xl sm:leading-[1.05]"
          />
          <p className="mt-4 font-mono text-sm text-gold sm:text-base">{profile.role}</p>
          <div className="view-enter">
            <p className="mt-6 max-w-prose text-lg sm:text-xl">{profile.intro}</p>
            <p className="mt-4 max-w-prose text-muted">{lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/formations" className="btn btn-primary">
                Découvrir mon parcours
              </Link>
              <Link href="/contact" className="btn">
                Me contacter
              </Link>
            </div>
          </div>
        </div>

        <figure className="view-enter mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
          <AsciiPortrait src={profile.portrait.src} alt={profile.portrait.alt} />
          <figcaption className="mt-2 font-mono text-xs text-muted">
            <span aria-hidden="true">&gt; </span>
            {profile.portrait.src ? "portrait | ascii --cols 64" : "Portrait provisoire, en attendant la photo."}
          </figcaption>
        </figure>
      </section>

      {rest.length > 0 && (
        <section aria-label="Présentation" className="view-enter mt-16 grid gap-8 border-t border-line pt-10 sm:grid-cols-2 sm:gap-12">
          {rest.map((paragraph, i) => (
            <div key={paragraph}>
              <p aria-hidden="true" className="font-mono text-xs text-muted">
                {String(i + 1).padStart(2, "0")} /
              </p>
              <p className="mt-2 max-w-prose">{paragraph}</p>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
