import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CaptureFrame } from "@/components/classic/CaptureFrame";
import { View } from "@/components/classic/View";
import { projects } from "@/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? project.title : "Projet introuvable" };
}

// L'accès à l'adresse est isolé dans un Suspense : la page reste rapide à afficher.
export default function ProjetDetailPage({ params }: Params) {
  return (
    <Suspense fallback={null}>
      <ProjetDetail params={params} />
    </Suspense>
  );
}

async function ProjetDetail({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <View path={`projets/${project.slug}`} title={project.title} lead={project.summary}>
      <div className="view-enter">
        <div className="max-w-4xl">
          <CaptureFrame image={project.image} sizes="(min-width: 1024px) 896px, 100vw" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
          <div className="space-y-8">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-gold">Description</h2>
              <p className="mt-3 max-w-prose text-lg">{project.description}</p>
            </section>

            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-gold">Fonctionnalités</h2>
              <ul className="mt-3 max-w-prose space-y-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span aria-hidden="true" className="font-mono text-gold">
                      +
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-8">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-widest text-gold">Technologies</h2>
              <ul className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-muted">
                {project.stack.map((tech) => (
                  <li key={tech} className="border border-line px-2 py-1">
                    {tech}
                  </li>
                ))}
              </ul>
            </section>

            {(project.url || project.github) && (
              <section>
                <h2 className="font-mono text-xs uppercase tracking-widest text-gold">Liens</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Voir le projet
                      <span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn">
                      Code sur GitHub
                      <span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  )}
                </div>
              </section>
            )}
          </aside>
        </div>

        <div className="mt-14 border-t border-line pt-6">
          <Link href="/projets" className="btn">
            ← Tous les projets
          </Link>
        </div>
      </div>
    </View>
  );
}
