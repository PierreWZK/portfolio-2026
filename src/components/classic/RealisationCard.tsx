import Link from "next/link";
import type { Realisation } from "@/content";
import { CaptureFrame } from "./CaptureFrame";

/** Carte d'une réalisation. Toute la carte ouvre la vue détaillée. */
export function RealisationCard({ realisation }: { realisation: Realisation }) {
  return (
    <article className="card">
      <CaptureFrame image={realisation.image} />
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs text-muted">{realisation.date}</p>
        <h2 className="mt-1 text-xl font-bold">
          <Link href={`/realisations/${realisation.slug}`} className="card-link">
            {realisation.title}
            <span aria-hidden="true" className="card-arrow ml-2 inline-block">→</span>
          </Link>
        </h2>
        <p className="mt-2 text-muted">{realisation.summary}</p>
      </div>
    </article>
  );
}
