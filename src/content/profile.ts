import type { Contact, Profile } from "./types";

// CONTENU TEMPORAIRE : personne fictive, à remplacer en phase 7.
export const profile: Profile = {
  name: "Camille Aubrac",
  role: "Développeuse full-stack & creative developer",
  tagline: "Développeuse passionnée par la création d'expériences digitales uniques.",
  intro:
    "Je conçois des interfaces qui se lisent vite et dont on se souvient : du premier croquis au déploiement, avec le même soin pour le code que pour le détail visible.",
  about: [
    "Je travaille à la frontière entre le développement et le design. Ce qui m'intéresse, c'est le moment où une contrainte technique devient une idée graphique.",
    "Depuis cinq ans, je construis des applications web pour des studios, des associations et mes propres projets. J'aime les outils simples, les pages rapides et les interfaces accessibles à tout le monde.",
    "En dehors de l'écran : la randonnée en moyenne montagne, la typographie et les vieux terminaux, qui ont donné son allure à ce site.",
  ],
  // Photo : déposer le fichier dans /public, puis mettre src: "/portrait.jpg".
  portrait: { src: null, alt: "Portrait de Camille Aubrac en caractères ASCII" },
};

// CONTENU TEMPORAIRE : coordonnées fictives.
export const contact: Contact = {
  email: "bonjour@camille-aubrac.example",
  links: [
    { label: "GitHub", url: "https://github.com/example" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/example" },
  ],
};
