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

## Demarrage avec Docker

Le projet inclut le script `docker-start.sh` pour lancer l'application dans un conteneur Docker avec les variables d'environnement attendues.

Ce script existe pour centraliser deux operations:

- charger les variables definies dans `.env.docker`
- construire l'image Docker avec les variables publiques necessaires au build Next.js
- lancer le conteneur avec les variables serveur necessaires a l'execution

Utilisation:

```bash
./docker-start.sh
```

Le fichier `.env.docker` sert donc de source de configuration dediee au lancement Docker. Il permet de separer la configuration utilisee par le conteneur de votre configuration locale classique dans `.env`.

Variables attendues dans `.env.docker`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
SIMULATION_API_URL=
SIMULATION_API_KEY=
BACKEND_API_KEY=
```

Notes:

- les variables `NEXT_PUBLIC_*` sont injectees au moment du build de l'image
- les variables `SIMULATION_API_*` et `BACKEND_API_KEY` sont passees au conteneur au demarrage
- `.env.docker` doit etre renseigne avant d'executer `./docker-start.sh`

## CI Docker et GCP Artifact Registry

Le workflow GitHub Actions [.github/workflows/build-image.yml](.github/workflows/build-image.yml) suit GitHub Flow:

- sur pull request, il verifie uniquement que l'image Docker se construit
- sur `push` vers `main`, il construit puis publie l'image sur GCP Artifact Registry
- un declenchement manuel via `workflow_dispatch` permet un build de verification sans publication
- le workflow echoue si les secrets et variables de build GitHub requis sont absents
- le job utilise l'environment GitHub `prod`

Images publiees:

- `europe-west1-docker.pkg.dev/<GCP_PROJECT_ID>/vesta/nextjs:<github.sha>`

Configuration GitHub recommandee:

- secrets d'organisation partages: `GCP_SA_KEY`, `GCP_PROJECT_ID`
- definir dans l'environment GitHub `prod` les `vars` ou `secrets` `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

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