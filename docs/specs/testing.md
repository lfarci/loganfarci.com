---
spec: testing
version: 0.1.0
status: current-state
---

# Testing Spec

[Back to the specs index.](./README.md)

How this project verifies correctness — from unit tests that run in CI today to the
**deployment validation** that answers one question: _is the version that just went
live actually working?_ Requirement keywords (**MUST**, **SHOULD**, **MAY**) follow
[RFC 2119](./README.md#requirement-levels). All commands run from `src/`.

The enforced gate lives in [quality-bars.md](./quality-bars.md#testing); this spec is
the detailed contract behind it. Sections marked **Planned** are direction, not
current behavior.

## Testing strategy

The site is **static prerendered HTML with no runtime server** (see
[architecture.md](./architecture.md#ssr--prerender-contract)), which shapes the whole
strategy: there is no backend to integration-test, so confidence comes from three
layers.

| Layer | Scope | Runs | Status |
| --- | --- | --- | --- |
| **Unit** | Pure logic in `core/`, components in isolation | `npm run test` locally; CI on app changes | Current |
| **Build gate** | `npm run build` produces valid client + SSR + prerendered HTML | CI on deploy-triggering app/content changes | Current |
| **Deployment validation** | HTTP smoke checks against a live deployed URL | After each deploy | **Planned** |

Keep the pyramid bottom-heavy: prefer many fast unit tests, a green build, and a
small, high-signal set of smoke checks. Do **not** add a heavy end-to-end framework
without cause (see [non-goals.md](./non-goals.md)) — the deployment checks below are
intentionally lightweight.

## Unit tests

### Tooling and layout

Verified from [`src/vite.config.ts`](../../src/vite.config.ts) and
[`src/package.json`](../../src/package.json):

- Runner: **vitest** with `globals: true` and the **jsdom** environment.
- Setup file: [`src/src/test/setup.ts`](../../src/src/test/setup.ts) — runs Testing
  Library `cleanup()` after each test, clears `localStorage`, resets the document
  class, and polyfills `matchMedia` / `ResizeObserver`.
- Component rendering: **@testing-library/react**.
- Coverage: **@vitest/coverage-v8** (`text`, `json`, `html` reporters).
- Test files match `src/**/*.test.{ts,tsx}` and `tests/unit/**/*.test.{ts,tsx}`, and
  are **colocated** next to the code (e.g.
  [`core/data.test.ts`](../../src/src/core/data.test.ts),
  [`core/articles.test.ts`](../../src/src/core/articles.test.ts),
  [`components/shared/ThemeToggle.test.tsx`](../../src/src/components/shared/ThemeToggle.test.tsx)).

### Commands

| Command | Use |
| --- | --- |
| `npm run test` | One-shot run (what CI runs). |
| `npm run test:watch` | Watch mode while developing. |
| `npm run test:coverage` | Run with a coverage report. |

### What MUST be tested

- **Core logic.** Any change to `src/src/core/` (articles, data accessors, SEO,
  commands, date/string helpers) **MUST** add or update a colocated `*.test.ts`.
- **Data contracts.** A change to a `content/data/*.json` shape or its accessor in
  `core/data.ts` **MUST** be covered — see the mock-and-assert pattern in
  [`core/data.test.ts`](../../src/src/core/data.test.ts) and
  [data-contracts.md](./data-contracts.md).
- **Behavioral component logic.** Components with real behavior (theme toggle,
  terminal commands, prompt handling) **MUST** have tests. Purely presentational
  components **MAY** be left untested.

### Guidelines

- **Test behavior, not implementation.** Query by **role and accessible name**
  (`getByRole("button", { name: ... })`), not by test IDs or DOM structure — this
  doubles as an accessibility check (see [accessibility.md](./accessibility.md)).
- **Mock content at the module boundary.** Stub `@content/data/*.json` and article
  imports with `vi.mock` rather than depending on real content, so tests stay stable
  as content changes.
- **Deterministic and offline.** No real network, no wall-clock dependence, no shared
  state between tests. The setup file already resets globals after each test.
- **One behavior per `it`**, arranged Arrange–Act–Assert. Prefer one primary
  assertion per test so failures are easy to diagnose; use a second assertion only
  when both checks describe the same outcome. Name the `describe` after the unit and
  the `it` after the observable behavior.
- **Keep them fast.** A slow unit test usually means the boundary is wrong — mock it.

## Build gate

A change **MUST** pass `npm run build` (client → SSR → prerender) cleanly before it
ships (see [quality-bars.md](./quality-bars.md#definition-of-done-reviewer-checklist)).
In CI the build runs as the first step of the deploy workflow
([`reusable-deploy-static-web-app.yml`](../../.github/workflows/reusable-deploy-static-web-app.yml)
via [`deploy-app.yml`](../../.github/workflows/deploy-app.yml)), so it is exercised on
**deploy-triggering changes** — pushes to `main` and PRs touching `src/**` or
`content/**`. Changes that don't match those path filters (e.g. docs- or infra-only)
are not build-gated in CI, so run `npm run build` locally for those.
The build is itself a test: it fails if a route can't be server-rendered, if
`getStaticRoutes()` references a missing page, or if the prerender step
([`scripts/prerender.mjs`](../../src/scripts/prerender.mjs)) can't emit the HTML,
`sitemap.xml`, `robots.txt`, `llms.txt`, and `llms-full.txt`. Treat a red build as a
failing test, never as noise to work around.

## Deployment validation (Planned)

> **Status: planned — not yet wired.** This is the core of "quickly assess whether a
> deployed version is actually valid." It is defined here so it lands consistently.

Goal: after a deploy — **preview** (`pr-<n>`) or **production** — run a small suite of
HTTP checks against the **live URL** and fail loudly if the site is broken. This
catches problems a local build cannot: a bad SWA config, a broken
`navigationFallback`, missing assets, or a route that 404s in production.

### Where it hooks in

The deploy workflows already surface the target:
[`reusable-deploy-static-web-app.yml`](../../.github/workflows/reusable-deploy-static-web-app.yml)
outputs `static_web_app_url`, consumed by
[`deploy-app.yml`](../../.github/workflows/deploy-app.yml). A validation job
**SHOULD** run **after** `deploy_preview` / `deploy_production`, take that URL as
input, and gate the deploy's success on the checks passing.

### What to check (smoke suite)

Against the deployed base URL, the suite **SHOULD** assert:

- **Routes return `200`.** Every route from `getStaticRoutes()` — `/`, `/about`,
  `/articles`, and at least one `/articles/{slug}` — responds `200` with
  `content-type: text/html`.
- **Content is prerendered, not blank.** Each route's HTML contains real body content
  inside `<div id="root">` (not an empty shell), confirming the prerender shipped.
- **SEO head is intact.** Each page has a non-empty `<title>`, a
  `<meta name="description">`, a `<link rel="canonical">`, Open Graph tags, and the
  expected JSON-LD — matching [quality-bars.md](./quality-bars.md#seo--metadata).
- **Machine files are reachable.** `sitemap.xml`, `robots.txt`, `llms.txt`, and
  `llms-full.txt` all return `200` with a sensible content-type and non-empty body.
- **404 fallback works.** An unknown path serves the `/404.html` fallback configured
  in [`staticwebapp.config.json`](../../src/public/staticwebapp.config.json) — ideally
  with a `404` status — rather than a broken or blank page.
- **Static assets load.** A referenced hashed JS/CSS asset and a key image resolve
  `200`.

Optionally, the production run **MAY** assert the deployed commit matches the expected
SHA by reading the `VITE_COMMIT_HASH` surfaced in the UI/footer, to confirm the right
build went live.

### Constraints

- **Stay lightweight and static-friendly.** Prefer a small **Node script** or a
  **vitest** suite that `fetch`es the deployed URL over a heavy browser-automation
  framework. Any browser-driven tool (e.g. Playwright) is a heavy dependency and
  **MUST** be justified against [non-goals.md](./non-goals.md) before adoption.
- **No runtime server or datastore.** These are black-box HTTP checks against static
  output; they **MUST NOT** introduce a backend to test against.
- **Fast and reliable.** The suite should finish in seconds and avoid flaky waits, so
  a red result reliably means "the deploy is broken," not "the test is flaky."

## Definition of Done (testing)

A change satisfies the testing bar when:

- [ ] `npm run test` passes; new/changed core logic and data contracts have colocated tests.
- [ ] Component tests query by role/accessible name and mock content at the boundary.
- [ ] `npm run build` succeeds (client + SSR + prerender).
- [ ] Once deployment validation lands: the post-deploy smoke suite is green against the deployed URL.
