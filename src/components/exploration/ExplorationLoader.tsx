"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSyncExternalStore } from "react";

// La scène (Three.js) n'est téléchargée qu'ici, jamais sur l'accueil ni dans le mode classique.
const Workspace = dynamic(() => import("./scene/Workspace"), {
  ssr: false,
  loading: () => <Status>Chargement du bureau…</Status>,
});

function Status({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="absolute inset-0 flex items-center justify-center font-mono text-sm text-muted">
      {children}
    </p>
  );
}

let webgl: boolean | undefined;
function hasWebGL(): boolean {
  if (webgl === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}
const noop = () => () => {};

/** Charge la scène 3D si le navigateur sait l'afficher ; sinon renvoie vers le mode classique. */
export function ExplorationLoader() {
  // Côté serveur et pendant l'hydratation : « inconnu » (null), puis la vraie réponse.
  const supported = useSyncExternalStore<boolean | null>(noop, hasWebGL, () => null);

  if (supported === null) return <Status>Chargement du bureau…</Status>;
  if (!supported) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="max-w-prose text-lg">
          Votre navigateur ne peut pas afficher la scène 3D (WebGL indisponible).
        </p>
        <p className="mt-2 max-w-prose text-muted">Tout le contenu est disponible dans le mode classique.</p>
        <Link href="/about" className="btn btn-primary mt-6">
          Ouvrir le mode classique
        </Link>
      </div>
    );
  }
  return (
    <>
      <Workspace />
      {/* Consigne affichée seulement quand la scène existe. */}
      <p className="pointer-events-none absolute bottom-16 left-4 right-4 max-w-md bg-bg/80 px-3 py-2 font-mono text-xs text-muted sm:bottom-6 sm:left-6 sm:right-auto">
        Glisser pour tourner, molette ou pincement pour zoomer. Les objets ne sont pas encore interactifs : tout le
        contenu est dans le mode classique.
      </p>
    </>
  );
}
