import type { CSSProperties } from "react";

/**
 * Texte découpé caractère par caractère, pour l'effet « tapé au terminal ».
 * Les lecteurs d'écran lisent le texte entier via aria-label ; les mots restent insécables.
 * charClass choisit l'animation CSS : « typed » (à chaque affichage) ou « intro-char » (intro de l'accueil).
 */
export function Typed({
  as: Tag = "h1",
  text,
  className = "",
  charClass = "typed",
}: {
  as?: "h1" | "h2" | "p";
  text: string;
  className?: string;
  charClass?: string;
}) {
  let i = 0;
  return (
    <Tag aria-label={text} className={className}>
      {text.split(" ").map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-pre">
          {[...`${word} `].map((char) => {
            const index = i++;
            return (
              <span key={index} className={charClass} style={{ "--i": index } as CSSProperties}>
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
