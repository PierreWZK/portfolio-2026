import Link from "next/link";
import type { CSSProperties } from "react";
import { AsciiLandscape } from "@/components/ascii/AsciiLandscape";
import { MotionToggle } from "@/components/common/MotionToggle";
import { Typed } from "@/components/common/Typed";
import { IntroSkip } from "@/components/home/IntroSkip";
import { profile } from "@/content";

// Accueil : écran de sélection du mode. Tout tient dans la fenêtre, sans scroll.

const modes = [
  {
    href: "/about",
    title: "Mode classique",
    text: "Une navigation simple, professionnelle et efficace.",
  },
  {
    href: "/exploration",
    title: "Mode exploration",
    text: "Découvrez mon bureau interactif.",
  },
];

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function Home() {
  return (
    <main className="relative flex h-dvh flex-col overflow-hidden short:flex-row">
      <IntroSkip />
      <AsciiLandscape className="min-h-0 flex-1" />

      <div className="mx-auto w-full max-w-4xl shrink-0 px-4 pb-2 pt-3 sm:px-8 sm:pb-5 sm:pt-6 sm:text-center short:w-1/2 short:self-center short:py-0 short:text-left">
        <Typed
          text={`Hello, I'm ${profile.name}`}
          charClass="intro-char"
          className="text-2xl leading-tight font-bold uppercase sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight short:text-xl short:leading-tight"
        />
        <p className="intro-fade mt-1 text-sm text-muted sm:mt-3 sm:text-lg short:mt-1 short:text-sm" style={delay(2300)}>
          {profile.tagline}
        </p>

        <div className="intro-fade" style={delay(2800)}>
          <p className="mt-3 font-mono text-xs sm:mt-6 sm:text-sm short:mt-1" id="choix">
            {/* Espaces insécables : les guillemets et le « ? » ne passent jamais seuls à la ligne. */}
            {"« Comment souhaitez-vous découvrir mon univers ? »"}
          </p>
          <nav aria-labelledby="choix" className="mt-2 grid gap-2 text-left sm:mt-4 sm:grid-cols-2 sm:gap-4 short:mt-1 short:grid-cols-1 short:gap-2">
            {modes.map((mode) => (
              <Link key={mode.href} href={mode.href} className="mode">
                <span className="mode-corner" aria-hidden="true">+</span>
                <span className="mode-corner" aria-hidden="true">+</span>
                <span className="mode-corner" aria-hidden="true">+</span>
                <span className="mode-corner" aria-hidden="true">+</span>
                <span className="mode-title block">{mode.title}</span>
                <span className="mt-1 block text-sm text-muted">{mode.text}</span>
                <span className="mode-trail mt-1" aria-hidden="true">
                  {">>>>>>>>>>>>>>"}
                </span>
              </Link>
            ))}
          </nav>
          <MotionToggle className="sm:mt-2 short:mt-0" />
        </div>
      </div>
    </main>
  );
}
