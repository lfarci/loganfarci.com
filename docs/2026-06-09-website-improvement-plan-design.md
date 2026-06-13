# Website Improvement Plan — Design Spec

**Date:** 2026-06-09  
**Status:** Draft — Awaiting User Review

## Vision

Transform loganfarci.com from a functional portfolio into a modern, animated, multilingual developer hub that is optimized for both human readers and LLMs, with a fully open-source technology stack.

---

## 1. Replace HeroUI with an Open-Source Component Library

### Problem

HeroUI (formerly NextUI) has a freemium model — some components are behind a Pro paywall. This creates a dependency risk and licensing concern for a personal project that should be fully open-source.

### Recommendation: shadcn/ui + Radix UI

- **shadcn/ui** — copy-paste components built on Radix UI primitives with Tailwind CSS
- Fully open-source (MIT), no vendor lock-in (you own the code)
- Perfect Tailwind CSS v4 integration
- Accessible by default (Radix primitives handle ARIA, focus management, keyboard nav)
- Future-proof: components live in your codebase, not in `node_modules`
- Massive community adoption and active maintenance

### Migration Scope

- Remove `@heroui/react` dependency
- Install Radix UI primitives as needed + shadcn/ui CLI
- Migrate existing components one-by-one (buttons, cards, tooltips, navigation)
- Keep `framer-motion` for animations (already installed, works well with Radix)

---

## 2. Modern Design — Animations, Color, and Visual Identity

### Problem

The current site feels static and lacks visual personality. It needs motion, color depth, and distinctive design to stand out.

### Approach

- **Micro-interactions:** Hover effects, page transitions, scroll-triggered animations using Framer Motion
- **Color system:** Define a richer palette with gradients, accent colors, and dark/light mode variants in Tailwind config
- **Typography:** Leverage existing Manrope/Noto Sans fonts with better hierarchy and spacing
- **Layout:** Add visual rhythm with asymmetric grids, whitespace, and subtle background elements (noise textures, gradients, blurred shapes)
- **Motion philosophy:** Purposeful animations that guide attention — not decoration for its own sake

### Deliverables

- Updated Tailwind theme with extended color palette
- Shared animation variants (fade-in, slide-up, stagger) as reusable Framer Motion presets
- Page transition wrapper component
- Scroll-reveal component for content sections

---

## 3. Resume / Experience Export

### Problem

The experience data already exists in `content/data/experiences.json` but isn't exportable. Users (recruiters, connections) should be able to download a résumé.

### Approach

- Add a `/resume` page that renders experience, education, certifications, and skills in a clean, print-friendly layout
- Provide a "Download PDF" button that uses browser print-to-PDF (CSS `@media print`) — no server-side PDF generation needed
- Alternatively, generate a static PDF at build time using Puppeteer or a lightweight library
- The data source remains the existing JSON files — single source of truth

### Key Decision

**CSS print stylesheet (recommended):** Zero runtime dependency, works with prerendering, users can also Ctrl+P from the page. A dedicated `@media print` stylesheet gives full control over the PDF output.

---

## 4. Internationalization (i18n) — French Translation

### Problem

The site is English-only. As a Belgian developer, French support is important for local audience reach.

### Approach

- Use **react-i18next** (mature, SSR-compatible, lightweight)
- Organize translations in `content/locales/{en,fr}/` as JSON namespace files
- Language switcher component in the navigation bar
- URL strategy: prefix-based (`/fr/about`, `/en/about`) for SEO benefits
- Default language: English (no prefix) or explicit `/en/` — configurable
- Articles: support per-language markdown files (`article.en.md`, `article.fr.md`) or keep articles English-only initially

### Scope for v1

- Translate UI chrome (nav, headings, buttons, metadata) to French
- Articles remain English-only (can be extended later)
- Prerender both language variants for SEO

---

## 5. Recommendations Page

### Problem

The user wants to share favorite podcasts, YouTube channels, and software engineering content.

### Approach

- New route: `/recommendations`
- Data source: `content/data/recommendations.json` with categories (podcasts, YouTube, blogs, tools, books)
- Each item: name, URL, description, category, optional image/logo
- UI: filterable grid/list by category, with card-style presentation
- Could include a brief personal note per recommendation explaining why it's valuable

### Data Schema

```json
{
  "category": "podcast",
  "name": "Software Engineering Daily",
  "url": "https://...",
  "description": "Deep dives into engineering topics",
  "note": "My go-to for learning about distributed systems",
  "image": "/images/recommendations/sed.avif"
}
```

---

## 6. Projects Section

### Problem

No dedicated place to showcase personal projects and open-source work.

### Approach

- New route: `/projects`
- Data source: `content/data/projects.json`
- Each project: name, description, tech stack, links (GitHub, live demo), status, image/screenshot
- UI: card grid with tech stack tags, filterable
- Could optionally pull data from GitHub API at build time (stars, last updated)

### Priority

Lower priority per user — implement after core improvements.

---

## 7. LLM Optimization

### Problem

LLMs are increasingly how people consume web content. The site should be optimized for AI consumption alongside human readers.

### Approach

