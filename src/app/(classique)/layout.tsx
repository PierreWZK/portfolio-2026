import Link from "next/link";
import { Header } from "@/components/classic/Header";
import { MotionToggle } from "@/components/common/MotionToggle";
import { profile } from "@/content";

// Mise en page commune aux sept vues du mode classique.
export default function ClassicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header brand={profile.name} />
      <main id="contenu" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 outline-none sm:px-8 sm:py-16">
        {children}
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3 font-mono text-xs text-muted sm:px-8">
          <p>Contenu fictif temporaire.</p>
          <a href="https://projectp.fr/" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-gold">
            30 jours, 30 projets
          </a>
          <Link href="/" className="ml-auto inline-flex min-h-11 items-center uppercase tracking-widest hover:text-gold">
            Choix du mode
          </Link>
          <MotionToggle />
        </div>
      </footer>
    </>
  );
}
