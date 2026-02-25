# Migration: Next.js → Vite + React

This directory documents the migration of [loganfarci.com](https://loganfarci.com) from **Next.js 16 (App Router, static export)** to **Vite + React** with build-time static prerendering.

## Decisions

| Topic | Choice | Rationale |
|---|---|---|
| Rendering | Static prerendering at build time | Preserves SEO parity with current Next.js `output: "export"` |
| Router | React Router v7 (library mode) | Mature, well-documented, no framework lock-in |
| Content pipeline | Vite `import.meta.glob` + custom plugin | Idiomatic Vite, HMR in dev, no pre-build script |
| Fonts | Fontsource (self-hosted) | No external requests, better privacy, static-friendly |
| Metadata | `react-helmet-async` | Per-page `<title>` and `<meta>`, works with prerendering |

## Documents

| Document | Description |
|---|---|
| [01-overview.md](01-overview.md) | High-level overview, motivations, and scope |
| [02-content-pipeline.md](02-content-pipeline.md) | Migrating the `fs`-based content/data loading to Vite modules |
| [03-routing.md](03-routing.md) | Next.js App Router → React Router v7 conversion |
| [04-component-migration.md](04-component-migration.md) | Replacing `next/image`, `next/link`, `next/font`, etc. |
| [05-app-shell.md](05-app-shell.md) | Entry point, providers, layout, fonts, CSS |
| [06-prerendering.md](06-prerendering.md) | Build-time static HTML generation per route |
| [07-config-and-infra.md](07-config-and-infra.md) | Vite config, TypeScript, ESLint, env vars, CI/CD, Azure SWA |
| [08-verification.md](08-verification.md) | Testing plan and regression checklist |

## Migration Order

The steps should be executed in the following order to minimize breakage:

```
1. Install new dependencies, remove Next.js          [07]
2. Create Vite config and entry point                 [05]
3. Build content pipeline (custom plugin + rewrites)  [02]
4. Set up React Router and convert pages              [03]
5. Migrate Next.js component APIs                     [04]
6. Wire up app shell, fonts, CSS                      [05]
7. Implement static prerendering                      [06]
8. Update config, CI/CD, Azure SWA                    [07]
9. Verify and clean up                                [08]
```

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| `fs`-based content loading breaks in browser | **High** | Custom Vite plugin runs in Node.js at build time; `import.meta.glob` is resolved at compile time |
| SEO regression (empty HTML) | **High** | Prerender script generates full HTML per route; verified via HTML inspection |
| Broken article routes | **Medium** | Prerender script enumerates all slugs from glob; 404 fallback for unknown slugs |
| Styling differences | **Medium** | Tailwind + HeroUI config is unchanged; visual comparison before/after |
| CI/CD deployment fails | **Medium** | Output dir changes `out/` → `dist/`; test with `swa deploy` locally first |
| Font rendering differences | **Low** | Fontsource uses identical Google Fonts; CSS variables preserved |
