"use client";

import { useEffect } from "react";
import { finishIntro } from "@/lib/motion";

// Durée totale de l'intro, calée sur les délais CSS (globals.css).
const INTRO_MS = 3600;

/** Termine l'intro à la fin du temps prévu, ou dès un clic, un toucher ou Échap. */
export function IntroSkip() {
  useEffect(() => {
    if (document.documentElement.dataset.intro !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finishIntro();
    };
    const timer = setTimeout(finishIntro, INTRO_MS);
    window.addEventListener("pointerdown", finishIntro);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", finishIntro);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <button type="button" onClick={finishIntro} className="intro-skip btn absolute top-3 right-3 z-10">
      Passer l&apos;intro
    </button>
  );
}
