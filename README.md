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