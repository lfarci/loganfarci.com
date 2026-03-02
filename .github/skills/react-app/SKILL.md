---
name: react-app
description: Handles implementation tasks in the loganfarci.com React + Vite + Tailwind CSS application. Use when adding components, pages, hooks, styles, or any frontend feature to the app.
---

## Overview

This project is a **Vite + React (TypeScript)** single-page application with SSR prerendering, styled with **Tailwind CSS v4** and the **Heroui** component library. All source code lives under `src/src/`, and all build commands must be run from the `src/` directory.

## Project Structure

```
src/                          # Vite project root (run all commands here)
├── package.json
├── vite.config.ts            # Vite config: aliases, plugins, SSR settings
├── tailwind.config.ts        # Tailwind v4 theme + Heroui plugin
├── tsconfig.json
├── eslint.config.mjs
├── index.html
├── plugins/
│   └── vite-plugin-markdown.ts  # Loads .md files as JS modules at build time
├── public/
│   ├── staticwebapp.config.json
│   └── images/               # Static images and icons
├── scripts/
│   └── prerender.mjs         # Generates static HTML for all routes
└── src/                      # Application source
    ├── main.tsx              # Client entry point
    ├── entry-server.tsx      # SSR entry point
    ├── App.tsx               # Root app component
    ├── routes.tsx            # React Router route definitions
    ├── globals.css           # Global CSS variables and base styles
    ├── app/                  # App-level setup (providers, wrappers)
    ├── components/           # Shared UI components
    │   ├── cards/            # Card-style components
    │   ├── layout/           # Layout primitives (header, footer, etc.)
    │   ├── shared/           # General-purpose reusable components
    │   └── terminal/         # Terminal UI with command pattern
    ├── contexts/             # React contexts
    ├── core/                 # Core logic and utilities
    │   ├── articles.ts       # Article loading utilities
    │   ├── Commands.ts       # Terminal command pattern
    │   └── data.ts           # Data loading utilities
    ├── pages/                # Page-level components (one per route)
    └── types/                # TypeScript type definitions
```

Content (articles and data) lives **outside** `src/`:
```
content/
├── articles/   # Markdown articles (.md files with YAML front matter)
└── data/       # JSON data files (certifications, experiences, skills, etc.)
```

## Coding Conventions

- **TypeScript** for all code. No plain JS files in `src/src/`.
- **Functional React components** with hooks only. No class components.
- **Tailwind CSS** for all styling. Extend the theme in `src/tailwind.config.ts`. Never use inline styles unless absolutely necessary.
- **Heroui** components for UI primitives (buttons, cards, modals, etc.). Import from `@heroui/react`.
- **Import aliases**:
  - `@/` → `src/src/` (e.g., `@/components/Foo` maps to `src/src/components/Foo`)
  - `@content/` → `content/` (e.g., `@content/articles/*.md`)
- **Metadata**: Use `react-helmet-async` (`<Helmet>`) for page-level `<title>` and `<meta>` tags.
- **Routing**: Add new routes in `src/src/routes.tsx`. Use `react-router` (v7+) — do NOT install `react-router-dom` separately.
- **Content**: Article `.md` files go in `content/articles/`. JSON data goes in `content/data/`. Load content via Vite's `import.meta.glob` — no runtime file system access.

## Tailwind CSS Setup

This project uses **Tailwind CSS v4** via `@tailwindcss/vite` (Vite plugin integration).

The theme is extended in `src/tailwind.config.ts` with semantic CSS variable-backed colors:

| Token | CSS Variable |
|-------|-------------|
| `bg-background` | `--color-background` |
| `text-foreground` | `--color-foreground` |
| `text-primary` | `--color-text-primary` |
| `text-secondary` | `--color-text-secondary` |
| `text-tertiary` | `--color-text-tertiary` |
| `text-muted` | `--color-text-muted` |
| `bg-surface` | `--color-surface` |
| `bg-surface-elevated` | `--color-surface-elevated` |
| `border-border` | `--color-border` |
| `text-success/warning/error/info` | status color variables |

CSS variables are defined in `src/src/globals.css`. Always use these semantic tokens instead of raw Tailwind color classes to ensure dark mode consistency. Dark mode is toggled via `class` strategy (`darkMode: "class"` in `tailwind.config.ts`).

## Developer Commands

All commands must be run from `src/`:

```bash
cd src

# Development
npm run dev            # Start Vite dev server (hot reload)

# Build (3-step pipeline)
npm run build          # Full build: client + SSR + prerender
npm run build:client   # Vite client bundle → dist/
npm run build:server   # Vite SSR bundle → dist/server/
npm run prerender      # Static HTML for all routes → dist/

# Quality
npm run lint           # ESLint (TypeScript + React rules)
npm run preview        # Preview the production build locally
```

## Adding New Components

1. Create the component in `src/src/components/` (or a sub-folder matching its category).
2. Use TypeScript with explicit prop types.
3. Use Tailwind utility classes for all styling; reference semantic color tokens.
4. Use Heroui components where appropriate instead of building from scratch.

Example:
```tsx
import type { FC } from "react";

interface MyCardProps {
  title: string;
  description: string;
}

const MyCard: FC<MyCardProps> = ({ title, description }) => (
  <div className="rounded-lg border border-border bg-surface p-4">
    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
    <p className="mt-1 text-sm text-text-secondary">{description}</p>
  </div>
);

export default MyCard;
```

## Adding New Pages

1. Create the page component in `src/src/pages/`.
2. Add a `<Helmet>` tag for the page title and meta description.
3. Register the route in `src/src/routes.tsx`.
4. Add the route path to the `routes` array in `src/scripts/prerender.mjs` so it is prerendered.

## SSR Considerations

- Both `src/src/main.tsx` (client) and `src/src/entry-server.tsx` (SSR) must wrap the app in `<HelmetProvider>`.
- Do not use browser-only APIs (`window`, `document`, `localStorage`) at the module top level or in components without guarding with `typeof window !== "undefined"`.
- Lazy-load heavy client-only libraries with `React.lazy` + `Suspense` where possible.

## Verification Workflow

After making changes:
1. Run `npm run lint` from `src/` — fix all lint errors.
2. Run `npm run build` from `src/` — ensure the full 3-step pipeline succeeds.
3. Run `npm run preview` to manually verify the result in the browser.
