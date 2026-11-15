import type { Project } from "./types";

// CONTENU TEMPORAIRE : projets fictifs, à remplacer en phase 7.
export const projects: Project[] = [
  {
    slug: "atlas-des-sentiers",
    title: "Atlas des sentiers",
    year: 2026,
    summary: "Une carte de randonnées qui fonctionne sans réseau.",
    description:
      "Application web qui télécharge les tracés d'un massif avant le départ, puis guide le marcheur hors ligne. Le dénivelé restant et l'heure d'arrivée se recalculent à chaque pas.",
    stack: ["Next.js", "TypeScript", "MapLibre", "IndexedDB"],
    features: [
      "Cartes et tracés disponibles hors ligne",
      "Profil de dénivelé interactif",
      "Estimation de l'heure d'arrivée",
      "Partage d'un itinéraire par lien",
    ],
    url: "https://atlas.example",
    github: "https://github.com/example/atlas-des-sentiers",
    featured: true,
  },
  {
    slug: "papier-carbone",
    title: "Papier carbone",
    year: 2025,
    summary: "Un éditeur de factures pour indépendants, sans compte.",
    description:
      "Les factures se composent dans le navigateur et restent sur l'appareil. L'export PDF respecte les mentions légales françaises et la numérotation continue.",
    stack: ["React", "Vite", "Tailwind CSS", "pdf-lib"],
    features: [
      "Aucune donnée envoyée à un serveur",
      "Export PDF conforme",
      "Numérotation automatique",
      "Modèles de mise en page",
    ],
    url: "https://papier-carbone.example",
    github: "https://github.com/example/papier-carbone",
  },
  {
    slug: "chambre-d-echo",
    title: "Chambre d'écho",
    year: 2025,
    summary: "Un synthétiseur visuel piloté au clavier.",
    description:
      "Chaque touche déclenche une note et une forme. L'ensemble dessine une partition animée qu'on peut rejouer, ralentir et exporter en vidéo.",
    stack: ["Three.js", "Web Audio API", "TypeScript"],
    features: [
      "Synthèse sonore dans le navigateur",
      "Visuels générés en temps réel",
      "Enregistrement et relecture",
      "Export vidéo",
    ],
    url: "https://chambre-echo.example",
  },
  {
    slug: "veilleur",
    title: "Veilleur",
    year: 2024,
    summary: "Un tableau de bord qui surveille la santé de sites web.",
    description:
      "Veilleur interroge une liste de sites toutes les cinq minutes, mesure leur temps de réponse et prévient par e-mail dès qu'un certificat approche de son expiration.",
    stack: ["Node.js", "PostgreSQL", "Docker", "React"],
    features: [
      "Historique des temps de réponse",
      "Alertes par e-mail",
      "Suivi des certificats",
      "Page d'état publique",
    ],
    github: "https://github.com/example/veilleur",
  },
];
