import type { Certification, Experience, Formation, Realisation, SkillCategory } from "./types";

// Expériences, de la plus récente à la plus ancienne. La première est le poste actuel.
export const experiences: Experience[] = [
  {
    role: "Développeur full-stack Laravel",
    company: "CNSI-SD",
    dates: "Depuis septembre 2025 · CDI",
    current: true,
    summary:
      "Après deux ans d'alternance, je suis resté chez CNSI-SD en CDI. Je développe en Laravel, de la base de données à l'interface.",
    highlights: [
      "Mise en place de nouveaux fournisseurs",
      "Analyse et suivi des facturations transporteurs",
    ],
  },
  {
    role: "Développeur full-stack Laravel, en alternance",
    company: "CNSI-SD",
    dates: "2023 – 2025",
    summary: "Ajout de nouveaux fournisseurs, en m'adaptant aux besoins de chacun.",
    highlights: ["Laravel, Symfony, React et Vue au quotidien", "Docker, MySQL, PostgreSQL et GitLab"],
  },
  {
    role: "Développeur full-stack PHP et JavaScript, en alternance",
    company: "Icicartegrise",
    place: "Brest",
    dates: "2022 – 2023",
    summary: "Migrations et mises en production, et de nombreuses améliorations du back-office.",
    highlights: ["Temps d'affichage des pages du back-office réduit", "Maquettes sous Figma, suivi sous Jira"],
  },
  {
    role: "Stagiaire développeur web",
    company: "VEZIM",
    place: "Rennes",
    dates: "2020 – 2022 · deux stages de deux mois",
    summary: "Migration d'une base de données vers WordPress, puis création du site vitrine d'À Table Capucine.",
    highlights: ["WordPress et CSS sur mesure", "Maquettes sous Figma"],
  },
];

/** Section « Certifications » de l'accueil : masquée tant qu'il n'y a pas de vraie certification. */
export const showCertifications = false;

// EXEMPLES FICTIFS, NON AFFICHÉS (showCertifications = false) : gardés comme modèle pour en ajouter.
export const certifications: Certification[] = [
  { name: "Accessibilité numérique avancée", issuer: "Institut Accès Numérique", date: "2025" },
  { name: "Qualité et performance web", issuer: "Collectif Qualité Web", date: "2024" },
  { name: "Graphismes 3D temps réel", issuer: "École des Arts numériques de Brévant", date: "2023" },
];

// Formations, de la plus récente à la plus ancienne. Diplômes obtenus.
export const formations: Formation[] = [
  {
    slug: "master-sup-de-vinci",
    name: "Master",
    school: "Sup de Vinci",
    dates: "2023 – 2025",
    description:
      "En alternance. Projets d'études et mémoire de fin d'année, avec une vision large des langages, des environnements techniques et de la gestion de projet.",
    skills: ["Gestion de projet", "Méthodes agiles", "Architecture", "Travail en équipe"],
  },
  {
    slug: "bachelor-sup-de-vinci",
    name: "Bachelor 3",
    school: "Sup de Vinci",
    dates: "2022 – 2023",
    description:
      "En alternance. Projet d'études et mémoire, et un tour des langages backend et des environnements de projets professionnels.",
    skills: ["Ruby", "Rust", "C#", ".NET", "Python"],
  },
  {
    slug: "bts-sio",
    name: "BTS SIO",
    school: "Lycée Saint-Sauveur",
    dates: "2020 – 2022",
    description: "Mes premières années de développement : les bases du web, de Java et de la sécurité informatique.",
    skills: ["HTML", "CSS", "JavaScript", "PHP", "Java", "Laravel"],
  },
];

export const realisations: Realisation[] = [
  {
    slug: "defi-30-jours-30-projets",
    title: "Le défi « 30 jours, 30 projets »",
    date: "2026",
    summary: "Un projet en ligne par jour, pendant trente jours. Ce portfolio est le trentième.",
    details: [
      "Dès le quatrième jour : achat d'un VPS et d'un nom de domaine, sécurisation du serveur et installation de Coolify. Tous les projets y sont hébergés, chacun sur son sous-domaine.",
      "Trente idées, du jeu de combat en 3D à la boutique éphémère, en passant par un jeu incrémental dont j'ai écrit l'histoire. Certaines journées ont été simples, d'autres beaucoup moins.",
      "Le défi m'a appris à travailler avec l'IA : écrire de meilleurs prompts, donner le bon contexte, relire tout ce qu'elle produit. Plusieurs projets seront retravaillés, et peut-être commercialisés.",
    ],
    url: "https://projectp.fr",
  },
  {
    slug: "hackathon-sopra-steria",
    title: "Hackathon by Sopra Steria",
    date: "Deux éditions",
    summary: "Deux participations, deux années de suite.",
    details: ["Des équipes, un sujet et un temps limité pour livrer une solution qui fonctionne."],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Développement",
    note: "Ce que j'écris tous les jours, et un peu plus.",
    skills: ["PHP", "TypeScript", "JavaScript", "SQL", "CSS", "Java", "C#", ".NET", "Rust"],
  },
  {
    name: "Technologies",
    note: "Les briques avec lesquelles je construis.",
    skills: ["Laravel", "Symfony", "React", "Next.js", "Angular", "Node.js", "Three.js", "Tailwind CSS", "PostgreSQL"],
  },
  {
    name: "Outils",
    note: "Pour livrer et maintenir.",
    skills: ["Git", "Docker", "Coolify", "Linux", "VS Code", "Suite JetBrains", "Figma", "Claude"],
  },
  {
    name: "Design",
    note: "Ce qui rend une interface claire. L'UX, j'apprends encore, et c'est très bien comme ça.",
    skills: ["UX", "UI", "Accessibilité", "Prototypage", "Animation", "Design d'interface"],
  },
  {
    name: "Autres",
    note: "Ce qui ne s'installe pas.",
    skills: ["Rédaction technique", "Prise de parole", "Leadership", "Formation client"],
  },
];
