import type { Certification, Experience, Formation, Realisation, SkillCategory } from "./types";

// CONTENU TEMPORAIRE : expériences fictives. La première est le poste actuel (ou le dernier).
export const experiences: Experience[] = [
  {
    role: "Développeuse full-stack",
    company: "Studio Lumen",
    place: "Annecy",
    dates: "Depuis 2023",
    current: true,
    summary:
      "Je conçois et maintiens les applications web du studio, de la base de données à l'interface, pour des clients du tourisme et de la culture.",
    highlights: [
      "Refonte d'une billetterie : temps de chargement divisé par trois",
      "Mise en place des tests de bout en bout et du déploiement continu",
      "Accompagnement de deux développeurs juniors",
    ],
  },
  {
    role: "Développeuse front-end",
    company: "Agence Cairn",
    place: "Lyon",
    dates: "2021 – 2023",
    summary: "Intégration de sites vitrines et d'interfaces sur mesure, avec une attention particulière à l'accessibilité.",
    highlights: ["Une vingtaine de sites livrés", "Audit d'accessibilité de tous les projets de l'agence"],
  },
];

// CONTENU TEMPORAIRE : certifications fictives (organismes inventés).
export const certifications: Certification[] = [
  { name: "Accessibilité numérique avancée", issuer: "Institut Accès Numérique", date: "2025" },
  { name: "Qualité et performance web", issuer: "Collectif Qualité Web", date: "2024" },
  { name: "Graphismes 3D temps réel", issuer: "École des Arts numériques de Brévant", date: "2023" },
];

// CONTENU TEMPORAIRE : formations fictives, de la plus récente à la plus ancienne.
export const formations: Formation[] = [
  {
    slug: "master-ingenierie-web",
    name: "Master Ingénierie du web",
    school: "Université de Vallonne",
    dates: "2019 – 2021",
    description:
      "Architecture d'applications, accessibilité et conduite de projet. Mémoire sur le rendu graphique dans le navigateur.",
    skills: ["Architecture logicielle", "Accessibilité", "WebGL", "Gestion de projet"],
  },
  {
    slug: "licence-informatique",
    name: "Licence Informatique",
    school: "Université de Vallonne",
    dates: "2016 – 2019",
    description:
      "Algorithmique, bases de données, réseaux et programmation orientée objet. Première application web publiée en troisième année.",
    skills: ["Algorithmique", "SQL", "Java", "Réseaux"],
  },
  {
    slug: "atelier-design-interactif",
    name: "Certificat Design interactif",
    school: "École des Arts numériques de Brévant",
    dates: "2022",
    description:
      "Formation courte en cours du soir : typographie, grille, mouvement et prototypage d'interfaces.",
    skills: ["Typographie", "Design d'interface", "Prototypage", "Animation"],
  },
];

// CONTENU TEMPORAIRE : réalisations fictives.
export const realisations: Realisation[] = [
  {
    slug: "prix-interface-accessible",
    title: "Prix de l'interface accessible",
    date: "2025",
    summary: "Atlas des sentiers récompensé aux Rencontres du web ouvert.",
    details: [
      "Le jury a retenu la navigation entièrement utilisable au clavier et la lecture claire des cartes par un lecteur d'écran.",
      "Le projet a ensuite été présenté lors d'une démonstration publique devant deux cents personnes.",
    ],
  },
  {
    slug: "conference-ascii",
    title: "Conférence « Dessiner avec des lettres »",
    date: "2024",
    summary: "Trente minutes sur l'art ASCII comme outil de design d'interface.",
    details: [
      "Une histoire rapide du texte comme image, des imprimantes à marguerite aux terminaux modernes.",
      "La seconde moitié montrait comment convertir une photo en caractères, en direct, dans le navigateur.",
    ],
  },
  {
    slug: "bibliotheque-open-source",
    title: "Bibliothèque open source",
    date: "2023",
    summary: "Un utilitaire de conversion d'images en texte, adopté par d'autres projets.",
    details: [
      "Publiée sous licence MIT, la bibliothèque compte une quinzaine de contributeurs.",
      "Elle sert de base au portrait ASCII de ce site.",
    ],
  },
  {
    slug: "refonte-association",
    title: "Refonte pour une association",
    date: "2022",
    summary: "Site d'un club de montagne refait bénévolement, trois fois plus rapide.",
    details: [
      "Le calendrier des sorties, auparavant en PDF, est devenu consultable et filtrable sur téléphone.",
      "Les inscriptions en ligne ont remplacé les formulaires papier.",
    ],
  },
];

// CONTENU TEMPORAIRE : compétences fictives.
export const skillCategories: SkillCategory[] = [
  {
    name: "Développement",
    note: "Ce que j'écris tous les jours.",
    skills: ["TypeScript", "JavaScript", "HTML", "CSS", "SQL", "Python"],
  },
  {
    name: "Technologies",
    note: "Les briques avec lesquelles je construis.",
    skills: ["React", "Next.js", "Node.js", "Three.js", "PostgreSQL", "Tailwind CSS"],
  },
  {
    name: "Outils",
    note: "Pour livrer et maintenir.",
    skills: ["Git", "Docker", "Vitest", "Playwright", "Linux", "Figma"],
  },
  {
    name: "Design",
    note: "Ce qui rend une interface claire.",
    skills: ["Typographie", "Design d'interface", "Animation", "Accessibilité", "Prototypage"],
  },
  {
    name: "Autres",
    note: "Ce qui ne s'installe pas.",
    skills: ["Rédaction technique", "Prise de parole", "Mentorat", "Anglais courant"],
  },
];
