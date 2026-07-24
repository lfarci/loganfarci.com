---
spec: architecture
version: 0.1.0
status: current-state
---

# Architecture Spec

[Back to the specs index.](./README.md)

How the site is built and rendered. Verified against the code referenced inline.
See [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) for
the full directory layout and developer workflows. This spec covers the **current**
state; see [vision.md](./vision.md) for planned direction and the target sitemap.

## Stack

Verified from [`src/package.json`](../../src/package.json):

| Concern | Choice |
| --- | --- |
| Build tool | **Vite 7** (not Next.js — see note below) |
| UI | **React 19** + **react-router 7** |
| Language | **TypeScript 5** (`strict: true`) |
| Styling | **Tailwind CSS 4** (`@tailwindcss/vite`) + local shadcn-style **Radix** primitives |
| Animation | **framer-motion** |
| Markdown rendering | **react-markdown** + **remark-gfm**; **mermaid** for diagrams |
| Analytics | **Azure Application Insights** (cookieless, PROD-only) — see [`docs/analytics.md`](../analytics.md) |
| Testing | **vitest** + Testing Library + jsdom |
| Hosting | **Azure Static Web Apps**, provisioned by Terraform in `infra/` |

> **Stack note (drift reconciled):** The `README.md` tech-stack table historically
> listed **Next.js**. The app does **not** use Next.js — it is a Vite SPA with a
> custom SSR-prerender step (below). Vite is the source of truth.

All app commands run from the `src/` directory (the Vite project root).

## Routes and page responsibilities

Defined in [`src/src/routes.tsx`](../../src/src/routes.tsx); pages in `src/src/pages/`.

| Path | Page | Responsibility |
| --- | --- | --- |
| `/` | `HomePage` | Hero/greeting, profile intro, featured articles, high-relevance certifications, interests, and contact links. |
| `/about` | `AboutPage` | Full professional profile: experience timeline, education/diploma, all certifications, and skill categories. |
| `/articles` | `ArticlesPage` | List of all articles, newest first. |
| `/articles/:slug` | `ArticlePage` | A single rendered markdown article with metadata; redirects when the slug is unknown. |
| `*` | `NotFoundPage` | Client-side 404. |

`getStaticRoutes()` (same file) enumerates the routes to prerender: `/`, `/about`,
`/articles`, and one `/articles/{slug}` per article. The prerender step also renders
a dedicated `/404` into `404.html`.

## SSR + prerender contract

The site ships as **static HTML** — there is no runtime server. Rendering happens at
build time in three ordered steps (`npm run build`, from `src/package.json`):

1. `build:client` — `vite build` → client bundle + `dist/index.html` template.
2. `build:server` — `vite build --ssr src/entry-server.tsx` → `dist/server/`.
3. `prerender` — `node scripts/prerender.mjs`.

Contract between the pieces:

- [`src/src/entry-server.tsx`](../../src/src/entry-server.tsx) exports
  `render(url)` → `{ headTags, html }`, produced with `react-dom/static`'s
  `prerender` + `StaticRouter`. Head tags (title, meta, canonical, JSON-LD) are
  emitted by each page and split from body HTML at a template marker. It also
  re-exports `getStaticRoutes` and `getAllArticles`.
- [`src/scripts/prerender.mjs`](../../src/scripts/prerender.mjs) loads the SSR
  bundle, and for each static route injects `html` into `<div id="root">` and
  `headTags` into `<head>`, writing `dist/{route}/index.html`. It additionally
  generates:
  - `404.html` (from the `/404` render) — SWA fallback.
  - `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`.
- [`src/public/staticwebapp.config.json`](../../src/public/staticwebapp.config.json)
  sets `navigationFallback` → `/404.html`, excluding static assets and the generated
  text/xml files.

Page SEO metadata (canonical URLs, JSON-LD) is built in
[`src/src/core/seo.ts`](../../src/src/core/seo.ts).

## Content pipeline

Content lives **outside** the app in `content/`, imported via the `@content/` alias
(`@/` maps to `src/src/`; see [`src/tsconfig.json`](../../src/tsconfig.json)).

```
content/articles/*.md ──(vite-plugin-markdown + import.meta.glob)──▶ core/articles.ts ──▶ pages
content/data/*.json  ──(Vite JSON import, inlined at build)───────▶ core/data.ts ────▶ pages
```

- **Articles:** Markdown files in `content/articles/` are loaded eagerly at build
  time via `import.meta.glob` in [`src/src/core/articles.ts`](../../src/src/core/articles.ts).
  The custom `src/plugins/vite-plugin-markdown.ts` parses front matter (`title`,
  `description`, `publishedAt`, `featured`, `tags`, `author`, `coauthoredWithAgent`)
  into the `Article` type. Slug = filename without `.md`. Articles sort newest-first;
  featured = up to 3 with `featured: true`.
- **Structured data:** JSON files in `content/data/` are imported and cast to types
  in [`src/src/core/data.ts`](../../src/src/core/data.ts). See
  [data-contracts.md](./data-contracts.md).

Article markdown bodies are rendered by a single pipeline
([`MarkdownContent.tsx`](../../src/src/components/shared/MarkdownContent.tsx)); the
supported syntax and element mapping are specified in
[markdown-rendering.md](./markdown-rendering.md).

Because content is resolved at build time, **adding or editing content requires a
rebuild** — there is no runtime fetching for core content.
