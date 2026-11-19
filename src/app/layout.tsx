import type { Metadata } from "next";
import { Atkinson_Hyperlegible, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content";
import "./globals.css";

// Texte long : police pensée pour la lisibilité.
const body = Atkinson_Hyperlegible({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Titres et graphismes ASCII.
const ascii = JetBrains_Mono({
  variable: "--font-ascii",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: `${profile.name} · Portfolio`, template: `%s · ${profile.name}` },
  description: profile.tagline,
  // Contenu en relecture : pas d'indexation avant la relecture finale (voir aussi robots.ts).
  robots: { index: false, follow: false },
};

// Exécuté avant le premier affichage, pour éviter tout flash :
// - data-theme : thème clair si le visiteur l'a choisi (sombre par défaut) ;
// - data-motion : choix enregistré, sinon réglage « réduire les animations » du système ;
// - data-intro : l'intro ne joue qu'à la première visite de l'accueil, animations actives.
const bootScript = `try{var d=document.documentElement,s=localStorage,m=s.getItem("motion")||(matchMedia("(prefers-reduced-motion: reduce)").matches?"off":"on");d.dataset.motion=m;if(s.getItem("theme")==="light")d.dataset.theme="light";d.dataset.intro=m==="on"&&!s.getItem("intro-seen")&&location.pathname==="/"?"play":"done"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${body.variable} ${ascii.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <div className="crt" aria-hidden="true" />
      </body>
    </html>
  );
}
