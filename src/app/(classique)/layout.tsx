import { Footer } from "@/components/classic/Footer";
import { Header } from "@/components/classic/Header";
import { PageWipe } from "@/components/classic/PageWipe";
import { ScrollFx } from "@/components/classic/ScrollFx";
import { ScrollMeter } from "@/components/classic/ScrollMeter";
import { profile } from "@/content";

// Mise en page commune aux sept vues du mode classique.
export default function ClassicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header brand={profile.brand} />
      <main id="contenu" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 outline-none sm:px-8 sm:py-16">
        {children}
      </main>
      <Footer />
      {/* Effets ASCII : rideau entre les vues, apparitions au défilement, jauge de lecture. */}
      <PageWipe />
      <ScrollFx />
      <ScrollMeter />
    </>
  );
}
