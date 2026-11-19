import Link from "next/link";
import type { CSSProperties } from "react";
import { MotionToggle } from "@/components/common/MotionToggle";
import { profile } from "@/content";
import { creationArt } from "./creationArt";

/** Pied de page centré : « La Création d'Adam » en ASCII, puis les liens. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-10 text-center sm:px-8 sm:py-14">
        <div
          role="img"
          aria-label="La Création d'Adam de Michel-Ange, détail des deux mains qui se rejoignent, en caractères ASCII"
          className="ascii-figure max-w-3xl"
          style={{ "--cols": creationArt.cols } as CSSProperties}
        >
          <pre aria-hidden="true" data-for="dark" className="ascii-art text-left">
            {creationArt.dark}
          </pre>
          <pre aria-hidden="true" data-for="light" className="ascii-art text-left">
            {creationArt.light}
          </pre>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono text-xs text-muted">
          <a href="https://projectp.fr/" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-gold">
            30 jours, 30 projets
          </a>
          <Link href="/" className="inline-flex min-h-11 items-center uppercase tracking-widest hover:text-gold">
            Choix du mode
          </Link>
          <MotionToggle />
        </div>
        <p className="mt-2 font-mono text-xs text-muted">© 2026 {profile.brand}</p>
      </div>
    </footer>
  );
}