- **llms.txt standard:** Add `/llms.txt` and `/llms-full.txt` files (machine-readable site map for LLMs)
- **Structured data:** Implement Schema.org JSON-LD for articles (Article), person (Person with worksFor/hasOccupation), website (WebSite, BreadcrumbList) — builds on existing issue #38
- **Semantic HTML:** Ensure all pages use proper `<article>`, `<nav>`, `<main>`, `<section>`, `<aside>` elements
- **Meta descriptions:** Every page gets a meaningful description
- **Clean content hierarchy:** Use heading levels correctly (h1 → h2 → h3, no skipping)
- **Sitemap.xml:** Generate at build time for all routes

### Key Deliverable

`/llms.txt` — a structured file that tells LLMs what the site contains, how to navigate it, and where to find key content.

---

## 8. Enhanced Markdown Support

### Problem

Articles need better readability features: table of contents, custom callout blocks, and improved typography.

### Approach

- **Table of Contents:** Auto-generated from article headings, displayed as a sticky sidebar on desktop
- **Custom callouts:** Support `[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!ALERT]` syntax (GitHub-style) — builds on existing issue #50
- **Code blocks:** Fix copy button positioning (#51), add language labels, improve syntax highlighting
- **Typography:** Better spacing, link styles, list styles, blockquote styling
- **Images:** Support captions, lazy loading, responsive sizing

### Builds On Existing Issues

- #67, #69, #70: Table of contents components
- #50: Custom quote blocks
- #51: Code block copy button
- #37: General markdown styling

---

## Issue Triage Summary

### Issues to CLOSE (no longer aligned with vision)

| # | Title | Reason |
|---|-------|--------|
| #71 | Create a theme selection menu component | Superseded by broader design system migration |
| #72 | Add the theme selection menu to the website navigation bar | Same — will be redesigned with new component library |
| #66 | Create a theme selection menu | Parent feature — superseded by design system migration |
| #77 | Integrate the terminal to the web page | Terminal is a nice-to-have but not aligned with the modern, clean direction |
| #73 | Avoid hard coded values in styling | Will be naturally resolved during Tailwind theme overhaul |
| #87 | Standard tooltip font in the home page | Will be resolved during HeroUI → shadcn migration |
| #75 | Reorder the about page sections | Will be addressed as part of the broader About page redesign (#43) |
| #65 | Configure global styling to be flexible and configurable | Superseded by Tailwind v4 + new design system |

### Issues to KEEP (still aligned)

| # | Title | Maps to |
|---|-------|---------|
| #81 | Upgrade to Tailwind CSS V4 | Already on v4 per package.json — may just need to close if done |
| #67 | Show a table of content to improve navigation | Section 8 |
| #69 | Create a new table of content component | Section 8 |
| #70 | Add the table of content component to article rendering | Section 8 |
| #68 | Make sure all article headings render with an id | Section 8 |
| #50 | Add support for custom quote blocks | Section 8 |
| #51 | Fix copy button position in code blocks | Section 8 |
| #37 | Improve general markdown styling | Section 8 |
| #38 | Implement Schema.org structured data | Section 7 |
| #36 | Add Open Graph and Twitter Card meta tags | Section 7 (SEO/LLM) |
| #43 | Enhance About page with personal details | Section 2 (design) |
| #62 | Improve the home page | Section 2 (design) |
| #46 | Improve code analysis and linting | Keep (code quality) |
| #45 | Configure Prettier | Keep (code quality) |
| #49 | Write article about GitHub Copilot customizations | Keep (content) |
| #55 | Write a guide on how to use Git worktrees | Keep (content) |
| #59 | Document design guidelines | Keep (useful for new design system) |
| #60 | Create content for the about page | Keep (content) |
| #74 | Improve readability | Section 8 |

### Issues to VERIFY/CLOSE

| # | Title | Reason |
|---|-------|---------|
| #81 | Upgrade to Tailwind CSS V4 | Package.json shows v4.2.1 — likely already done |
| #163 | Review future-dated article publication dates | Housekeeping — verify and close |
| #198 | [aw] Issue Triage failed | Workflow noise — close |

### NEW Issues to Create

| Theme | Title |
|-------|-------|
| Component Library | Migrate from HeroUI to shadcn/ui + Radix UI |
| Design | Define modern visual identity (color, motion, typography) |
| Resume | Add resume page with PDF export |
| i18n | Add French translation support with react-i18next |
| Recommendations | Create recommendations page |
| Projects | Create projects showcase page |
| LLM | Add llms.txt and optimize for AI consumption |
| Markdown | Consolidate markdown improvements (parent feature) |

---

## Proposed Milestones

1. **Foundation** — Component library migration, Tailwind theme, design system
2. **Content & Pages** — Resume, recommendations, projects pages
3. **Internationalization** — i18n setup, French translations
4. **Developer Experience** — Markdown enhancements, article readability
5. **Discoverability** — LLM optimization, SEO, structured data

---

## Assumptions Made (User Unavailable)

- **shadcn/ui** chosen as component library (fully open-source, Tailwind-native, copy-paste model = no vendor lock-in)
- **CSS print-to-PDF** for resume export (simplest, no extra dependencies)
- **react-i18next** for internationalization (most mature React i18n solution)
- **English as default language**, articles stay English-only in v1
- **llms.txt** standard for LLM optimization (emerging standard, lightweight)
- Theme selection (dark/light mode) will be rebuilt as part of the new design system, not as separate feature issues
