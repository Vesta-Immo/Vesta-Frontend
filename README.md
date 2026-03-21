# Vesta Frontend

Base frontend de Vesta Immo construite avec Next.js App Router.

## Stack retenue

- Node.js: 24 LTS
- Next.js: 16.2.0 stable
- React: 19.2.4
- TypeScript: 5.x
- ESLint: 9.x avec eslint-config-next 16.2.0

## Pourquoi ces versions

Node.js dispose d'une vraie branche LTS. Le projet cible donc Node 24, qui est la LTS active au moment de l'initialisation.

Next.js ne propose pas de LTS officielle. Le choix retenu est donc la version stable courante compatible avec la LTS Node cible, ici Next 16.2.0.

React, TypeScript et ESLint suivent ensuite les versions stables compatibles avec cette base.

## Prerequis

- Node.js 24
- npm 11 ou compatible avec Node 24

Le fichier [.nvmrc](.nvmrc) fixe la version attendue pour les environnements qui utilisent nvm.

## Demarrage

```bash
npm install
npm run dev
```

## Variables d'environnement

Configurer les variables suivantes dans votre environnement local et de production:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
SIMULATION_API_URL=http://localhost:3001
SIMULATION_API_KEY=
BACKEND_API_KEY=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` est la cle publique a utiliser dans le frontend. L'ancienne variable `NEXT_PUBLIC_SUPABASE_ANON_KEY` reste acceptee en secours.
- La `secret` key Supabase n'est pas utilisee dans ce frontend et ne doit pas etre exposee au navigateur.
- `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` peut pointer vers votre domaine public, par exemple `https://monapp.com/auth/callback`.
- Cette URL doit aussi etre autorisee dans la configuration OAuth Google et dans Supabase.
- Le JWT Supabase est ajoute automatiquement aux requetes frontend, puis relaie par les routes Next vers les APIs backend.

Application locale:

```text
http://localhost:3000
```

## Scripts utiles

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Base du projet

- [app/layout.tsx](app/layout.tsx): shell racine, metadata et polices
- [app/page.tsx](app/page.tsx): page d'accueil initiale
- [app/globals.css](app/globals.css): theme global et styles de base
- [package.json](package.json): dependances, scripts et contrainte Node

## Suite logique

Les prochaines couches naturelles pour Vesta Immo sont:

1. l'organisation des features de simulation
2. les services d'integration API
3. les tests sur les parcours critiques