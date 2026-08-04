---
spec: quality-bars
version: 0.3.0
status: current-state
---

# Quality Bars

[Back to the specs index.](./README.md)

The rubric a reviewer agent checks a change against. These describe the project's
**current-state** bar, not aspirational goals — a change MUST NOT regress them.
Requirement keywords (**MUST**, **SHOULD**, **MAY**) follow
[RFC 2119](./README.md#requirement-levels): MUST is a hard gate a reviewer blocks on;
SHOULD is a strong default that needs a stated reason to break. All commands run from
`src/`.

## Accessibility — target WCAG 2.1 AA

This is the enforced gate; the full accessibility contract and ideal state are in
[accessibility.md](./accessibility.md).

- Use semantic HTML and the local shadcn-style **Radix** primitives; interactive
  behavior (tooltips, separators, etc.) MUST NOT be reimplemented by hand.
- Every image MUST have meaningful `alt` text. The `Image` type requires `alt`, and
  `content/data/*.json` image objects provide it — keep it descriptive, not empty.
- Headings MUST follow a logical order (one `h1` per page; see the typography components).
- Interactive elements MUST be keyboard-reachable and have a visible focus state.
- Color/contrast MUST come from the Tailwind semantic tokens — do not hardcode colors
  that break contrast.
- `npm run accessibility` MUST report a Lighthouse accessibility score of at least 90
  on every core route, with 100 retained as the target. The same gate runs in the
  [`Accessibility`](../../.github/workflows/accessibility.yml) workflow.

## Performance

- Pages are **static prerendered HTML** (see [architecture.md](./architecture.md)),
  so first paint does not wait on client data fetching for core content. Core content
  MUST NOT rely on client-side fetch when it can be prerendered.
- Images SHOULD be **AVIF** and MUST be sized (`width`/`height` set) to avoid layout
  shift.
- Keep the client bundle lean. `mermaid` is the heaviest dependency; diagram-heavy code
  SHOULD load only where needed, and large dependencies MUST NOT be added without cause
  (see [non-goals.md](./non-goals.md)).
- Target: fast LCP on the static routes; no unnecessary blocking scripts.

## SEO & metadata

Every route ships full metadata today (see `App.tsx`, `ArticlePage.tsx`, and
[`core/seo.ts`](../../src/src/core/seo.ts)); a change MUST NOT regress this.

- A new route **MUST** ship a `<title>`, `<meta name="description">`, a canonical URL,
  Open Graph tags, and appropriate JSON-LD (Person, WebSite, Article, or BreadcrumbList).
- New routes **MUST** be added to `getStaticRoutes()` so they are prerendered and appear
  in `sitemap.xml` (see [architecture.md](./architecture.md#ssr--prerender-contract)).
- Machine-readable outputs (`sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`)
  **SHOULD** stay complete as routes are added.

## TypeScript strictness

Enforced by [`src/tsconfig.json`](../../src/tsconfig.json):

- `strict: true`, `isolatedModules: true`, `resolveJsonModule: true`.
- No implicit `any`; new data MUST be typed against `src/src/types/`.
- Use the `@/` and `@content/` path aliases rather than long relative paths.

## Testing

The detailed testing contract — unit-test guidelines, the build gate, and planned
deployment validation — is in [testing.md](./testing.md).

- Runner: **vitest**. `npm run test` (CI), `npm run test:watch`, `npm run test:coverage`.
- Tests are colocated with the code as `*.test.ts` / `*.test.tsx` (e.g.
  `core/articles.test.ts`, `core/data.test.ts`).
- A change to core logic (`src/src/core/`) or a data contract MUST add or update tests.
- New tests use Testing Library + jsdom (already configured).
- After a deploy, deployment validation SHOULD confirm the live URL is actually valid
  (see [testing.md](./testing.md#deployment-validation)).
- Active non-Dependabot PR previews MUST pass the Chromium-only Playwright acceptance
  suite. It covers hydrated navigation/history, persistent theme state, runtime page
  errors, and one representative mobile navigation path without duplicating HTTP smoke
  coverage in the dedicated [`Playwright`](../../.github/workflows/playwright.yml)
  workflow (see [testing.md](./testing.md#browser-acceptance-suite)).

## Linting & formatting

The full linting contract — toolchain, CI gate, and how to add custom guardrail rules —
is in [linting.md](./linting.md). In short:

- `npm run lint` — ESLint 9 + `typescript-eslint`, with `eslint-config-prettier`
  (config: [`src/eslint.config.mjs`](../../src/eslint.config.mjs)).
- Formatting via Prettier (`.prettierrc`): `npm run format` writes changes and
  `npm run format:check` verifies them.
- A change MUST pass `npm run lint`, `npm run format:check`, and `npm run build`
  cleanly before it's considered done.

## Component conventions

From [`.github/instructions/components.instructions.md`](../../.github/instructions/components.instructions.md):

- Prefer functional components and hooks; import only the hooks/types you use.
- Use the local Radix primitives and semantic Tailwind tokens.
- Keep components small and focused; extract reusable pieces when it improves clarity.

## Definition of Done (reviewer checklist)

A change ships only when all of these hold:

- [ ] `npm run lint` passes.
- [ ] `npm run format:check` passes.
- [ ] `npm run accessibility` passes after `npm run build`.
- [ ] `npm run build` succeeds (client + SSR + prerender).
- [ ] `npm run test` passes; new/changed core logic has tests.
- [ ] The Playwright PR-preview gate passes for deploy-triggering pull requests.
- [ ] Images have alt text and dimensions; new images are AVIF.
- [ ] No new client-side fetching for prerenderable content.
- [ ] New routes ship full metadata (title, description, canonical, OG, JSON-LD) and are in `getStaticRoutes()`.
- [ ] Types added/updated in `src/src/types/`; no implicit `any`.
- [ ] Change stays within scope ([non-goals.md](./non-goals.md)).
