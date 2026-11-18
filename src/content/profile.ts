import type { Contact, Profile } from "./types";

export const profile: Profile = {
  name: "Pierre Dolivet",
  brand: "Pierr.",
  role: "Développeur full-stack & UX designer junior",
  tagline:
    "Je conçois des sites et des applications qui se lisent vite, avec le même soin pour le code que pour l'expérience de celui qui les utilise.",
  status: "En poste chez CNSI-SD, disponible pour de la création web.",
  location: "Rennes, Saint-Malo, Nantes",
  intro:
    "Développeur full-stack, je travaille aujourd'hui en PHP et Laravel, avec un œil constant sur l'accessibilité et l'UX. Et un faible pour le code que la personne suivante pourra relire sans soupirer.",
  about: [
    "L'informatique m'accompagne depuis tout jeune : d'abord les consoles, grâce à mon frère, puis Minecraft en 2012. Mon premier ordinateur portable m'a donné l'envie de tout bidouiller, pour gratter quelques images par seconde et un peu de débit en plus.",
    "Au fil des années, je me suis attaché au code, avec un faible pour l'accessibilité et l'UX design. Aujourd'hui, je développe en PHP et Laravel, et j'essaie de glisser le plus d'UX possible dans chaque projet.",
    "J'aime les problèmes complexes. Une tâche de dix minutes qui devient une heure de réflexion, pour une solution dix fois meilleure : c'est mon moment préféré. Depuis quelques années, j'aime aussi former mes clients, et je me verrais bien transmettre un jour dans des écoles.",
    "Ma méthode : avant de coder, j'appelle le client pour confirmer ses attentes. Ensuite, je cherche comment rendre le projet plus accessible, plus pédagogue et plus soigné, et j'ajuste le temps passé à l'usage réel de la fonctionnalité. Sur un projet que je découvre, je prends le temps au départ ; au bout d'un mois, je sais où se trouve chaque objet.",
    "En dehors de l'écran : la salle de sport, le rugby, les films et les séries, les jeux, et surtout mes amis et ma famille.",
  ],
  // Photo : la détourer (node scripts/cutout.mjs photo.png public/portrait-cutout.png),
  // ou déposer un PNG à fond transparent dans /public, puis mettre son chemin dans src.
  portrait: { src: "/portrait-cutout.png", alt: "Portrait de Pierre Dolivet en caractères ASCII" },
};

export const contact: Contact = {
  email: "pierredolivet.pro@gmail.com",
  links: [
    { label: "GitHub", url: "https://github.com/PierreWZK" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/pierre-dolivet/" },
    { label: "Instagram", url: "https://www.instagram.com/pierredodo35/" },
  ],
};
