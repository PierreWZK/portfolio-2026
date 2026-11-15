import { Html } from "@react-three/drei";
import { useState } from "react";
import { projects } from "@/content";
import { htmlLayer } from "./layout";
import { useExploration } from "./store";

// Interface posée dans l'écran de l'ordinateur, dans la scène (pas en plein écran).
// Au repos : un message d'accueil, qui laisse passer les clics vers l'ordinateur.
// Ordinateur ouvert : l'écran « s'allume » sur la liste des projets.
const W = 520;
const H = 310;
// Html transform : 1 px = 1/40 d'unité. L'écran fait 0,94 m de large.
const SCALE = 0.94 / (W / 40);

export function ComputerScreen() {
  const [index, setIndex] = useState(0);
  const { focus, seen } = useExploration();
  const open = focus?.kind === "computer";
  const project = projects[index];

  return (
    <Html
      transform
      portal={htmlLayer as React.RefObject<HTMLElement>}
      position={[0, 1.29, -2.576]}
      scale={SCALE}
      zIndexRange={[20, 0]}
      pointerEvents={open ? "auto" : "none"}
    >
      <div
        className="flex h-full w-full flex-col overflow-hidden p-4 font-mono text-[12px] leading-snug"
        style={{ width: W, height: H, background: "#0c0c0e", color: "#edeae3" }}
      >
        {!open ? (
          <div aria-hidden="true" className="flex h-full flex-col justify-center">
            <p className="text-[22px] font-bold leading-tight" style={{ color: "#d9c28f" }}>
              &gt; WELCOME TO
              <br />
              &nbsp;&nbsp;MY WORKSPACE_
            </p>
            <p className="mt-4" style={{ color: "#a09c92" }}>
              $ ls ~/projets
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "#2b2b30", color: "#a09c92" }}>
              <span>~/projets</span>
              <span>
                {seen.length}/6 découvertes
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Choisir un projet">
              {projects.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                  className="border px-2 py-1 text-[11px]"
                  style={i === index ? { borderColor: "#d9c28f", color: "#d9c28f" } : { borderColor: "#2b2b30", color: "#a09c92" }}
                >
                  {p.title}
                </button>
              ))}
            </div>

            <div className="mt-3 flex-1 overflow-hidden" aria-live="polite">
              <p className="text-[10px] uppercase tracking-widest" style={{ color: "#d9c28f" }}>
                {project.year} · {project.stack.join(" · ")}
              </p>
              <h2 className="mt-1 text-[17px] font-bold">{project.title}</h2>
              <p className="mt-1.5" style={{ color: "#a09c92" }}>
                {project.description}
              </p>
            </div>

            <div className="mt-2 flex gap-4 border-t pt-2 text-[11px]" style={{ borderColor: "#2b2b30" }}>
              <a href={`/projets/${project.slug}`} className="underline underline-offset-4">
                Fiche complète
              </a>
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  Voir le projet<span className="sr-only"> (nouvel onglet)</span>
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  GitHub<span className="sr-only"> (nouvel onglet)</span>
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </Html>
  );
}
