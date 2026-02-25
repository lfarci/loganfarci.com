# 01 — Overview

## Current Architecture

The site is a **Next.js 16** application using the App Router with `output: "export"` (static site generation). At build time, Next.js pre-renders every route into static HTML files and deploys them to **Azure Static Web Apps** via the SWA CLI.

### Key characteristics

- **4 routes**: `/`, `/about`, `/articles`, `/articles/[slug]`
- **Content**: Markdown articles and JSON data files stored in `content/` outside the app
- **Data loading**: Node.js `fs.readFileSync` calls in server components, executed at build time only
- **Styling**: Tailwind CSS v4 + HeroUI theme, dark mode via custom `ThemeContext`
- **Fonts**: `next/font/google` (Manrope, Noto Sans, Reddit Mono)
- **Images**: `next/image` with `unoptimized: true` (effectively `<img>` wrappers)
- **No API routes, no middleware, no SSR at runtime**

### Source structure (before migration)

```
src/
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── public/
│   ├── staticwebapp.config.json
│   └── images/
└── src/
    ├── app/
    │   ├── layout.tsx          ← root layout (HTML shell, fonts, metadata)
    │   ├── providers.tsx       ← HeroUI + ThemeProvider
    │   ├── globals.css         ← Tailwind + theme
    │   ├── error.tsx           ← error boundary
    │   ├── not-found.tsx       ← 404 page
    │   ├── page.tsx            ← home
    │   ├── about/page.tsx
    │   ├── articles/page.tsx
    │   └── articles/[slug]/page.tsx
    ├── components/
    ├── contexts/
    ├── core/
    │   ├── articles.ts         ← fs-based markdown loading
    │   ├── data.ts             ← fs-based JSON loading
    │   ├── environment.ts      ← process.env + process.cwd()
    │   └── files.ts            ← fs.readdirSync utilities
    └── types/
content/
├── articles/*.md
└── data/*.json
```

## Target Architecture

A **Vite + React** single-page application with **build-time static prerendering** to maintain SEO parity.

### Key changes

| Aspect | Before (Next.js) | After (Vite + React) |
|---|---|---|
| Build tool | Next.js compiler + Turbopack | Vite + Rollup |
| Routing | File-based App Router | React Router v7 (config-based) |
| Data loading | Node.js `fs` in server components | `import.meta.glob` + JSON imports |
| Markdown | `gray-matter` + `fs.readFileSync` | Custom Vite plugin + `import.meta.glob` |
| Fonts | `next/font/google` | Fontsource (self-hosted) |
| Images | `next/image` (unoptimized) | Native `<img>` |
| Links | `next/link` | React Router `<Link>` |
| Metadata | Next.js `Metadata` export | `react-helmet-async` |
| Output | `out/` (static HTML per route) | `dist/` (static HTML per route via prerender script) |
| Dev server | `next dev --turbopack` | `vite` |

### Source structure (after migration)

```
src/
├── vite.config.ts
├── index.html                  ← Vite entry HTML
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── public/
│   ├── staticwebapp.config.json
│   └── images/
├── plugins/
│   └── vite-plugin-markdown.ts ← custom markdown processor
├── scripts/
│   └── prerender.ts            ← build-time HTML generation
└── src/
    ├── main.tsx                ← React entry point
    ├── App.tsx                 ← root component (router, providers)
    ├── routes.tsx              ← React Router config
    ├── entry-server.tsx        ← SSR render for prerendering
    ├── globals.css
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── AboutPage.tsx
    │   ├── ArticlesPage.tsx
    │   ├── ArticlePage.tsx
    │   └── NotFoundPage.tsx
    ├── components/             ← unchanged (with minor API replacements)
    ├── contexts/               ← unchanged
    ├── core/
    │   ├── articles.ts         ← rewritten (import.meta.glob)
    │   ├── data.ts             ← rewritten (static JSON imports)
    │   ├── date.ts             ← unchanged
    │   ├── icons.ts            ← unchanged
    │   └── string.ts           ← unchanged
    └── types/                  ← unchanged
```

## Scope

### In scope

- Replace Next.js with Vite as the build tool
- Convert App Router file-based routing to React Router v7
- Rewrite content loading from `fs` to Vite-native imports
- Replace all `next/*` component imports
- Implement build-time prerendering for SEO
- Update CI/CD workflow for new build output
- Self-host fonts via Fontsource

### Out of scope

- New features or pages
- Design or layout changes
- Infrastructure changes (Azure SWA stays as-is)
- Content changes (articles, data files)

## Dependencies to Add

| Package | Purpose |
|---|---|
| `vite` | Build tool |
| `@vitejs/plugin-react` | React JSX/refresh support |
| `react-router` | Client-side routing |
| `react-helmet-async` | Per-page metadata |
| `@fontsource-variable/manrope` | Self-hosted Manrope font |
| `@fontsource/noto-sans` | Self-hosted Noto Sans font |
| `@fontsource/reddit-mono` | Self-hosted Reddit Mono font |

## Dependencies to Remove

| Package | Reason |
|---|---|
| `next` | Replaced by Vite |
| `eslint-config-next` | Replaced by standard ESLint config |

## Dependencies to Move

| Package | From → To | Reason |
|---|---|---|
| `gray-matter` | dependencies → devDependencies | Only used by Vite plugin at build time |
