import type { Metadata } from "next";
import Link from "next/link";
import { MotionToggle } from "@/components/common/MotionToggle";
import { ExplorationLoader } from "@/components/exploration/ExplorationLoader";

export const metadata: Metadata = { title: "Welcome to my workspace" };

// Mode exploration : la scène 3D occupe tout l'écran, l'interface reste discrète par-dessus.
// Les objets ne sont pas encore interactifs : la page le dit, sans faux bouton.
export default function Exploration() {
  return (
    <main className="relative h-dvh overflow-hidden">
      <ExplorationLoader />

      <header className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 p-4 sm:p-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Mode exploration</p>
          <h1 className="mt-1 text-lg font-bold uppercase sm:text-2xl">Welcome to my workspace</h1>
        </div>
        <nav aria-label="Quitter le mode exploration" className="pointer-events-auto flex flex-wrap gap-2">
          <Link href="/about" className="btn bg-bg">
            Mode classique
          </Link>
          <Link href="/" className="btn bg-bg">
            ← Choix du mode
          </Link>
        </nav>
      </header>

      <footer className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end p-4 sm:p-6">
        <MotionToggle className="pointer-events-auto bg-bg" />
      </footer>
    </main>
  );
}
