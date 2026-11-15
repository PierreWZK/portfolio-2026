import Link from "next/link";
import type { Project } from "@/content";
import { CaptureFrame } from "./CaptureFrame";

/** Carte d'un projet. Toute la carte est cliquable grâce au lien de titre (overlay). */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card">
      <CaptureFrame image={project.image} />
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs text-muted">{project.year}</p>
        <h2 className="mt-1 text-xl font-bold">
          <Link href={`/projets/${project.slug}`} className="card-link">
            {project.title}
            <span aria-hidden="true" className="card-arrow ml-2 inline-block">→</span>
          </Link>
        </h2>
        <p className="mt-2 text-muted">{project.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-4 font-mono text-xs text-muted">
          {project.stack.map((tech) => (
            <li key={tech} className="border border-line px-2 py-0.5">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
