import type { Metadata } from "next";
import Link from "next/link";
import { future } from "@/content";

export const metadata: Metadata = { title: "Le futur" };

// Page éditoriale : mise en page d'article ou de manifeste, même direction artistique.
export default function Futur() {
  return (
    <article className="mx-auto w-full max-w-2xl">
      <header className="border-b border-line pb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          <span aria-hidden="true" className="text-gold">{"// "}</span>
          Manifeste personnel
        </p>
        <h1 className="mt-4 text-4xl font-bold uppercase leading-tight sm:text-6xl">{future.title}</h1>
        <p className="mt-6 text-xl leading-relaxed text-muted sm:text-2xl">{future.lead}</p>
      </header>

      <div className="mt-12 space-y-16">
        {future.sections.map((section, i) => (
          <section key={section.title} aria-labelledby={`futur-${i}`} className="grid gap-4 sm:grid-cols-[4rem_minmax(0,1fr)]">
            <p aria-hidden="true" className="font-mono text-sm text-gold">
              {String(i + 1).padStart(2, "0")}
            </p>
            <div>
              <h2 id={`futur-${i}`} className="text-2xl font-bold leading-snug sm:text-3xl">
                {section.title}
              </h2>
              <div className="mt-5 space-y-5 text-lg leading-relaxed">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-16 border-t border-line pt-8">
        <p className="font-mono text-sm text-muted">Fin du manifeste, pour l&apos;instant. Il bougera avec moi.</p>
        <Link href="/contact" className="btn mt-6">
          Discutons-en
        </Link>
      </footer>
    </article>
  );
}
