import { Footer } from "@/components/classic/Footer";
import { Header } from "@/components/classic/Header";
import { profile } from "@/content";

// Mise en page commune aux sept vues du mode classique.
export default function ClassicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header brand={profile.name} />
      <main id="contenu" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 outline-none sm:px-8 sm:py-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
