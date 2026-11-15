// Formes des données du portfolio, partagées par le mode classique et le mode exploration.

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  /** Situation actuelle, affichée en petit dans le hero (ex. recherche de poste). Optionnel. */
  status?: string;
  /** Ville, pays. Optionnel. */
  location?: string;
  /** Présentation courte du hero. */
  intro: string;
  /** Paragraphes de la page About me. */
  about: string[];
  /** Photo source du portrait ASCII, dans /public (ex. "/portrait.jpg"). null : buste provisoire dessiné en code. */
  portrait: { src: string | null; alt: string };
};

export type Project = {
  slug: string;
  title: string;
  year: number;
  summary: string;
  description: string;
  image?: { src: string; alt: string };
  stack: string[];
  features: string[];
  url?: string;
  github?: string;
};

export type Formation = {
  slug: string;
  name: string;
  school: string;
  /** Affiché tel quel, par exemple « 2021 – 2023 ». */
  dates: string;
  description: string;
  skills: string[];
};

export type Realisation = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  details: string[];
  image?: { src: string; alt: string };
  url?: string;
};

export type SkillCategory = {
  /** Développement, Technologies, Outils, Design, Autres. */
  name: string;
  note: string;
  skills: string[];
};

export type FutureSection = {
  title: string;
  paragraphs: string[];
};

export type Future = {
  title: string;
  lead: string;
  sections: FutureSection[];
};

export type Contact = {
  email: string;
  links: { label: string; url: string }[];
};

/** Livre posé sur le bureau 3D : décor personnalisable (lectures du moment). */
export type DeskBook = {
  title: string;
  author?: string;
};
