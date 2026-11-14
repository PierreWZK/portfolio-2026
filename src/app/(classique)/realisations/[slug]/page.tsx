import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CaptureFrame } from "@/components/classic/CaptureFrame";
import { View } from "@/components/classic/View";
import { realisations } from "@/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return realisations.map((realisation) => ({ slug: realisation.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const realisation = realisations.find((r) => r.slug === slug);
  return { title: realisation ? realisation.title : "Réalisation introuvable" };
}

// L'accès à l'adresse est isolé dans un Suspense : la page reste rapide à afficher.
export default function RealisationDetailPage({ params }: Params) {
  return (
    <Suspense fallback={null}>
      <RealisationDetail params={params} />
    </Suspense>
  );
}

async function RealisationDetail({ params }: Params) {
  const { slug } = await params;
  const realisation = realisations.find((r) => r.slug === slug);
  if (!realisation) notFound();

  return (
    <View path={`realisations/${realisation.slug}`} title={realisation.title} lead={realisation.summary}>
      <div className="view-enter">
        <div className="max-w-4xl">
          <CaptureFrame image={realisation.image} sizes="(min-width: 1024px) 896px, 100vw" />
        </div>

        <div className="mt-10 max-w-prose space-y-4 text-lg">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">{realisation.date}</p>
          {realisation.details.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {realisation.url && (
          <div className="mt-8">
            <a href={realisation.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Voir la réalisation
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          </div>
        )}

        <div className="mt-14 border-t border-line pt-6">
          <Link href="/realisations" className="btn">
            ← Toutes les réalisations
          </Link>
        </div>
      </div>
    </View>
  );
}
