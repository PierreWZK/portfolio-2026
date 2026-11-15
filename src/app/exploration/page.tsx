import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import Link from "next/link";
import { MotionToggle } from "@/components/common/MotionToggle";
import { ExplorationLoader } from "@/components/exploration/ExplorationLoader";

export const metadata: Metadata = { title: "Welcome to my workspace" };

// Écriture manuscrite des pages du livre 3D. Chargée seulement sur cette page.
const hand = Caveat({ variable: "--font-hand", subsets: ["latin"], weight: ["400", "700"] });

// Mode exploration : la scène 3D occupe tout l'écran, l'interface reste discrète par-dessus.
export default function Exploration() {
  return (
    <main className={`${hand.variable} relative h-dvh overflow-hidden`}>
      <ExplorationLoader />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex flex-wrap items-start justify-between gap-3 p-4 sm:p-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Mode exploration</p>
          <h1 className="mt-1 text-base font-bold uppercase sm:text-2xl">Welcome to my workspace</h1>
        </div>
        <nav aria-label="Quitter le mode exploration" className="pointer-events-auto flex flex-wrap gap-2">
          <MotionToggle className="bg-bg" />
          <Link href="/about" className="btn bg-bg">
            <span className="sm:hidden">Classique</span>
            <span className="hidden sm:inline">Mode classique</span>
          </Link>
          <Link href="/" className="btn bg-bg">
            ←<span className="sr-only sm:not-sr-only"> Choix du mode</span>
          </Link>
        </nav>
      </header>
    </main>
  );
}
