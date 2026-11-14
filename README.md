# Portfolio · ASCII World & Welcome to my workspace

> Jour 30 du défi **30 jours, 30 projets** · Next.js · TypeScript · Tailwind CSS

Un portfolio personnel à deux modes, qui partagent les mêmes données :

- **Mode classique** : sept rubriques (About me, Projets, Formations, Réalisations, Compétences, Le futur, Contact), esthétique ASCII, thème clair / sombre, portrait converti en caractères.
- **Mode exploration** « Welcome to my workspace » : un bureau 3D interactif. **Pas encore construit** : la page l'annonce honnêtement.

Le contenu actuel est **fictif** (personne inventée) en attendant les vraies informations. Le site n'est donc pas indexé (`robots.ts`).

Site : https://portfolio.projectp.fr

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

## Formulaire de contact

L'envoi passe par SMTP. Copier `.env.example` vers `.env.local` et remplir `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`. Sans ces variables, le formulaire n'envoie rien et propose un lien `mailto:`.

## Mise en ligne

`Dockerfile` pour Coolify, port 3000. Variables SMTP à poser à l'exécution.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Vitest · nodemailer.

Suivi détaillé du projet : [CLAUDE_CONTEXTE.md](CLAUDE_CONTEXTE.md).
