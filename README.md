# Portfolio · ASCII World & Welcome to my workspace

> Jour 30 du défi **30 jours, 30 projets** · Next.js · TypeScript · Tailwind CSS · Three.js

Un portfolio personnel à deux modes, qui partagent les mêmes données :

- **Mode classique** : sept rubriques (About me, Projets, Formations, Réalisations, Compétences, Le futur, Contact), esthétique ASCII, thème clair / sombre, portrait converti en caractères.
- **Mode exploration** « Welcome to my workspace » : un bureau 3D low poly, écrit en code (Three.js, React Three Fiber). Six objets s'ouvrent : ordinateur (projets), livres (formations, avec un livre 3D qui s'ouvre), cadres (réalisations), post-it (compétences), téléphone (contact), horloge (le futur). La pièce évolue avec les découvertes. Tout s'ouvre aussi au clavier, et un repli s'affiche sans WebGL.

Le contenu actuel est **fictif** (personne inventée) en attendant les vraies informations. Le site n'est donc pas indexé (`robots.ts`).

Site : https://portfolio.projectp.fr · Dépôt : https://github.com/PierreWZK/portfolio-2026

## Lancer en local

```bash
npm install
npm run dev        # http://localhost:3000
```

## Vérifier

```bash
npm test           # Vitest : paysage ASCII, conversion image vers ASCII, validation du contact
npm run lint
npm run build
```

## Modifier le contenu

Tout le contenu est dans `src/content/` (profil, projets, formations, réalisations, compétences, vision du futur, contact). Aucun texte de contenu n'est écrit dans les composants.

- Portrait : déposer la photo dans `public/`, puis mettre `src: "/portrait.jpg"` dans `src/content/profile.ts`.
- Capture d'un projet : renseigner le champ `image` du projet.
- Livres posés sur le bureau 3D : `src/content/desk.ts` (titre et auteur, cinq au plus).
- Photo détourée : `node scripts/cutout.mjs photo.png public/portrait-cutout.png` (fond clair ou ciel), ou déposer un PNG à fond transparent.

## Formulaire de contact

L'envoi passe par SMTP. Copier `.env.example` vers `.env.local` et remplir `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`. Sans ces variables, le formulaire n'envoie rien et propose un lien `mailto:`.

## Mise en ligne

`Dockerfile` pour Coolify, port 3000. Variables SMTP à poser à l'exécution.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Three.js · React Three Fiber · Vitest · nodemailer.

Suivi détaillé du projet : [CLAUDE_CONTEXTE.md](CLAUDE_CONTEXTE.md).
