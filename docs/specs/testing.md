---
spec: testing
version: 0.3.1
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
strategy: there is no backend to integration-test, so confidence comes from four
layers.

| Layer | Scope | Runs | Status |
| --- | --- | --- | --- |
| **Unit** | Pure logic in `core/`, components in isolation | `npm run test` locally; CI on app changes | Current |
| **Build gate** | `npm run build` produces valid client + SSR + prerendered HTML | CI on deploy-triggering app/content changes | Current |
| **Deployment validation** | HTTP smoke checks against a live deployed URL | After each deploy | Current |
| **Browser acceptance** | Hydration, client navigation/history, persistent browser state, and runtime errors | After each active non-Dependabot PR preview deploy | Current |

Keep the pyramid bottom-heavy: prefer many fast unit tests, a green build, and small,
high-signal deployment checks. Playwright is limited to Chromium on PR previews and
only covers behavior that HTTP checks cannot observe; it remains a development/CI
dependency and does not enter the production bundle.

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

### Markdown and diagram test boundary

Markdown tests cover semantic element mapping, GFM behavior, safe handling of raw
HTML, Mermaid fence routing, and the Vite plugin's front-matter transformation.
Mermaid tests mock its module boundary and verify initialization, rendering requests,
and error reporting. Exact generated SVG markup, layout, and browser paint are
intentionally not unit-tested: Mermaid owns that output, jsdom does not provide
meaningful layout coverage, and browser automation would exceed this suite's
lightweight scope.

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

## Deployment validation

Goal: after a deploy — **preview** (`pr-<n>`) or **production** — run a small suite of
HTTP checks against the **live URL** and fail loudly if the site is broken. This
catches problems a local build cannot: a bad SWA config, a broken
`navigationFallback`, missing assets, or a route that 404s in production.

### Where it hooks in

The deploy workflows surface the target URL:
[`reusable-deploy-static-web-app.yml`](../../.github/workflows/reusable-deploy-static-web-app.yml)
outputs `static_web_app_url`, consumed by
[`deploy-app.yml`](../../.github/workflows/deploy-app.yml). Validation jobs run
**after** `deploy_preview` / `deploy_production`, take that URL as input, and gate the
deploy's success on the checks passing.

### What to check (smoke suite)

Against the deployed base URL, the suite asserts:

- **Routes return `200`.** Every route from `getStaticRoutes()` — `/`, `/about`,
  `/articles`, and at least one `/articles/{slug}` — responds `200` with
  `content-type: text/html`.
- **Content is prerendered, not blank.** Each route's HTML contains real body content
  inside `<div id="root">` (not an empty shell), confirming the prerender shipped.
- **SEO head is intact.** Each page has a non-empty `<title>`, a
  `<meta name="description">`, a `<link rel="canonical">`, Open Graph
  `og:title`/`og:description`, and non-empty JSON-LD markup, matching
  [quality-bars.md](./quality-bars.md#seo--metadata).
- **Machine files are reachable.** `sitemap.xml`, `robots.txt`, `llms.txt`, and
  `llms-full.txt` all return `200` with file-appropriate content-type and file-specific
  content markers, so HTML fallback pages cannot pass as valid machine files.
- **404 fallback works.** An unknown path serves the `/404.html` fallback configured
  in [`staticwebapp.config.json`](../../src/public/staticwebapp.config.json), with the
  custom not-found page markers (not a generic host 404 page).

The smoke command can be run locally against any deployed environment:
`npm run smoke -- <base-url>` from `src/`.

### Browser acceptance suite

The dedicated [`playwright.yml`](../../.github/workflows/playwright.yml) workflow is
called by `deploy-app.yml` after a successful active, non-Dependabot PR preview deploy
and uses that deployment's `static_web_app_url`. Page specs are colocated with their
page components as `*.spec.ts`, navigation coverage is colocated with the layout
component it exercises, and shared Playwright helpers live in `src/test/playwright/`.
The suite MUST remain focused on hydrated browser behavior: visible core-page contracts,
primary desktop and mobile navigation, menu dismissal and responsive state, article
deep links and navigation, browser Back/Forward, keyboard skip navigation, and explicit
theme persistence across navigation and reload. HTTP status codes, prerendered markup,
metadata, machine files, assets, and the 404 fallback remain the Node smoke suite's
responsibility.

Run the browser suite against a local Azure Static Web Apps emulator or deployed
environment from `src/`. The SWA emulator serves the prerendered HTML for clean deep
links such as `/about`; Vite preview's fallback serves the root document for those
requests and can cause hydration mismatches.

```bash
npm run build
npm run preview:swa
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4280 npm run test:e2e
PLAYWRIGHT_BASE_URL=https://example-preview.azurestaticapps.net npm run test:e2e
```

The reusable workflow can also be dispatched manually with a deployed base URL. Its
blocking CI job installs Chromium only, has an explicit timeout, retries at most once
in CI, and uploads the HTML report and retained failure trace only when the run fails.
Tests MUST use roles and accessible names, web-first assertions, and no fixed sleeps or
test-only selectors. The suite blocks browser requests outside the target preview so
it remains deterministic and independent of mutable external services.

The suite includes axe audits for `/`, `/about`, `/articles`, and a representative
article route, failing on serious or critical violations. The [screen-reader validation
procedure](../screen-reader-validation.md) defines the complementary manual pass and
its repeatable result template.

### Constraints

- **Stay lightweight and static-friendly.** Keep HTTP coverage in the Node smoke
  script. Browser automation MUST stay confined to the justified Playwright boundary
  above and MUST NOT duplicate static deployment checks.
- **No runtime server or datastore.** These are black-box HTTP checks against static
  output; they **MUST NOT** introduce a backend to test against.
- **Fast and reliable.** The suite should finish in seconds and avoid flaky waits, so
  a red result reliably means "the deploy is broken," not "the test is flaky."

## Definition of Done (testing)

A change satisfies the testing bar when:

- [ ] `npm run test` passes; new/changed core logic and data contracts have colocated tests.
- [ ] Component tests query by role/accessible name and mock content at the boundary.
- [ ] `npm run build` succeeds (client + SSR + prerender).
- [ ] Post-deploy smoke suite is green against the deployed URL.
- [ ] The Playwright suite is green against the PR preview URL when the change deploys a preview.
