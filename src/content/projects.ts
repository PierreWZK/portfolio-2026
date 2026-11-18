import type { Project } from "./types";

// Projets, dans l'ordre d'affichage. Le projet marqué featured est mis en grand sur l'accueil.
export const projects: Project[] = [
  {
    slug: "a-table-capucine",
    title: "À Table Capucine",
    year: 2022,
    summary: "Le site vitrine d'une cantine-fleuriste rennaise, réalisé en stage.",
    description:
      "Pendant mon stage de deuxième année de BTS chez VEZIM, j'ai créé le site vitrine d'À Table Capucine, une petite cantine-fleuriste de Rennes : présentation du lieu, horaires, services, galerie et contact. Mon premier site pour un vrai client, toujours en ligne aujourd'hui.",
    image: { src: "/projets/a-table-capucine.webp", alt: "Page d'accueil du site À Table Capucine : photo de la boutique et logo" },
    stack: ["WordPress", "CSS", "Figma"],
    features: [
      "Présentation de la cantine et de la boutique de fleurs",
      "Horaires et services mis en avant",
      "Galerie photo",
      "Page de contact",
    ],
    url: "https://www.atablecapucine.fr",
    featured: true,
  },
  {
    slug: "bolduc",
    title: "Bolduc",
    year: 2026,
    summary: "Des listes de cadeaux qui gardent la surprise.",
    description:
      "Une idée qui me trottait dans la tête depuis longtemps. On crée sa liste pour un événement, on la partage par un lien, et les proches réservent ce qu'ils offrent sans que le propriétaire le voie jamais. Un invité peut même ajouter une idée en secret à la liste d'un proche.",
    image: { src: "/projets/bolduc.webp", alt: "Page d'accueil de Bolduc" },
    stack: ["Laravel", "Livewire", "MySQL"],
    features: [
      "Listes par événement, partagées par lien secret",
      "Ajout d'un cadeau en collant un lien de boutique",
      "Cadeau à plusieurs, avec barre de participation",
      "Secret Santa avec exclusions",
    ],
    url: "https://bolduc.projectp.fr",
    github: "https://github.com/PierreWZK/Bolduc",
  },
  {
    slug: "drop",
    title: "Drop",
    year: 2026,
    summary: "Un produit de mode par jour, en stock limité, à 18 h.",
    description:
      "Une boutique éphémère : chaque jour, un seul produit tiré au hasard dans un catalogue de 50 articles. Un compte à rebours fait monter l'attente, un clic réserve un exemplaire dix minutes, et le stock se met à jour en direct jusqu'au sold out.",
    image: { src: "/projets/drop.webp", alt: "Page d'accueil de Drop : un titre géant sur de grandes fleurs orange" },
    stack: ["Laravel", "MySQL", "Stripe"],
    features: [
      "Réservation de dix minutes sous verrou",
      "Stock mis à jour en direct",
      "Tirage quotidien sans répétition",
      "Archives avec le temps de sold out",
    ],
    url: "https://drop.projectp.fr",
    github: "https://github.com/PierreWZK/day-26-drop",
  },
  {
    slug: "layr",
    title: "LayR",
    year: 2026,
    summary: "Une plateforme bilingue pour découvrir des sites au design remarquable.",
    description:
      "Chaque site a une capture, une note éditoriale, un style, une palette et une mise en page. On cherche, on filtre, on garde ses favoris. Côté admin, une URL suffit : la capture et l'analyse par IA préremplissent la fiche, qu'on relit avant de publier.",
    image: { src: "/projets/layr.webp", alt: "Page d'accueil de LayR" },
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Gemini", "Playwright"],
    features: [
      "Français et anglais, trois thèmes",
      "Recherche et filtres par style, palette et mise en page",
      "Favoris, collections et comptes",
      "Ajout de site assisté par l'IA",
    ],
    url: "https://layr.projectp.fr",
    github: "https://github.com/PierreWZK/layr",
  },
];
